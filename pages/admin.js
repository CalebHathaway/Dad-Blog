import { useEffect, useState } from 'react';
import { auth, db, storage } from '../lib/firebase';
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getSiteSetting, updateSiteSetting } from '../lib/siteSettings';
import styles from '../styles/Admin.module.css';
import Layout from '../components/Layout';

const allowedEmails = ['caleb.hathaway23@gmail.com', 'skhathaway5@gmail.com'];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('posts');

  // Posts state
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [postForm, setPostForm] = useState({ title: '', date: '', link: '', imageUrl: '', content: '' });

  // Comments state
  const [comments, setComments] = useState([]);

  // Site settings
  const [aboutText, setAboutText] = useState('');
  const [profileURL, setProfileURL] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
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
    return () => unsub();
  }, []);

  // Load functions
  const loadPosts = async () => {
    const snap = await getDocs(collection(db, 'posts'));
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };
  const loadComments = async () => {
    const snap = await getDocs(collection(db, 'comments'));
    setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };
  const loadAbout = async () => {
    const data = await getSiteSetting('about');
    setAboutText(data?.text || '');
  };
  const loadProfile = async () => {
    const data = await getSiteSetting('profile');
    setProfileURL(data?.url || '');
  };
  const loadResume = async () => {
    const data = await getSiteSetting('resume');
    setResumeUrl(data?.url || '');
  };

  // Auth handlers
  const handleSignIn = () => signInWithPopup(auth, new GoogleAuthProvider());
  const handleSignOut = () => signOut(auth);

  // Post handlers
  const savePost = async () => {
    const { title, date, link, imageUrl, content } = postForm;
    if (!title || !date || !content) return;
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const data = { title, date, link, imageUrl, content, slug };
    if (editing) await updateDoc(doc(db, 'posts', editing), data);
    else await addDoc(collection(db, 'posts'), data);
    setEditing(null);
    setPostForm({ title: '', date: '', link: '', imageUrl: '', content: '' });
    loadPosts();
  };
  const startEditPost = (p) => setEditing(p.id) || setPostForm({ title: p.title, date: p.date, link: p.link || '', imageUrl: p.imageUrl || '', content: p.content });
  const deletePost = async (id) => { await deleteDoc(doc(db, 'posts', id)); loadPosts(); };

  // Comment handler
  const deleteComment = async (id) => { await deleteDoc(doc(db, 'comments', id)); loadComments(); };

  // Site settings handlers
  const saveAbout = async () => { await updateSiteSetting('about', { text: aboutText }); alert('About updated'); };
  const saveProfile = async () => { await updateSiteSetting('profile', { url: profileURL }); alert('Profile updated'); };
  const saveResume = async () => { await updateSiteSetting('resume', { url: resumeUrl }); alert('Resume updated'); };

  // File upload for resume
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `resumes/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setResumeUrl(url);
  };

  // Render tabs
  const renderTabs = () => {
    switch(tab) {
      case 'posts': return (
        <>
          <h2>Posts</h2>
          <div className={styles.form}>
            <input placeholder="Title" value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} />
            <input placeholder="Date (DD-MM-YYYY)" value={postForm.date} onChange={e => setPostForm({ ...postForm, date: e.target.value })} />
            <input placeholder="External Link" value={postForm.link} onChange={e => setPostForm({ ...postForm, link: e.target.value })} />
            <input placeholder="Image URL" value={postForm.imageUrl} onChange={e => setPostForm({ ...postForm, imageUrl: e.target.value })} />
            <textarea placeholder="Content" value={postForm.content} onChange={e => setPostForm({ ...postForm, content: e.target.value })} rows={6} />
            <button onClick={savePost}>{editing ? 'Update' : 'Publish'} Post</button>
          </div>
          <h3>Existing Posts</h3>
          {posts.map(p => (
            <div key={p.id} style={{ marginBottom: '1rem' }}>
              <strong>{p.title}</strong> ({p.date})<br />
              <small>/{p.slug}</small><br />
              <button onClick={() => startEditPost(p)}>Edit</button>
              <button onClick={() => deletePost(p.id)}>Delete</button>
            </div>
          ))}
        </>
      );
      case 'comments': return (
        <>
          <h2>Comments</h2>
          {comments.map(c => (
            <div key={c.id} style={{ marginBottom: '1rem' }}>
              <strong>Post: {c.postSlug}</strong><br />
              <p>{c.text}</p>
              <small style={{ color: '#555' }}>{c.createdAt?.toDate().toLocaleString()}</small><br />
              <button onClick={() => deleteComment(c.id)}>Delete</button>
            </div>
          ))}
        </>
      );
      case 'about': return (
        <>
          <h2>About</h2>
          <textarea value={aboutText} onChange={e => setAboutText(e.target.value)} rows={6} />
          <button onClick={saveAbout}>Save About</button>
        </>
      );
      case 'profile': return (
        <>
          <h2>Profile Picture</h2>
          <input placeholder="Image URL" value={profileURL} onChange={e => setProfileURL(e.target.value)} />
          {profileURL && <img src={profileURL} alt="Profile preview" style={{ maxWidth: 150, marginTop: 10 }} />}<br />
          <button onClick={saveProfile}>Save Profile</button>
        </>
      );
      case 'resume': return (
        <>
          <h2>Resume</h2>
          <input type="file" accept="application/pdf" onChange={handleResumeUpload} />
          {resumeUrl && <p>Preview: <a href={resumeUrl} target="_blank">View PDF</a></p>}
          <button onClick={saveResume}>Save Resume</button>
        </>
      );
      default: return null;
    }
  };

  return (
    <Layout>
      <div className={styles.adminWrapper}>
        {!user ? (
          <div style={{ padding: '2rem' }}>
            <h2>Admin Panel</h2>
            <p>Please sign in to continue.</p>
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
              <button onClick={() => setTab('about')}>About</button>
              <button onClick={() => setTab('profile')}>Profile</button>
              <button onClick={() => setTab('resume')}>Resume</button>
            </div>
            <div className={styles.adminContent}>{renderTabs()}</div>
          </>
        )}
      </div>
    </Layout>
  );
}
