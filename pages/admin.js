import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { db, auth, provider } from '../lib/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function Admin() {
  console.log("🔥 Firebase Key from Vercel:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [quote, setQuote] = useState('“Decisions, Direction, and a Dash of Experience.”');
  const [name, setName] = useState('Steve Hathaway');
  const [preview, setPreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);

  const generateSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      const sorted = items.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(sorted);
    });
    return () => unsubscribe();
  }, []);

  const handlePreview = () => {
    setPreview({
      slug: generateSlug(title),
      title,
      date,
      content
    });
  };

  const handleSave = async () => {
    const newPost = {
      slug: generateSlug(title),
      title,
      date,
      excerpt: content.substring(0, 100) + '...',
      content
    };

    try {
      if (editingPostId) {
        await updateDoc(doc(db, 'posts', editingPostId), newPost);
        alert('Post updated');
        setEditingPostId(null);
      } else {
        await addDoc(collection(db, 'posts'), newPost);
        alert('Post saved to Firebase');
      }

      setTitle('');
      setDate('');
      setContent('');
      setPreview(null);
    } catch (err) {
      alert('Error saving post: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Delete this post? This cannot be undone.');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'posts', id));
      alert('Post deleted');
    } catch (err) {
      alert('Error deleting post: ' + err.message);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setDate(post.date);
    setContent(post.content);
    setEditingPostId(post.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignIn = () => {
    signInWithPopup(auth, provider).catch((err) =>
      alert('Sign-in error: ' + err.message)
    );
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <h1>Admin Panel</h1>
        <p>You must be signed in to access this page.</p>
        <button onClick={handleSignIn}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Admin Panel</h1>
      <p>Signed in as {user.email}</p>
      <button onClick={handleSignOut}>Sign Out</button>

      <div className={styles.main}>
        <h2>{editingPostId ? 'Edit Post' : 'New Post'}</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className={styles.input}
        />
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
          className={styles.input}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post content..."
          rows={10}
          className={styles.input}
        />
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handlePreview}>Preview</button>
          <button onClick={handleSave} style={{ marginLeft: '1rem' }}>
            {editingPostId ? 'Update Post' : 'Save Post'}
          </button>
        </div>

        {preview && (
          <div className={styles.postPreview} style={{ marginTop: '2rem' }}>
            <h2>{preview.title}</h2>
            <p className={styles.date}>{preview.date}</p>
            <p>{preview.content.substring(0, 100)}...</p>
            <p><strong>Slug:</strong> {preview.slug}</p>
          </div>
        )}

        <h2 style={{ marginTop: '3rem' }}>Post History</h2>
        {posts.length === 0 && <p>No posts yet.</p>}
        {posts.map((post) => (
          <div key={post.id} className={styles.postPreview}>
            <h2>{post.title}</h2>
            <p className={styles.date}>{post.date}</p>
            <p>{post.excerpt}</p>
            <button onClick={() => handleEdit(post)} style={{ marginRight: '0.5rem' }}>
              Edit
            </button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        ))}

        <h2 style={{ marginTop: '3rem' }}>Author Info</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Author Name"
          className={styles.input}
        />
        <input
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Motto or Quote"
          className={styles.input}
        />
        <div style={{ marginTop: '1rem' }}>
          <p><strong>{name}</strong></p>
          <p style={{ fontStyle: 'italic' }}>{quote}</p>
        </div>
      </div>
    </div>
  );
}
