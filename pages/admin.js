import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Layout from '../components/Layout';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', slug: '', date: '', excerpt: '' });
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
    if (editingId) {
      const ref = doc(db, 'posts', editingId);
      await updateDoc(ref, form);
    } else {
      await addDoc(collection(db, 'posts'), form);
    }
    setForm({ title: '', slug: '', date: '', excerpt: '' });
    setEditingId(null);
    fetchPosts();
  };

  const handleEdit = (post) => {
    setForm(post);
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
          <button onClick={signIn}>Sign in with Google</button>
        </div>
      ) : (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
          <p>Signed in as: {user.email} <button onClick={signOutUser}>Sign Out</button></p>

          <h2>{editingId ? 'Edit Post' : 'New Post'}</h2>
          <input placeholder="Title" name="title" value={form.title} onChange={handleChange} />
          <input placeholder="Slug" name="slug" value={form.slug} onChange={handleChange} />
          <input placeholder="Date (YYYY-MM-DD)" name="date" value={form.date} onChange={handleChange} />
          <textarea placeholder="Excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} />
          <button onClick={handleSave}>{editingId ? 'Update' : 'Publish'}</button>

          <h3 style={{ marginTop: '2rem' }}>Post History</h3>
          {posts.map((post) => (
            <div key={post.id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
              <strong>{post.title}</strong> <em>({post.date})</em>
              <div>
                <button onClick={() => handleEdit(post)}>Edit</button>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
