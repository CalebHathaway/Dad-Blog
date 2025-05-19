import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { getSiteSetting } from '../lib/siteSettings';
import ReactMarkdown from 'react-markdown';

export default function Resume() {
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeText, setResumeText] = useState('');

  useEffect(() => {
    async function fetchData() {
      const pdf = await getSiteSetting('resume');
      setResumeUrl(pdf?.url || '');
      const text = await getSiteSetting('resumeText');
      setResumeText(text?.text || '');
    }
    fetchData();
  }, []);

  return (
    <Layout title="Resume">
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1>Steve Hathaway's Resume</h1>
        {resumeText ? (
          <div style={{ textAlign: 'left' }}>
            <ReactMarkdown>{resumeText}</ReactMarkdown>
          </div>
        ) : resumeUrl ? (
          <>
            <embed
              src={resumeUrl}
              type="application/pdf"
              width="100%"
              height="1000px"
            />
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                Open Resume in New Tab
              </a>
            </p>
          </>
        ) : (
          <p>No resume uploaded yet.</p>
        )}
      </div>
    </Layout>
  );
}
