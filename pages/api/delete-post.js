import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { slug } = req.body;

    const filePath = path.join(process.cwd(), 'data', 'posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const posts = JSON.parse(fileContents);

    const filteredPosts = posts.filter((post) => post.slug !== slug);

    fs.writeFileSync(filePath, JSON.stringify(filteredPosts, null, 2));
    res.status(200).json({ message: 'Post deleted successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
