import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import styles from '../styles/Admin.module.css';
import Layout from '../components/Layout';

const allowedEmails = ['caleb.hathaway23@gmail.com', 'skhathaway5@gmail.com'];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState('posts');
  const [aboutText, setAboutText] = useState('');
  const [profileURL, setProfileURL] = useState('');

  const [form, setForm] = useState({
    title: '',
    date: '',
    summary: '',
    content: '',
    link: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u && allowedEmails.includes(u.email)) {
        setUser(u);
        loadPosts();
        loadAbout();
        loadProfile();
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadPosts = async () => {
    const snapshot = await getDocs(collection(db, 'posts'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
  };

  const loadAbout = async () => {
    const snap = await getDoc(doc(db, 'site', 'about'));
    if (snap.exists()) setAboutText(snap.data().text);
  };

  const loadProfile = async () => {
    const snap = await getDoc(doc(db, 'site', 'profile'));
    if (snap.exists()) setProfileURL(snap.data().url);
  };

  const handleSignIn = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const savePost = async () => {
    if (!form.title || !form.date || !form.summary || !form.content) return;
    const slug = form.title.toLowerCase().replace(/\s+/g, '-');
    const data = { ...form, slug };

    if (editing) {
      await updateDoc(doc(db, 'posts', editing), data);
      setEditing(null);
    } else {
      await addDoc(collection(db, 'posts'), data);
    }

    setForm({ title: '', date: '', summary: '', content: '', link: '' });
    loadPosts();
  };

  const deletePost = async (id) => {
    await deleteDoc(doc(db, 'posts', id));
    loadPosts();
  };

  const startEdit = (post) => {
    setEditing(post.id);
    setForm({
      title: post.title,
      date: post.date,
      summary: post.summary,
      content: post.content,
      link: post.link || ''
    });
  };

  const saveAbout = async () => {
    await setDoc(doc(db, 'site', 'about'), { text: aboutText });
    alert('About updated');
  };

  const saveProfile = async () => {
    await setDoc(doc(db, 'site', 'profile'), { url: profileURL });
    alert('Profile picture updated');
  };

  const renderTabs = () => {
    switch (tab) {
      case 'posts':
        return (
          <>
            <h2>New Post</h2>
            <div className={styles.form}>
              <input
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
              <input
                placeholder="Date (YYYY-MM-DD)"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
              <input
                placeholder="Short summary"
                value={form.summary}
                onChange={e => setForm({ ...form, summary: e.target.value })}
              />
              <input
                placeholder="External Link (optional)"
                value={form.link}
                onChange={e => setForm({ ...form, link: e.target.value })}
              />
              <textarea
                placeholder="Full blog content (Markdown supported)"
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
              />
              <button onClick={savePost}>{editing ? 'Update' : 'Publish'} Post</button>
            </div>

            <h3>Post History</h3>
            {posts.map(post => (
              <div key={post.id} style={{ marginBottom: '1rem' }}>
                <strong>{post.title}</strong> ({post.date})<br />
                <small>/{post.slug}</small><br />
                <button onClick={() => startEdit(post)}>Edit</button>
                <button onClick={() => deletePost(post.id)}>Delete</button>
              </div>
            ))}
          </>
        );

      case 'about':
        return (
          <>
            <h2>About Page</h2>
            <textarea
              value={aboutText}
              onChange={e => setAboutText(e.target.value)}
              rows={6}
            />
            <button onClick={saveAbout}>Save About</button>
          </>
        );

      case 'profile':
        return (
          <>
            <h2>Profile Picture</h2>
            <input
              placeholder="Image URL (hosted externally)"
              value={profileURL}
              onChange={e => setProfileURL(e.target.value)}
            />
            {profileURL && <img src={profileURL} alt="Preview" style={{ maxWidth: 150, marginTop: 10 }} />}
            <button onClick={saveProfile}>Save Profile Picture</button>
          </>
        );

      case 'analytics':
        return (
          <>
            <h2>Analytics</h2>
            <p>Vercel Analytics automatically tracks visitors.</p>
            <p>For live views and advanced metrics, log into your Vercel dashboard.</p>
          </>
        );
    }
  };

  return (
    <Layout>
      <div className={styles.adminWrapper}>
        {!user ? (
          <div style={{ padding: '2rem' }}>
            <h2>Admin Panel</h2>
            <p>You must be signed in to continue.</p>
            <button onClick={handleSignIn}>Sign in with Google</button>
          </div>
        ) : (
          <>
            <div className={styles.navRow}>
              <p>Signed in as: <strong>{user.email}</strong></p>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>

            <div className={styles.tabButtons}>
              <button onClick={() => setTab('posts')}>Posts</button>
              <button onClick={() => setTab('about')}>About Page</button>
              <button onClick={() => setTab('profile')}>Profile Picture</button>
              <button onClick={() => setTab('analytics')}>Analytics</button>
            </div>

            <div className={styles.adminContent}>
              {renderTabs()}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}