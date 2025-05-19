// pages/api/save-post.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const newPost = req.body;

    const filePath = path.join(process.cwd(), 'data', 'posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const posts = JSON.parse(fileContents);

    // Add to top of list
    posts.unshift(newPost);

    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    res.status(200).json({ message: 'Post saved successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
