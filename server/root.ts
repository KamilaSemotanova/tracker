import { createTRPCRouter } from './trpc';
import { activityRouter } from './routers/activity';
import { userRouter } from './routers/user';

export const appRouter = createTRPCRouter({
  activities: activityRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
