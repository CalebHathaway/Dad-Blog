import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
}

export default function Admin() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', excerpt: '', content: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, 'posts'));
    const entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPosts(entries);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const { title, date, excerpt, content } = form;
    if (!title || !date) return alert('Please fill in title and date');

    const slug = generateSlug(title);

    if (editingId) {
      const ref = doc(db, 'posts', editingId);
      await updateDoc(ref, { title, date, excerpt, content, slug });
    } else {
      await addDoc(collection(db, 'posts'), { title, date, excerpt, content, slug });
    }

    setForm({ title: '', date: '', excerpt: '', content: '' });
    setEditingId(null);
    fetchPosts();
  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      content: post.content || ''
    });
    setEditingId(post.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'posts', id));
    fetchPosts();
  };

  const signIn = () => signInWithPopup(auth, new GoogleAuthProvider());
  const signOutUser = () => signOut(auth);

  return (
    <Layout title="Admin">
      {!user ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>You must be signed in to access the admin panel.</p>
          <button className={styles.button} onClick={signIn}>Sign in with Google</button>
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
          <div className={styles.adminHeader}>
            <p>Signed in as: <strong>{user.email}</strong></p>
            <button className={styles.buttonSmall} onClick={signOutUser}>Sign Out</button>
          </div>

          <h2>{editingId ? 'Edit Post' : 'New Post'}</h2>
          <div className={styles.formGrid}>
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
            <input name="date" placeholder="Date (YYYY-MM-DD)" value={form.date} onChange={handleChange} />
            <textarea name="excerpt" placeholder="Short summary or teaser..." rows={3} value={form.excerpt} onChange={handleChange} />
            <textarea name="content" placeholder="Full blog content (Markdown supported)" rows={10} value={form.content} onChange={handleChange} />
            <button className={styles.button} onClick={handleSave}>
              {editingId ? 'Update Post' : 'Publish Post'}
            </button>
          </div>

          <h3 style={{ marginTop: '3rem' }}>Post History</h3>
          <div className={styles.historyList}>
            {posts.map((post) => (
              <div key={post.id} className={styles.postRow}>
                <div>
                  <strong>{post.title}</strong> <span className={styles.date}>({post.date})</span>
                  <div className={styles.slug}>/{post.slug}</div>
                </div>
                <div>
                  <button onClick={() => handleEdit(post)} className={styles.buttonSmall}>Edit</button>
                  <button onClick={() => handleDelete(post.id)} className={styles.buttonSmallDanger}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
