import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, privateProcedure } from '../trpc';

export const activityRouter = createTRPCRouter({
  list: privateProcedure.query(async ({ ctx }) => {
    const activities = await ctx.prisma.activity.findMany({
      where: {
        userId: ctx.user?.id,
      },
    });

    return activities;
  }),

  create: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newActivity = await ctx.prisma.activity.create({
        data: {
          name: input.name,
          userId: ctx.user?.id,
        },
      });

      return newActivity;
    }),

  read: privateProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const activity = await ctx.prisma.activity.findUnique({
        where: {
          id: input.id,
        },
      });

      if (ctx.user?.id !== activity?.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No access to this resource',
        });
      }

      return activity;
    }),

  updateDoneCounter: privateProcedure
    .input(z.object({ id: z.number(), timesDone: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const updatedActivity = await ctx.prisma.activity.update({
        where: {
          id: input.id,
        },
        data: {
          timesDone: input.timesDone,
        },
      });

      if (ctx.user?.id !== updatedActivity?.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No access to this resource',
        });
      }

      return updatedActivity;
    }),

  delete: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const deletedActivity = await ctx.prisma.activity.delete({
        where: {
          id: input.id,
        },
      });

      if (ctx.user?.id !== deletedActivity?.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No access to this resource',
        });
      }

      return deletedActivity;
    }),
});
