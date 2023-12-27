import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, privateProcedure } from '../trpc';

export const activityRecordsRouter = createTRPCRouter({
  list: privateProcedure.query(async ({ ctx }) => {
    const activityRecords = await ctx.prisma.activityRecords.findMany({
      where: {
        userId: ctx.user?.id,
      },
    });

    return activityRecords;
  }),

  create: privateProcedure
    .input(z.object({ activityId: z.number(), date: z.date() }))
    .mutation(async ({ input, ctx }) => {
      const newActivityRecord = await ctx.prisma.activityRecords.create({
        data: {
          activityId: input.activityId,
          userId: ctx.user?.id,
          date: input.date,
        },
      });

      return newActivityRecord;
    }),

  read: privateProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const activityRecord = await ctx.prisma.activityRecord.findUnique({
        where: {
          id: input.id,
        },
      });

      if (ctx.user?.id !== activityRecord?.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No access to this resource',
        });
      }

      return activityRecord;
    }),

  updateDoneCounter: privateProcedure
    .input(z.object({ id: z.number(), timesDone: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const updatedActivityRecord = await ctx.prisma.activityRecord.update({
        where: {
          id: input.id,
        },
        data: {
          timesDone: input.timesDone,
        },
      });

      return updatedActivityRecord;
    }),

  delete: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const deletedActivityRecord = await ctx.prisma.activityRecord.delete({
        where: {
          id: input.id,
        },
      });

      return deletedActivityRecord;
    }),
});
