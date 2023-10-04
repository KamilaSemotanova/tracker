import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import styles from "./index.module.css";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Head>
        <title>Tracker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header />
        <div>
          <p>content</p>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Home;
