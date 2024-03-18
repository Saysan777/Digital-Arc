import dotenv from "dotenv";
import path from "path";
import payload from "payload";
import type { InitOptions } from "payload/config";

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
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
export const getPayloadClient = async ({ initOptions }: Args = {}) => {
    if(!process.env.PAYLOAD_SECRET) {
        throw new Error("PAYLOAD_SECRET is not found");
    }

    if(cached.client) {
        return cached.client;
    }

    if(!cached.promise) {
        cached.promise = payload.init({ secret: process.env.PAYLOAD_SECRET, local:initOptions?.express ? false: true, ...(initOptions || {}) })
    }

    try{
        cached.client = await cached.promise
    } catch(e: unknown) {
        cached.promise = null
        throw e;
    }

    return cached.client;
}