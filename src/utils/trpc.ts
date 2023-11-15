import { createTRPCReact } from '@trpc/react-query';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

import type { AppRouter } from '../../server/root';

export const trpc = createTRPCReact<AppRouter>();

const cors = Cors();

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });

export const withCors =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    return await handler(req, res);
  };
