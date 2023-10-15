import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const activityRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const activities = await ctx.prisma.activity.findMany();

    return activities;
  }),

  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newActivity = await ctx.prisma.activity.create({
        data: {
          name: input.name,
        },
      });

      return newActivity;
    }),

  read: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const activity = await ctx.prisma.activity.findUnique({
        where: {
          id: input.id,
        },
      });

      return activity;
    }),

  updateDoneCounter: publicProcedure
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

      return updatedActivity;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const deletedActivity = await ctx.prisma.activity.delete({
        where: {
          id: input.id,
        },
      });

      return deletedActivity;
    }),
});
