import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [quote, setQuote] = useState('“Decisions, Direction, and a Dash of Experience.”');
  const [name, setName] = useState('Steve Hathaway');
  const [preview, setPreview] = useState(null);

  const generateSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handlePreview = () => {
    setPreview({
      slug: generateSlug(title),
      title,
      date,
      content
    });
  };

  const handleSave = async () => {
    const newPost = {
      slug: generateSlug(title),
      title,
      date,
      excerpt: content.substring(0, 100) + '...',
      content
    };

    const res = await fetch('/api/save-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    });

    const result = await res.json();
    alert(result.message);
  };

  return (
    <div className={styles.container}>
      <h1>Admin Panel</h1>

      <div className={styles.main}>
        <h2>New Post</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className={styles.input}
        />
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
          className={styles.input}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post content..."
          rows={10}
          className={styles.input}
        />
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handlePreview}>Preview</button>
          <button onClick={handleSave} style={{ marginLeft: '1rem' }}>Save Post</button>
        </div>

        {preview && (
          <div className={styles.postPreview} style={{ marginTop: '2rem' }}>
            <h2>{preview.title}</h2>
            <p className={styles.date}>{preview.date}</p>
            <p>{preview.content.substring(0, 100)}...</p>
            <p><strong>Slug:</strong> {preview.slug}</p>
          </div>
        )}

        <h2 style={{ marginTop: '3rem' }}>Author Info</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Author Name"
          className={styles.input}
        />
        <input
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Motto or Quote"
          className={styles.input}
        />
        <div style={{ marginTop: '1rem' }}>
          <p><strong>{name}</strong></p>
          <p style={{ fontStyle: 'italic' }}>{quote}</p>
        </div>
      </div>
    </div>
  );
}
