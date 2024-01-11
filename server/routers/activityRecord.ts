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
        // získání všech záznamů aktivity
        const dayActivityRecords = await ctx.prisma.activityRecord.findMany({
          where: {
            userId: ctx.user?.id,
            activityId: input.activityId,
          },
        });

        // zjištění, jestli není ten den počet záznamů 0
        if (dayActivityRecords.length === 0) {
          return 0;
        }

        // zjištění cílového počtu záznamů v daný den
        const targetActivityRecord = await ctx.prisma.activity
          .findUnique({
            where: {
              id: dayActivityRecords[0].activityId,
            },
          })
          .then((activity) => activity?.amount);

        // definování funkce, která získá počet záznamů v daný den
        const today = formatDate(new Date());

        let daysBack = 0;
        let foundIncomplete = false;

        while (!foundIncomplete) {
          const someTimeAgo = sub(today, { days: daysBack });
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
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to verify streak',
        });
      }
    }),

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
