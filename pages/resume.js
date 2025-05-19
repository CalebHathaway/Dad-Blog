import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getSiteSetting } from '../lib/siteSettings';
import ReactMarkdown from 'react-markdown';

export default function Resume() {
  const [resumeText, setResumeText] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    async function fetchData() {
      const textData = await getSiteSetting('resumeText');
      setResumeText(textData?.text || '');
      const pdfData = await getSiteSetting('resume');
      setPdfUrl(pdfData?.url || '');
    }
    fetchData();
  }, []);

  return (
    <Layout title="Resume">
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Steve Hathaway's Resume</h1>

        {resumeText ? (
          <div style={{ lineHeight: 1.6 }}>
            <ReactMarkdown>{resumeText}</ReactMarkdown>
          </div>
        ) : pdfUrl ? (
          <p style={{ textAlign: 'center' }}>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              Download Resume (PDF)
            </a>
          </p>
        ) : (
          <p style={{ textAlign: 'center', color: '#555' }}>
            No resume uploaded yet.
          </p>
        )}
      </div>
    </Layout>
  );
}
