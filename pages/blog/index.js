import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function BlogList() {
  const posts = [
    {
      title: "3 Things I Learned from Failing",
      date: "May 18, 2025",
      slug: "3-things-i-learned-from-failing"
    },
    {
      title: "Why Listening Is the Best Leadership Tool",
      date: "May 17, 2025",
      slug: "why-listening-is-powerful"
    }
  ];

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Blog Posts</h2>
        <ul className="space-y-6">
          {posts.map(post => (
            <li key={post.slug} className="border-b pb-3">
              <Link href={`/blog/${post.slug}`}>
                <a className="text-2xl text-blue-700 hover:underline font-semibold">{post.title}</a>
              </Link>
              <p className="text-sm text-gray-500">{post.date}</p>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
