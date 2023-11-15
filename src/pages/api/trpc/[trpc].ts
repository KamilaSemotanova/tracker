import { createNextApiHandler } from '@trpc/server/adapters/next';

import { appRouter } from '../../../../server/root';
import { createTRPCContext } from '../../../../server/context';

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  responseMeta(ctx) {
    ctx.ctx?.res?.setHeader('Access-Control-Allow-Origin', '*');
    ctx.ctx?.res?.setHeader('Access-Control-Allow-Credentials', 'true');
    ctx.ctx?.res?.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS,GET,POST,DELETE,PUT,PATCH',
    );
    ctx.ctx?.res?.setHeader(
      'Access-Control-Allow-Headers',
      'authorization,x-csrf-token,x-requested-with,accept,accept-version,content-length,content-md5,content-type,date,x-api-version',
    );

    if (ctx.ctx?.req?.method === 'OPTIONS') {
      ctx.ctx?.res?.writeHead(200);
    }

    return {
      headers: ctx.ctx?.res?.getHeaders() as Record<string, string>,
      statusCode: ctx.ctx?.res?.statusCode || 200,
    };
  },
});
