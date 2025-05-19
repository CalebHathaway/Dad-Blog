import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome to the Blog</h2>
        <p className="mb-6 text-gray-700">This is your go-to spot for insights on business, personal growth, and the occasional dad joke. Updated regularly.</p>
        <Link href="/blog" legacyBehavior>
          <a className="text-blue-600 hover:underline text-lg">Explore Blog Posts →</a>
        </Link>
      </main>
      <Footer />
    </>
  );
}
