import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Layout from '../../components/Layout';
import ReactMarkdown from 'react-markdown';
import styles from '../../styles/Home.module.css';

export async function getServerSideProps({ params }) {
  const snapshot = await getDocs(collection(db, 'posts'));
  const match = snapshot.docs.find(doc => doc.data().slug === params.slug);

  if (!match) return { notFound: true };

  return { props: { post: match.data() } };
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
