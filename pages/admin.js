// pages/admin.js

import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Layout from '../components/Layout';
import styles from '../styles/Admin.module.css';

const allowedEmails = ['caleb.hathaway23@gmail.com', 'skhathaway5@gmail.com'];

export default function Admin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u && allowedEmails.includes(u.email)) {
        setUser(u);
      } else {
        setUser(null);
      }
    });
  }, []);

  if (!user) {
    return (
      <Layout>
        <div className={styles.adminWrapper}>
          <p>You must be signed in with an authorized email to access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.adminWrapper}>
        <div className={styles.topBar}>
          <span>Signed in as: <strong>{user.email}</strong></span>
          <button onClick={() => signOut(auth)}>Sign Out</button>
        </div>

        {/* Add your admin UI here */}
        <h2>Admin Dashboard</h2>
        <p>Welcome, you’re authorized to manage this site.</p>
      </div>
    </Layout>
  );
}
