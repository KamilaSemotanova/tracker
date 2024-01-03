import { activityRouter } from './routers/activity';
import { activityRecordRouter } from './routers/activityRecords';
import { userRouter } from './routers/user';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  activities: activityRouter,
  user: userRouter,
  activityRecord: activityRecordRouter,
});

export type AppRouter = typeof appRouter;
