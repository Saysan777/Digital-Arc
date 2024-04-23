
import { z } from "zod";
import { authRouter } from "./endpoints/auth-router";
import { privateProcedure, publicProcedure, router } from "./server-trpc";
import { QueryValidator } from "../lib/validators/query-validator";
import { getPayloadClient } from "../get-payload";
import { paymentRouter } from "./endpoints/payment-router";
import { TRPCError } from "@trpc/server";

// creating api using trpc.
export const appRouter = router({
    auth: authRouter,

    getInfiniteProducts: publicProcedure.input(z.object({ 
        limit: z.number().min(1).max(100), 
        cursor: z.number().nullish(),
        query: QueryValidator
    })).query(async ({ input })=> {
        const { query, cursor } = input;
        const { sort, limit, ...queryOpts } = query;

        const parsedQueryOpts: Record<string, { equals: string }> = {}
        
        // Parsing the queryopts input to mongodb or payload db query format.
        Object.entries(queryOpts).forEach(([ key, value ])=> {
            parsedQueryOpts[ key ] = { equals: value }
        });
        
        const page = cursor || 1;       // Cursor means page number. Default is one. payload returns data sets as pages.

        const payload = await getPayloadClient();

        const { docs: items, hasNextPage, nextPage } = await payload.find({
            collection: 'products',
            where: {
                approvedForSale: {
                    equals: 'Approved',
                },
                ...parsedQueryOpts
            },
            sort,
            depth: 1,
            limit,
            page,                   // if page is passed as arg, we can take specific page from the list of document returned from db. (Payload returns result in pages automatically)
        });

        return {
            items,
            nextPage: hasNextPage ? nextPage : null
        }
    }),

    payment: paymentRouter,
});

export type AppRouter = typeof appRouter;