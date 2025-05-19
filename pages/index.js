import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, 'posts'));
      const fetchedPosts = snapshot.docs.map(doc => doc.data());
      const sorted = fetchedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(sorted);
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1>Presidential Perspective</h1>
          <Link href="/admin" className={styles.adminLink}>Admin</Link>
        </div>
        <p className={styles.motto}>Decisions, Direction, and a Dash of Experience.</p>
      </header>

      <main className={styles.main}>
        {posts.map(post => (
          <div key={post.slug} className={styles.postPreview}>
            <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
            <p className={styles.date}>{post.date}</p>
            <p>{post.excerpt}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
