import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, privateProcedure } from '../trpc';

export const activityRecordRouter = createTRPCRouter({
  list: privateProcedure.query(({ ctx }) =>
    ctx.prisma.activityRecord.findMany({
      where: {
        userId: ctx.user?.id,
      },
    }),
  ),

  create: privateProcedure
    .input(z.object({ activityId: z.number(), addedAmount: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const newActivityRecord = await ctx.prisma.activityRecord.create({
        data: {
          activityId: input.activityId,
          userId: ctx.user?.id,
          addedAmount: input.addedAmount,
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

  update: privateProcedure
    .input(
      z.object({
        id: z.number(),
        activityId: z.number(),
        createdAt: z.date(),
        addedAmount: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedActivityRecord = await ctx.prisma.activityRecord.update({
        where: {
          id: input.id,
        },
        data: {
          activityId: input.activityId,
          createdAt: input.createdAt,
          addedAmount: +input.addedAmount,
        },
      });

      if (ctx.user?.id !== updatedActivityRecord?.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No access to this resource',
        });
      }

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

      if (ctx.user?.id !== deletedActivityRecord?.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No access to this resource',
        });
      }

      return deletedActivityRecord;
    }),
});
