import localFont from 'next/font/local';
import classnames from 'classnames';
import { useRouter } from 'next/router';

import style from './Header.module.scss';

const kohoFont = localFont({ src: '../../fonts/KoHo/KoHo-Regular.woff2' });

export const Header = () => {
  const router = useRouter();

  return (
    <header className={style.container}>
      <div
        className={classnames(style.title, kohoFont.className)}
        onClick={() => router.push('/')}
        aria-label="Zpět na úvodní stránku"
      >
        tracker
      </div>
    </header>
  );
};
