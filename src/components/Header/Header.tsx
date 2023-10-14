import localFont from 'next/font/local';
import classnames from 'classnames';

import style from './Header.module.scss';

const kohoFont = localFont({ src: '../../fonts/KoHo/KoHo-Regular.woff2' });

export const Header = () => (
  <header className={style.container}>
    <div className={classnames(style.title, kohoFont.className)}>tracker</div>
  </header>
);
