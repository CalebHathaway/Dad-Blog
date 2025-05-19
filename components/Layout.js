import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { Analytics } from '@vercel/analytics/react';

export default function Layout({ title, children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') setDark(true);
  }, []);

  const toggle = () => {
    localStorage.setItem('darkMode', !dark);
    setDark(!dark);
  };

  return (
    <div className={dark ? `${styles.pageWrapper} ${styles.dark}` : styles.pageWrapper}>
      <Head>
        <title>{title ? `${title} - Presidential Perspective` : 'Presidential Perspective'}</title>
        <meta name="description" content="Insights and direction from Steve Hathaway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>Presidential Perspective</div>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/admin">Admin</Link>
          <button onClick={toggle} className={styles.toggle}>
            {dark ? '☀️' : '🌙'}
          </button>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Steve Hathaway</p>
      </footer>

      <Analytics />
    </div>
  );
}
