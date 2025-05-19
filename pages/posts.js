import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      const snap = await getDocs(collection(db, 'posts'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
    fetchData();
  }, []);

  const handleLike = async (post) => {
    const docRef = doc(db, 'posts', post.id);
    const newCount = (post.likes || 0) + 1;
    await updateDoc(docRef, { likes: newCount });
    setPosts(posts.map(p => p.id === post.id ? { ...p, likes: newCount } : p));
  };

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.date.includes(search)
  );

  return (
    <Layout title="Posts">
      <h1>All Posts</h1>
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={styles.searchInput}
      />
      <section className={styles.postList}>
        {filtered.map(post => (
          <div key={post.id} className={styles.postCard} style={{ position: 'relative' }}>
            <button
              onClick={() => handleLike(post)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ❤️ {post.likes || 0}
            </button>
            <Link href={`/blog/${post.slug}`} className={styles.postCard}>
              <h2>{post.title}</h2>
              <p className={styles.date}>{post.date}</p>
              <p>{post.excerpt}</p>
              <span className={styles.readMore}>Read more →</span>
            </Link>
          </div>
        ))}
      </section>
    </Layout>
  );
}
