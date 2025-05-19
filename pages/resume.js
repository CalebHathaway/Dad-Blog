import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { getSiteSetting } from '../lib/siteSettings';
import ReactMarkdown from 'react-markdown';

export default function Resume() {
  const [text, setText] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    async function load() {
      const md = await getSiteSetting('resumeText');     // Markdown content
      const pdf = await getSiteSetting('resume');        // PDF URL
      setText(md?.text || '');
      setPdfUrl(pdf?.url || '');
    }
    load();
  }, []);

  return (
    <Layout title="Resume">
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Steve Hathaway’s Resume
        </h1>

        {text ? (
          <div style={{ lineHeight: 1.6 }}>
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        ) : pdfUrl ? (
          <>
            <iframe
              src={pdfUrl}
              title="Steve Hathaway Resume"
              style={{
                width: '100%',
                height: '1200px',
                border: '1px solid #ccc',
                borderRadius: 4,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            />
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                Download Resume (PDF)
              </a>
            </p>
          </>
        ) : (
          <p style={{ textAlign: 'center' }}>No resume uploaded yet.</p>
        )}
      </div>
    </Layout>
  );
}
