import { z } from 'zod';
import bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();

    return users;
  }),

  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().toLowerCase(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newUser = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      });

      return newUser;
    }),

  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
      });

      const hasMatchingPassword = await bcrypt.compare(
        input.password,
        user?.password || '',
      );

      if (!user || hasMatchingPassword) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid email or password',
        });
      }

      return user;
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });

      return updatedUser;
    }),

  deleteUser: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const deletedUser = await ctx.prisma.user.delete({
        where: { id: input },
      });

      return deletedUser;
    }),
});
