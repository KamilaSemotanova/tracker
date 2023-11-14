import '../styles/globalStyles.scss';
import { AppType } from 'next/app';
import Head from 'next/head';
import localFont from 'next/font/local';

import { api } from '~/utils/api';
import { AuthenticationProvider } from '../components/AuthenticationProvider';

const mulishFont = localFont({ src: '../fonts/Mulish/Mulish-Regular.woff2' });

const MyApp: AppType = ({ Component, pageProps }) => (
  <>
    <style jsx global>{`
      html {
        font-family:
          ${mulishFont.style.fontFamily},
          -apple-system,
          Cantarell,
          Droid Sans,
          Helvetica Neue;
      }
    `}</style>
    <Head>
      <title>Tracker</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <AuthenticationProvider>
      <Component {...pageProps} />
    </AuthenticationProvider>
  </>
);

export default api.withTRPC(MyApp);
