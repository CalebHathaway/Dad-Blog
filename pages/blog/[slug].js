import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Layout from '../../components/Layout';
import ReactMarkdown from 'react-markdown';

export async function getServerSideProps({ params }) {
  const snap = await getDocs(collection(db, 'posts'));
  const match = snap.docs.find(d => d.data().slug === params.slug);
  if (!match) return { notFound: true };
  return { props: { post: match.data() } };
}

export default function Post({ post }) {
  return (
    <Layout title={post.title}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: post.imageUrl ? '200px 1fr' : '1fr',
          gap: '2rem',
          alignItems: 'start',
          margin: '2rem 0'
        }}
      >
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{ width: '200px', borderRadius: 8, objectFit: 'cover' }}
          />
        )}

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{post.title}</h1>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#6b7280' }}>{post.date}</p>
          <div
            style={{
              maxWidth: '600px',
              margin: '1rem auto',
              textAlign: 'left',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            <ReactMarkdown>{post.content || ''}</ReactMarkdown>
          </div>
          <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>— Steve Hathaway</p>
        </div>
      </div>
    </Layout>
  );
}
