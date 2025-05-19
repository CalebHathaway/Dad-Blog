import Link from 'next/link';
import styles from '../styles/Home.module.css';
import posts from '../data/posts.json';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Presidential Perspective</h1>
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
