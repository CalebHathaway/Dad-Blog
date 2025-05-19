import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join(process.cwd(), 'blogposts'));

  const paths = files.map((filename) => ({
    params: { slug: filename.replace('.md', '') },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'blogposts', slug + '.md'),
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

// ✅ THIS is the missing piece!
export default function BlogPostPage({ frontmatter, content }) {
  return (
    <div>
      <h1>{frontmatter.title}</h1>
      <p>{frontmatter.date}</p>
      <div>{content}</div>
    </div>
  );
}
