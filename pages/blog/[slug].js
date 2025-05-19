import { useRouter } from 'next/router';
import posts from '../../data/posts.json';
import ReactMarkdown from 'react-markdown';
import styles from '../../styles/Home.module.css';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const post = posts.find((p) => p.slug === slug);

  if (!post) return <p style={{ padding: '2rem' }}>Post not found.</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{post.title}</h1>
        <p className={styles.date}>{post.date}</p>
      </header>

      <main className={styles.main}>
        <ReactMarkdown>{post.content}</ReactMarkdown>
        <div style={{ marginTop: '3rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
          <img src="/profile.jpg" alt="Steve Hathaway" style={{ width: 60, borderRadius: '50%' }} />
          <p><strong>Steve Hathaway</strong></p>
          <p style={{ fontStyle: 'italic' }}>“Decisions, Direction, and a Dash of Experience.”</p>
        </div>
      </main>
    </div>
  );
}
