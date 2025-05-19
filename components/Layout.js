import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { Analytics } from '@vercel/analytics/react';

export default function Layout({ title, children }) {
  return (
    <div className={styles.pageWrapper}>
      <Head>
        <title>{title ? `${title} - Presidential Perspective` : 'Presidential Perspective'}</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>Presidential Perspective</div>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
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
