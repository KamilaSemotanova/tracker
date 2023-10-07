import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import style from './Layout.module.scss';

export const Layout = () => (
  <main className={style.main}>
    <Header />
    <div className={style.content}>Content</div>
    <Footer />
  </main>
);
