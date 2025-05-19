import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout title="Home">
      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Steve Hathaway</h1>
        <p style={{ fontStyle: 'italic', fontSize: '1.2rem' }}>
          Decisions, Direction, and a Dash of Experience.
        </p>
        <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', maxWidth: '600px', margin: 'auto' }}>
          Welcome to the A Life Observed — a space for thoughtful insight, real-world
          leadership, and reflections that matter.
        </p>
      </div>
    </Layout>
  );
}