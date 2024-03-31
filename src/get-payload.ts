
import dotenv from "dotenv";
import path from "path";
import payload, { Payload } from "payload";
import type { InitOptions } from "payload/config";
import nodemailer from "nodemailer";

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

//setting up nodemailer using resend api key with payload
const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    secure: true,
    port: 465,
    auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY
    }
});

let cached = (global as any).payload         // Caching the data for faster response in subsequent requests.

if(!cached) {                                // If not found in cached, adding the current request res to cache.
    cached = (global as any).payload = {
        client: null,
        promise: null,
    }
}

interface Args {
    initOptions? : Partial<InitOptions>
}
export const getPayloadClient = async ({ initOptions }: Args = {}): Promise<Payload> => {
    if(!process.env.PAYLOAD_SECRET) {
        throw new Error("PAYLOAD_SECRET is not found");
    }

    if(cached.client) {
        return cached.client;
    }

    // Payload initilization
    if(!cached.promise) {
        cached.promise = payload.init({ 
            email: { 
                transport: transporter,                             // our transporter is resend.
                fromAddress: "onboarding@resend.dev",                // You can also use: onboarding@resend.com which is provided by resend
                fromName: 'Digital Bazaar'
            }, 
            secret: process.env.PAYLOAD_SECRET, 
            local:initOptions?.express ? false: true,
             ...(initOptions || {})
         })
    }

    try{
        cached.client = await cached.promise
    } catch(e: unknown) {
        cached.promise = null
        throw e;
    }

    return cached.client;
}