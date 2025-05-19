import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Layout from '../../components/Layout';
import ReactMarkdown from 'react-markdown';
import styles from '../../styles/Home.module.css';

export async function getServerSideProps({ params }) {
  const snapshot = await getDocs(collection(db, 'posts'));
  const match = snapshot.docs.find(doc => doc.data().slug === params.slug);
  if (!match) return { notFound: true };
  return { props: { post: match.data() } };
}

export default function Post({ post }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('postSlug', '==', post.slug),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, snap => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [post.slug]);

  const submitComment = async () => {
    if (!newComment.trim()) return;
    await addDoc(collection(db, 'comments'), {
      postSlug: post.slug,
      text: newComment.trim(),
      createdAt: serverTimestamp(),
    });
    setNewComment('');
  };

  return (
    <Layout title={post.title}>
      <div style={{ display: 'flex', gap: '2rem', margin: '2rem 0', alignItems: 'flex-start' }}>
        {/* Left: optional image */}
        {post.imageUrl && (
          <div style={{ flex: '0 0 200px' }}>
            <img
              src={post.imageUrl}
              alt={post.title}
              style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Center: main content */}
        <main style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{post.title}</h1>
          <p className={styles.date} style={{ margin: '0.5rem 0' }}>{post.date}</p>
          <div style={{ maxWidth: '600px', margin: '1rem auto', textAlign: 'left' }}>
            <ReactMarkdown>{post.content || ''}</ReactMarkdown>
          </div>
          <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>— Steve Hathaway</p>
        </main>

        {/* Right: comments sidebar */}
        <aside style={{ width: '300px', borderLeft: '1px solid #e5e7eb', paddingLeft: '1rem' }}>
          <h2 style={{ marginTop: 0 }}>Comments</h2>
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {comments.length ? (
              comments.map(c => (
                <div key={c.id} style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: 0 }}>{c.text}</p>
                  <small style={{ color: '#555' }}>
                    {c.createdAt?.toDate().toLocaleString()}
                  </small>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={3}
            style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}
          />
          <button onClick={submitComment} style={{ marginTop: '0.5rem' }}>
            Post Comment
          </button>
        </aside>
      </div>
    </Layout>
  );
}
