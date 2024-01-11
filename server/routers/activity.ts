import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { formatDate } from '../utils/date';
import { createTRPCRouter, privateProcedure } from '../trpc';
import { indexToMap } from '../utils/dataHelper';

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
    .input(z.object({ name: z.string(), amount: z.number(), unit: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newActivity = await ctx.prisma.activity.create({
        data: {
          name: input.name,
          userId: ctx.user?.id,
          amount: input.amount,
          unit: input.unit,
        },
      });

      return newActivity;
    }),

  streakVerification: privateProcedure
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

      const streak = await ctx.prisma.activityRecord.groupBy({
        by: ['createdAt'],
        where: {
          activityId: input.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        _sum: {
          addedAmount: true,
        },
      });

      const today = formatDate(new Date());

      const startIndex = streak.findIndex((entry) => entry.createdAt === today);
      let streakCount = 0;

      if (startIndex === -1) {
        return streakCount;
      }

      const nextDateInStreak = new Date();

      streak.forEach((entry) => {
        if (entry.createdAt !== formatDate(nextDateInStreak)) {
          return streakCount;
        }

        const addedAmount = entry._sum.addedAmount || -1;

        if (addedAmount >= activity.amount) {
          streakCount++;
        } else {
          return streakCount;
        }

        nextDateInStreak.setDate(nextDateInStreak.getDate() - 1);
      });

      return streakCount;
    }),

  streakVerificationInDate: privateProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input, ctx }) => {
      const activity = await ctx.prisma.activity.findMany({
        where: {
          userId: ctx.user?.id,
        },
      });

      const activityMap = indexToMap(activity, 'id');

      const streak = await ctx.prisma.activityRecord.groupBy({
        by: ['activityId'],
        where: {
          createdAt: input.date,
          userId: ctx.user?.id,
        },
        _sum: {
          addedAmount: true,
        },
      });

      const completedActivities = streak.map((entry) => {
        const matchingActivity = activityMap.get(entry.activityId);

        if (!matchingActivity) {
          return { ...entry, completed: false };
        }

        const addedAmount = entry._sum.addedAmount || -1;

        if (addedAmount >= matchingActivity.amount) {
          return { ...entry, completed: true };
        } else {
          return { ...entry, completed: false };
        }
      });

      return completedActivities.reduce(
        (acc: Record<number, (typeof completedActivities)[number]>, entry) => {
          acc[entry.activityId] = entry;

          return acc;
        },
        {},
      );
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
