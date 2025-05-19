export default function BlogList() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
      <ul className="space-y-4">
        <li className="border-b pb-2">
          <a className="text-xl text-blue-600 hover:underline" href="#">Post Title #1</a>
          <p className="text-sm text-gray-500">May 18, 2025</p>
        </li>
        <li className="border-b pb-2">
          <a className="text-xl text-blue-600 hover:underline" href="#">Post Title #2</a>
          <p className="text-sm text-gray-500">May 17, 2025</p>
        </li>
      </ul>
    </main>
  );
}
