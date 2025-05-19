// pages/admin.js
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
import { getSiteSetting, updateSiteSetting } from '../lib/siteSettings';
import styles from '../styles/Admin.module.css';
import Layout from '../components/Layout';

const allowedEmails = ['caleb.hathaway23@gmail.com', 'skhathaway5@gmail.com'];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState('posts');
  const [aboutText, setAboutText] = useState('');
  const [profileURL, setProfileURL] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const [form, setForm] = useState({
    title: '',
    date: '',
    link: '',
    imageUrl: '',
    content: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u && allowedEmails.includes(u.email)) {
        setUser(u);
        loadPosts();
        loadComments();
        loadAbout();
        loadProfile();
        loadResume();
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadPosts = async () => {
    const snap = await getDocs(collection(db, 'posts'));
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const loadComments = async () => {
    const snap = await getDocs(collection(db, 'comments'));
    setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const loadAbout = async () => {
    const snap = await getDoc(doc(db, 'site', 'about'));
    if (snap.exists()) setAboutText(snap.data().text);
  };

  const loadProfile = async () => {
    const snap = await getDoc(doc(db, 'site', 'profile'));
    if (snap.exists()) setProfileURL(snap.data().url);
  };

  const loadResume = async () => {
    const data = await getSiteSetting('resume');
    setResumeUrl(data?.url || '');
  };

  const handleSignIn = () => signInWithPopup(auth, new GoogleAuthProvider());
  const handleSignOut = () => signOut(auth);

  const savePost = async () => {
    const { title, date, link, imageUrl, content } = form;
    if (!title || !date || !content) return;
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const data = { title, date, link, imageUrl, content, slug };
    if (editing) {
      await updateDoc(doc(db, 'posts', editing), data);
    } else {
      await addDoc(collection(db, 'posts'), data);
    }
    setEditing(null);
    setForm({ title: '', date: '', link: '', imageUrl: '', content: '' });
    loadPosts();
  };

  const deletePost = async (id) => {
    await deleteDoc(doc(db, 'posts', id));
    loadPosts();
  };

  const deleteComment = async (id) => {
    await deleteDoc(doc(db, 'comments', id));
    loadComments();
  };

  const saveAbout = async () => {
    await updateSiteSetting('about', { text: aboutText });
    alert('About updated');
  };

  const saveProfile = async () => {
    await updateSiteSetting('profile', { url: profileURL });
    alert('Profile updated');
  };

  const saveResume = async () => {
    await updateSiteSetting('resume', { url: resumeUrl });
    alert('Resume updated');
  };

  const startEdit = (post) => {
    setEditing(post.id);
    setForm({
      title: post.title,
      date: post.date,
      link: post.link || '',
      imageUrl: post.imageUrl || '',
      content: post.content
    });
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
                placeholder="External Link (optional)"
                value={form.link}
                onChange={e => setForm({ ...form, link: e.target.value })}
              />
              <input
                placeholder="Image URL (optional)"
                value={form.imageUrl}
                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              />
              <textarea
                placeholder="Full blog content (Markdown supported)"
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
              />
              <button onClick={savePost}>
                {editing ? 'Update' : 'Publish'} Post
              </button>
            </div>
            <h3>Post History</h3>
            {posts.map(p => (
              <div key={p.id} style={{ marginBottom: '1rem' }}>
                <strong>{p.title}</strong> ({p.date})<br />
                <small>/{p.slug}</small><br />
                <button onClick={() => startEdit(p)}>Edit</button>
                <button onClick={() => deletePost(p.id)}>Delete</button>
              </div>
            ))}
          </>
        );

      case 'comments':
        return (
          <>
            <h2>Comments</h2>
            {comments.length ? comments.map(c => (
              <div key={c.id} style={{ marginBottom: '1rem' }}>
                <strong>Post: {c.postSlug}</strong><br />
                <p>{c.text}</p>
                <small>{c.createdAt?.toDate().toLocaleString()}</small><br />
                <button onClick={() => deleteComment(c.id)}>Delete</button>
              </div>
            )) : <p>No comments yet.</p>}
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
            {profileURL && (
              <img
                src={profileURL}
                alt="Preview"
                style={{ maxWidth: 150, marginTop: 10 }}
              />
            )}
            <button onClick={saveProfile}>Save Profile</button>
          </>
        );

      case 'resume':
        return (
          <>
            <h2>Resume</h2>
            <input
              placeholder="Resume PDF URL"
              value={resumeUrl}
              onChange={e => setResumeUrl(e.target.value)}
            />
            <button onClick={saveResume}>Save Resume</button>
          </>
        );

      default:
        return null;
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
              <button onClick={() => setTab('comments')}>Comments</button>
              <button onClick={() => setTab('about')}>About Page</button>
              <button onClick={() => setTab('profile')}>Profile Picture</button>
              <button onClick={() => setTab('resume')}>Resume</button>
            </div>
            <div className={styles.adminContent}>{renderTabs()}</div>
          </>
        )}
      </div>
    </Layout>
  );
}
