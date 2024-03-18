import express from 'express';
import { getPayloadClient } from './get-payload';
import { nextApp, nextHandler } from './next-utils';

const app = express();

const PORT = Number(process.env.port) || 3000;

const expressStartup = async () => {
    const payload = await getPayloadClient({ initOptions:{ express: app, onInit: async (cms) => { cms.logger.info(`Admin URL ${ cms.getAdminURL() }`) } } });

    app.use((req, res)=> nextHandler(req, res))

    nextApp.prepare().then(()=> {
        payload.logger.info("NextJS server is running")

        app.listen(PORT, async ()=> {
            payload.logger.info(`Next.js App URL: ${ process.env.Next_PUBLIC_SERVER_URL }` );
        })
    })
};

expressStartup()