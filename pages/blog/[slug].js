export async function getStaticPaths() {
  const files = fs.readdirSync(path.join(process.cwd(), 'blogposts'));

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
