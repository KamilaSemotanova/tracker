import { createNextApiHandler } from '@trpc/server/adapters/next';

import { appRouter } from '../../../../server/root';
import { createTRPCContext } from '../../../../server/context';

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  responseMeta(ctx) {
    ctx.ctx?.res?.setHeader('Access-Control-Allow-Origin', '*');
    ctx.ctx?.res?.setHeader('Access-Control-Request-Method', '*');
    ctx.ctx?.res?.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, DELETE, PUT, PATCH',
    );
    ctx.ctx?.res?.setHeader('Access-Control-Allow-Headers', '*');

    if (ctx.ctx?.req?.method === 'OPTIONS') {
      ctx.ctx?.res?.writeHead(200);
    }

    return {
      headers: ctx.ctx?.res?.getHeaders() as Record<string, string>,
      statusCode: ctx.ctx?.res?.statusCode || 200,
    };
  },
});
