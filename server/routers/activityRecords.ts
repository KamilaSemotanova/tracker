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
          done: false,
          addedAmount: 0,
        },
      });

      return newActivityRecord;
    }),

  read: privateProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const activityRecord = await ctx.prisma.activityRecords.findUnique({
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

  update: privateProcedure
    .input(
      z.object({
        id: z.number(),
        activityId: z.number(),
        date: z.date(),
        addedAmount: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedActivityRecord = await ctx.prisma.activityRecords.update({
        where: {
          id: input.id,
        },
        data: {
          activityId: input.activityId,
          date: input.date,
          addedAmount: +input.addedAmount,
        },
      });

      return updatedActivityRecord;
    }),

  updateDoneCounter: privateProcedure
    .input(
      z.object({
        id: z.number(),
        userId: z.number(),
        activityId: z.number(),
        date: z.date(),
        done: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedActivityRecord = await ctx.prisma.activityRecords.update({
        where: {
          id: input.id,
          userId: input.userId,
          activityId: input.activityId,
          date: input.date,
        },
        data: {
          done: input.done,
        },
      });

      return updatedActivityRecord;
    }),

  delete: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const deletedActivityRecord = await ctx.prisma.activityRecords.delete({
        where: {
          id: input.id,
        },
      });

      return deletedActivityRecord;
    }),
});
