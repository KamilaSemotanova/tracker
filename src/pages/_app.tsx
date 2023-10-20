import '../styles/globalStyles.scss';
import { useEffect, useState } from 'react';
import { AppType } from 'next/app';
import Head from 'next/head';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';

import { api } from '~/utils/api';

const mulishFont = localFont({ src: '../fonts/Mulish/Mulish-Regular.woff2' });

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (!isLogged) {
      router.push('/prihlaseni');
    }
  }, []);

  return (
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

      <Component {...pageProps} setIsLogged={setIsLogged} />
    </>
  );
};

export default api.withTRPC(MyApp);
