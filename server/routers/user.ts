import { z } from 'zod';
import bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';

import { signJwt } from '../utils/jwt';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';

type User = {
  id: number;
  email: string;
  name: string | null;
  password: string;
};

export const signTokens = async (user: User) => {
  const access_token = signJwt(
    { sub: user.id },
    {
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
    },
  );

  const refresh_token = signJwt(
    { sub: user.id },
    {
      expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}m`,
    },
  );

  return { access_token, refresh_token };
};

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().toLowerCase(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Registration failed.',
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newUser = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      });

      const { access_token, refresh_token } = await signTokens(newUser);

      return { access_token, refresh_token };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
      });

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      const hasMatchingPassword = await bcrypt.compare(
        input.password,
        user.password,
      );

      if (!hasMatchingPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      const { access_token, refresh_token } = await signTokens(user);

      return { access_token, refresh_token };
    }),

  updateUser: privateProcedure
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

  deleteUser: privateProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const deletedUser = await ctx.prisma.user.delete({
        where: { id: input },
      });

      return deletedUser;
    }),
});
