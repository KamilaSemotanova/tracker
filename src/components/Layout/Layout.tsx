import { ReactNode } from 'react';

import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import style from './Layout.module.scss';

type LayoutProps = {
  children?: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <main className={style.main}>
    <Header />
    <div className={style.content}>
      <div className={style.children}>{children}</div>
    </div>
    <Footer />
  </main>
);
