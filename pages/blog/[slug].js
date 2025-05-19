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
    const unsubscribe = onSnapshot(q, snap => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '2rem',
          margin: '2rem 0'
        }}
      >
        {/* Optional image */}
        {post.imageUrl && (
          <div style={{ flex: '0 0 200px' }}>
            <img
              src={post.imageUrl}
              alt={post.title}
              style={{ width: '100%', borderRadius: 8 }}
            />
          </div>
        )}

        {/* Main content */}
        <article style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>{post.title}</h1>
          <p className={styles.date} style={{ marginBottom: '1rem' }}>{post.date}</p>
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
          <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>— Steve Hathaway</p>
        </article>

        {/* Comments sidebar */}
        <aside style={{ width: '300px', borderLeft: '1px solid #e5e7eb', paddingLeft: '1rem' }}>
          <h2>Comments</h2>
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
