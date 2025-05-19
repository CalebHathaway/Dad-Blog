import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function getStaticProps() {
  try {
    const snapshot = await getDocs(collection(db, 'posts'));
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return { props: { posts: sorted } };
  } catch (err) {
    console.error('Firestore error:', err);
    return { props: { posts: [] } };
  }
}

export default function Posts({ posts }) {
  return (
    <div className={styles.pageWrapper}>
      <Head>
        <title>Posts - Presidential Perspective</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>Presidential Perspective</div>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <h1>All Posts</h1>

        <section className={styles.postList}>
          {posts.length === 0 ? (
            <p>No blog posts found.</p>
          ) : (
            posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className={styles.postCard}>
                <h2>{post.title}</h2>
                <p className={styles.date}>{post.date}</p>
                <p>{post.excerpt}</p>
              </Link>
            ))
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Steve Hathaway</p>
      </footer>
    </div>
  );
}
