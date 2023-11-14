import { TRPCClientError, httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';
import Router from 'next/router';

import { AppRouter } from '../../server/root';
import { TOKEN_KEY } from '../components/AuthenticationProvider';
import { isServer } from './env';

const getBaseUrl = () => {
  if (isServer()) {
    return '';
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const handleUnauthorizedErrorsOnClient = (error: unknown) => {
  if (isServer()) {
    return false;
  }

  if (!(error instanceof TRPCClientError)) {
    return false;
  }

  if (error.data?.code !== 'UNAUTHORIZED') {
    return false;
  }

  Router.push('/prihlaseni');

  return true;
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
          headers: () => {
            if (isServer()) {
              return {};
            }

            const token = window.localStorage.getItem(TOKEN_KEY);

            if (!token) {
              return {};
            }

            return {
              Authorization: `Bearer ${token}`,
            };
          },
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (handleUnauthorizedErrorsOnClient(error)) {
                return false;
              }

              return failureCount < 3;
            },
          },
          mutations: {
            retry: (_, error) => {
              handleUnauthorizedErrorsOnClient(error);

              return false;
            },
          },
        },
      },
    };
  },

  ssr: false,
});
