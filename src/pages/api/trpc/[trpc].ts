import { createNextApiHandler } from '@trpc/server/adapters/next';
import { NextApiRequest, NextApiResponse } from 'next';

import { appRouter } from '../../../../server/root';
import { createTRPCContext } from '../../../../server/context';

const allowCors =
  (fn: any) => async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    );

    if (req.method === 'OPTIONS') {
      res.status(200).end();

      return;
    }

    return await fn(req, res);
  };

export default allowCors(
  createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
  }),
);
