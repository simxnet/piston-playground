import { createTRPCRouter } from "@/server/api/trpc";
import { pistonRouter } from "@/server/api/routers/piston";
import { linksRouter } from "./routers/links";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	piston: pistonRouter,
	links: linksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
