import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { Analytics } from '@vercel/analytics/react';

export default function Layout({ title, children }) {
  return (
    <div className={styles.pageWrapper}>
      <Head>
        <title>{title ? `${title} - Steve Hathaway` : 'Steve Hathaway'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Insights and direction from Steve Hathaway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>Steve Hathaway</div>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/resume">Resume</Link>
          <Link href="/admin">Admin</Link>
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
