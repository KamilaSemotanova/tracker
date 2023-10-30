import { createTRPCRouter } from '~/server/api/trpc';
import { activityRouter } from '~/server/api/routers/activity';
import { userRouter } from '~/server/api/routers/user';

export const appRouter = createTRPCRouter({
  activities: activityRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
