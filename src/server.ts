import express from 'express';
import { getPayloadClient } from './get-payload';
import { nextApp, nextHandler } from './next-utils';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc';
import { inferAsyncReturnType } from '@trpc/server';
import bodyParser from 'body-parser';
import { IncomingMessage } from 'http';
import { stripeWebhookHandler } from './webhook';
import nextBuild from 'next/dist/build'
import path from 'path';

const app = express();

const PORT = 3000;

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({ req, res });

export type ExpressContext = inferAsyncReturnType<typeof createContext >

export type WebhookRequest = IncomingMessage & { rawBody: Buffer }

// Custom server creation in nextjs14. This is called custom server coz nextjs create backend api using api folder but we're using express.
const expressStartup = async () => {
    const webhookMiddleware = bodyParser.json({
        verify: (req: WebhookRequest, _, buffer) => {
            req.rawBody = buffer;
        }
    })

    app.post('api/webhooks/stripe', webhookMiddleware, stripeWebhookHandler)

    const payload = await getPayloadClient({
        initOptions: {
            express: app,
            onInit: async (cms) => {
                cms.logger.info(`Admin URL ${ cms.getAdminURL() }`)
                }
        }
    });
     
    if(process.env.NEXT_BUILD) {
        app.listen(PORT, async ()=> {
            payload.logger.info('Next.js is building for production');

            // @ts-expect-error
            await nextBuild(path.join(__dirname, '../'))

            process.exit();
        })
        
        return
    }

    //Making the trpc router a express server with this middelware and sending req back to nextjs(check folder api).
    app.use('/api/trpc', trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    }));

    // We redirect every req to nextjs for using nextjs features as ssr, dynamic routing etc.
    app.use((req, res) => nextHandler(req, res));

    nextApp.prepare().then(()=> {
        payload.logger.info("NextJS server is running")

        app.listen(PORT, async ()=> {
            payload.logger.info(`Next.js App URL: ${ process.env.NEXT_PUBLIC_SERVER_URL }` );
        })
    })
};

expressStartup();