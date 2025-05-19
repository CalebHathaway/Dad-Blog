import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getSiteSetting } from '../lib/siteSettings';

export default function About() {
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    async function fetchData() {
      const data = await getSiteSetting('about');
      setContent(data?.text || 'No about info set.');
    }
    fetchData();
  }, []);

  return (
    <Layout title="About">
      <div style={{ maxWidth: '720px', margin: '2rem auto' }}>
        <h1>About Steve Hathaway</h1>
        <p>
          Steve Hathaway is a thoughtful leader with a passion for sharing insight, asking good
          questions, and helping others grow. Whether writing about faith, leadership, or life
          lessons, he brings clarity and heart to every conversation.
        </p>
        <p>{content}</p>
      </div>
    </Layout>
  );
}
