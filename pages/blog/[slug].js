import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      const snapshot = await getDocs(collection(db, 'posts'));
      const match = snapshot.docs
        .map(doc => doc.data())
        .find(p => p.slug === slug);

      setPost(match || null);
    };

    fetchPost();
  }, [slug]);

  if (!post) return <p style={{ padding: '2rem' }}>Loading post...</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1>{post.title}</h1>
          <Link href="/admin" className={styles.adminLink}>Admin</Link>
        </div>
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
