import { createNextApiHandler } from '@trpc/server/adapters/next';

import { appRouter } from '../../../../server/root';
import { env } from '~/env.js';
import { createTRPCContext } from '../../../../server/context';

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ path, error }) => {
    if (env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(
        `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
      );
    }
  },
});
