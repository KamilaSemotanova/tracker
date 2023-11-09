import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

import { AppRouter } from '../../server/root';
import { TOKEN_KEY } from '../components/AuthenticationProvider';
import { isBrowser, isServer } from './env';

const getBaseUrl = () => {
  if (isServer()) {
    return '';
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const getLocalStorageToken = () => {
  if (isBrowser()) {
    return '';
  }

  const token = localStorage.getItem(TOKEN_KEY);

  return token ? `Bearer ${token}` : '';
};

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers: () => ({
            Authorization: getLocalStorageToken(),
          }),
        }),
      ],
    };
  },

  ssr: false,
});
