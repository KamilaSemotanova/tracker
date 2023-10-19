import { ReactNode } from 'react';

import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { Authorization } from '../Authorization/Authorization';
import style from './Layout.module.scss';

type LayoutProps = {
  children?: ReactNode;
  registrationPage?: ReactNode;
  dashboardPage?: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <main className={style.main}>
    <Header />
    <Authorization />
    <div className={style.content}>{children}</div>
    <Footer />
  </main>
);
