import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import styles from '../styles/Admin.module.css';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [aboutText, setAboutText] = useState('');
  const [profileURL, setProfileURL] = useState('');
  const [view, setView] = useState('posts');
  const allowedEmails = [
    'caleb.hathaway23@gmail.com',
    'skhathaway5@gmail.com'
  ];

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u && allowedEmails.includes(u.email)) {
        setUser(u);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchSettings();
    }
  }, [user]);

  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, 'posts'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
  };

  const fetchSettings = async () => {
    const aboutRef = doc(db, 'site', 'about');
    const profileRef = doc(db, 'site', 'profile');
    const aboutSnap = await getDoc(aboutRef);
    const profileSnap = await getDoc(profileRef);
    setAboutText(aboutSnap.exists() ? aboutSnap.data().text : '');
    setProfileURL(profileSnap.exists() ? profileSnap.data().url : '');
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSubmit = async () => {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const data = { title, date, excerpt, content, slug };
    if (editingId) {
      await updateDoc(doc(db, 'posts', editingId), data);
    } else {
      await addDoc(collection(db, 'posts'), data);
    }
    setTitle('');
    setDate('');
    setExcerpt('');
    setContent('');
    setEditingId(null);
    fetchPosts();
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setDate(post.date);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setEditingId(post.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'posts', id));
    fetchPosts();
  };

  const updateAbout = async () => {
    await setDoc(doc(db, 'site', 'about'), { text: aboutText });
    alert('About page updated!');
  };

  const updateProfile = async () => {
    await setDoc(doc(db, 'site', 'profile'), { url: profileURL });
    alert('Profile picture updated!');
  };

  const renderDashboard = () => {
    return (
      <div className={styles.adminWrapper}>
        <div className={styles.topBar}>
          <span>
            Signed in as: <strong>{user.email}</strong>
          </span>
          <button onClick={handleLogout}>Sign Out</button>
        </div>

        <div className={styles.navButtons}>
          <button onClick={() => setView('posts')}>Posts</button>
          <button onClick={() => setView('about')}>About Page</button>
          <button onClick={() => setView('profile')}>Profile Picture</button>
          <button onClick={() => setView('analytics')}>Analytics</button>
        </div>

        {view === 'posts' && (
          <>
            <h2>New Post</h2>
            <div className={styles.form}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Date (YYYY-MM-DD)"
              />
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full blog content (Markdown supported)"
              />
              <button onClick={handleSubmit}>
                {editingId ? 'Update Post' : 'Publish Post'}
              </button>
            </div>

            <h3>Post History</h3>
            <ul>
              {posts.map((post) => (
                <li key={post.id}>
                  <strong>{post.title}</strong> ({post.date})<br />
                  /{post.slug}
                  <br />
                  <button onClick={() => handleEdit(post)}>Edit</button>
                  <button onClick={() => handleDelete(post.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </>
        )}

        {view === 'about' && (
          <div className={styles.form}>
            <h2>About Page</h2>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="About Steve and the blog..."
            />
            <button onClick={updateAbout}>Save About Page</button>
          </div>
        )}

        {view === 'profile' && (
          <div className={styles.form}>
            <h2>Profile Picture</h2>
            <input
              value={profileURL}
              onChange={(e) => setProfileURL(e.target.value)}
              placeholder="Image URL"
            />
            <button onClick={updateProfile}>Save Profile Picture</button>
          </div>
        )}

        {view === 'analytics' && (
          <div className={styles.analytics}>
            <h2>Site Analytics</h2>
            <p>(Will show live visitor count + views per post)</p>
          </div>
        )}
      </div>
    );
  };

  // 🔐 Access control: block all unapproved users
  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You must be signed in with an approved email to access the admin dashboard.</p>
        <button onClick={handleLogin}>Sign in with Google</button>
      </div>
    );
  }

  return renderDashboard();
}
