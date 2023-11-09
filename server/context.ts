import { NextApiRequest } from 'next';
import { TRPCError, inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

import { prisma } from './db';
import { verifyJwt } from './utils/jwt';

export const deserializeUser = async (req: NextApiRequest) => {
  try {
    const notAuthenticated = null;

    if (!req.headers.authorization?.startsWith('Bearer')) {
      return notAuthenticated;
    }

    const [, accessToken] = req.headers.authorization.split(' ');

    if (!accessToken) {
      return notAuthenticated;
    }

    const decoded = verifyJwt(accessToken);

    if (!decoded) {
      return notAuthenticated;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      return notAuthenticated;
    }

    return user;
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => ({
  prisma,
  user: await deserializeUser(opts.req),
  ...opts,
});

export type Context = inferAsyncReturnType<typeof createTRPCContext>;
