import express from 'express';
import { getPayloadClient } from './get-payload';
import { nextApp, nextHandler } from './next-utils';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc';

const app = express();

const PORT = Number(process.env.port) || 3000;

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({ req, res });

const expressStartup = async () => {
    const payload = await getPayloadClient({
        initOptions: {
            express: app,
            onInit: async (cms) => {
                cms.logger.info(`Admin URL ${ cms.getAdminURL() }`)
                }
        }
    });

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