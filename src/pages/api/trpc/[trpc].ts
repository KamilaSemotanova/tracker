import { createNextApiHandler } from '@trpc/server/adapters/next';

import { appRouter } from '../../../../server/root';
import { createTRPCContext } from '../../../../server/context';
import { withCors } from '../../../utils/trpc';

export default withCors(
  createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
  }),
);
