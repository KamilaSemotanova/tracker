import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { format, sub, isBefore } from 'date-fns';

import { createTRPCRouter, privateProcedure } from '../trpc';
import { formatDate } from '../utils/date';

export const activityRecordRouter = createTRPCRouter({
  list: privateProcedure.query(({ ctx }) =>
    ctx.prisma.activityRecord.findMany({
      where: {
        userId: ctx.user?.id,
      },
    }),
  ),

  streakVerification: privateProcedure
    .input(z.object({ activityId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        console.log('Verifying streak');
        const dayActivityRecords = await ctx.prisma.activityRecord.findMany({});
        console.log(dayActivityRecords);

        if (dayActivityRecords.length === 0) {
          console.log('No activity records found for the user');
          // No activity records found for the user

          return 0; // Assuming 0 streak in this case
        }

        const targetActivityRecord = await ctx.prisma.activity
          .findUnique({
            where: {
              id: dayActivityRecords[0].activityId,
            },
          })
          .then((activity) => activity?.amount);

        const today = format(new Date(), 'dd-MM-yyyy');

        let daysBack = 0;
        let foundIncomplete = false;

        while (!foundIncomplete) {
          const someTimeAgo = sub(new Date(), { days: daysBack });
          const someTimeAgoFormatted = format(someTimeAgo, 'dd-MM-yyyy');

          const countInDay = getCount(someTimeAgoFormatted);

          const isIncomplete = countInDay < targetActivityRecord;

          if (
            isIncomplete ||
            isBefore(someTimeAgo, new Date(input.createdAt))
          ) {
            foundIncomplete = true;
          }

          daysBack = daysBack - 1;
        }

        const streak = Math.abs(daysBack);

        return streak;
      } catch (error) {
        throw new Error('Failed to verify streak');
      }
    }),
  // if (!targetActivityRecord) {
  //   throw new TRPCError({
  //     code: 'NOT_FOUND',
  //     message: 'Activity record not found',
  //   });
  // }

  // const totalAmount = await ctx.prisma.activityRecord.groupBy({
  //   by: ['createdAt'],
  //   where: {
  //     userId: ctx.user?.id,
  //     activityId: dayActivityRecords[0].activityId,
  //     createdAt: input.createdAt,
  //   },
  //   _sum: {
  //     addedAmount: true,
  //   },
  // });

  // if (!totalAmount[0]) {
  //   throw new TRPCError({
  //     code: 'NOT_FOUND',
  //     message: 'Activity record not found',
  //   });
  // }

  // if (Number(totalAmount[0]._sum.addedAmount) >= targetActivityRecord) {
  //   return true;
  // }

  // return false;

  create: privateProcedure
    .input(z.object({ activityId: z.number(), addedAmount: z.number() }))
    .mutation(({ input, ctx }) =>
      ctx.prisma.activityRecord.create({
        data: {
          activityId: input.activityId,
          userId: ctx.user?.id,
          addedAmount: input.addedAmount,
          createdAt: formatDate(new Date()),
        },
      }),
    ),

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
