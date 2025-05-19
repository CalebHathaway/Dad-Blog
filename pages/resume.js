import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { getSiteSetting } from '../lib/siteSettings';

export default function Resume() {
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    async function fetchResume() {
      const data = await getSiteSetting('resume');
      setResumeUrl(data?.url || '');
    }
    fetchResume();
  }, []);

  return (
    <Layout title="Resume">
      <div style={{ maxWidth: '900px', margin: '2rem auto', textAlign: 'center', padding: '0 1rem' }}>
        <h1>Steve Hathaway's Resume</h1>
        {resumeUrl ? (
          <iframe
            src={resumeUrl}
            style={{ width: '100%', height: '800px', border: 'none', marginTop: '1rem' }}
          />
        ) : (
          <p>No resume uploaded yet.</p>
        )}
      </div>
    </Layout>
  );
}
