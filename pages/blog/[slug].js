import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Layout from '../../components/Layout';
import ReactMarkdown from 'react-markdown';
import styles from '../../styles/Home.module.css';

export async function getServerSideProps({ params }) {
  const ref = doc(db, 'posts', params.slug);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { notFound: true };

  return { props: { post: snap.data() } };
}

export default function Post({ post }) {
  return (
    <Layout title={post.title}>
      <article className={styles.main}>
        <h1>{post.title}</h1>
        <p className={styles.date}>{post.date}</p>
        <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        <div className={styles.reactions}>
          <button>👍</button>
          <button>🔥</button>
          <button>💭</button>
        </div>
      </article>
    </Layout>
  );
}
