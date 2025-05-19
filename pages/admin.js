import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { getSiteSetting, updateSiteSetting } from '../lib/siteSettings';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', excerpt: '', content: '' });
  const [editingId, setEditingId] = useState(null);

  const [aboutText, setAboutText] = useState('');
  const [profileURL, setProfileURL] = useState('');

  const allowedEmails = ['caleb.hathaway23@gmail.com', 'skhathaway5@gmail.com'];

useEffect(() => {
  onAuthStateChanged(auth, (u) => {
    if (u && allowedEmails.includes(u.email)) {
      setUser(u);
    } else {
      setUser(null);
    }
  });
}, []);


  // original useEffect kept for reference
  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
    fetchPosts();
    fetchAbout();
    fetchProfile();
  }, []);

  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, 'posts'));
    const entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPosts(entries);
  };

  const fetchAbout = async () => {
    const data = await getSiteSetting('about');
    setAboutText(data?.text || '');
  };

  const fetchProfile = async () => {
    const data = await getSiteSetting('profile');
    setProfileURL(data?.url || '');
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    const { title, date, excerpt, content } = form;
    if (!title || !date) return alert('Please fill in title and date');
    const slug = title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-').slice(0, 50);

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

  const saveAbout = async () => {
    await updateSiteSetting('about', { text: aboutText });
    alert('About page updated');
  };

  const saveProfileURL = async () => {
    await updateSiteSetting('profile', { url: profileURL });
    alert('Profile photo URL updated');
  };

  if (!user) {
    return (
      <Layout title="Admin">
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>You must be signed in to access the admin panel.</p>
          <button className={styles.button} onClick={signIn}>Sign in with Google</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin">
      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <div className={styles.adminHeader}>
          <p>Signed in as: <strong>{user.email}</strong></p>
          <button className={styles.buttonSmall} onClick={signOutUser}>Sign Out</button>
        </div>

        <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setActiveTab('posts')}>Posts</button>
          <button onClick={() => setActiveTab('about')}>About Page</button>
          <button onClick={() => setActiveTab('profile')}>Profile Picture</button>
          <button onClick={() => setActiveTab('analytics')}>Analytics</button>
        </nav>

        {activeTab === 'posts' && (
          <>
            <h2>{editingId ? 'Edit Post' : 'New Post'}</h2>
            <div className={styles.formGrid}>
              <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
              <input name="date" placeholder="Date (YYYY-MM-DD)" value={form.date} onChange={handleChange} />
              <textarea name="excerpt" placeholder="Short summary" rows={3} value={form.excerpt} onChange={handleChange} />
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
          </>
        )}

        {activeTab === 'about' && (
          <>
            <h2>Edit About Page</h2>
            <textarea rows={10} value={aboutText} onChange={(e) => setAboutText(e.target.value)} />
            <button onClick={saveAbout} className={styles.button}>Save About Page</button>
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <h2>Set Profile Picture URL</h2>
            <input type="text" value={profileURL} onChange={(e) => setProfileURL(e.target.value)} placeholder="https://example.com/photo.jpg" />
            <button onClick={saveProfileURL} className={styles.button}>Save Profile Photo</button>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <h2>Analytics</h2>
            <p>Page views and traffic stats coming soon!</p>
          </>
        )}
      </div>
    </Layout>
  );
}
