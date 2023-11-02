import { createNextApiHandler } from '@trpc/server/adapters/next';

import { appRouter } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';
import { env } from '~/env.js';

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,

  // onError:
  //   env.NODE_ENV === 'development'
  //     ? ({ path, error }) => {
  //         // eslint-disable-next-line no-console
  //         console.error(
  //           `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
  //         );
  //       }
  //     : undefined,

  onError(opts) {
    const { error, type, path, input, ctx, req } = opts;
    console.error('Error:', error);
    // if (error.code === 'INTERNAL_SERVER_ERROR') {
    // }
    if (error.code === 'BAD_REQUEST') {
      return {
        statusCode: 400,
        data: {
          message: error.message,
          input,
        },
      };
    }
  },
});
