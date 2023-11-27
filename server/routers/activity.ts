import { z } from 'zod';

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
      const userId = ctx.user?.id;

      if (!userId) {
        throw new Error('User not found');
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newActivity = await ctx.prisma.activity.create({
        data: {
          name: input.name,
          userId: user.id,
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
          userId: ctx.user?.id,
        },
      });

      return activity;
    }),

  updateDoneCounter: privateProcedure
    .input(z.object({ id: z.number(), timesDone: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const updatedActivity = await ctx.prisma.activity.update({
        where: {
          id: input.id,
          userId: ctx.user?.id,
        },
        data: {
          timesDone: input.timesDone,
        },
      });

      return updatedActivity;
    }),

  delete: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const deletedActivity = await ctx.prisma.activity.delete({
        where: {
          id: input.id,
          userId: ctx.user?.id,
        },
      });

      return deletedActivity;
    }),
});
