import { createTRPCRouter } from '~/server/api/trpc';
import { activityRouter } from '~/server/api/routers/activity';

export const appRouter = createTRPCRouter({
  activities: activityRouter,
});

export type AppRouter = typeof appRouter;
