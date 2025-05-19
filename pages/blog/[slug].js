import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Post({ frontmatter, content }) {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-8 prose">
        <h1>{frontmatter.title}</h1>
        <p className="text-gray-500 text-sm">{frontmatter.date}</p>
        <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
      </main>
      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join(process.cwd(), 'posts'));

  const paths = files.map(filename => ({
    params: { slug: filename.replace('.md', '') }
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'posts', slug + '.md'),
    'utf-8'
  );

  const { data: frontmatter, content } = matter(markdownWithMeta);

  return {
    props: {
      frontmatter,
      content,
    },
  };
}