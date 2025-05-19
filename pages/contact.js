import Layout from '../components/Layout';

export default function Contact() {
  return (
    <Layout title="Contact">
      <div
        style={{
          maxWidth: '800px',
          margin: '2rem auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 1rem'
        }}
      >
        <img
          src="/steve.jpg"
          alt="Steve Hathaway"
          style={{ width: '200px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div>
          <h1>Contact Steve</h1>
          <p>Want to reach out to Steve? Send him an email at:</p>
          <p><strong>presidentialperspective@gmail.com</strong></p>
          <p>Or connect through LinkedIn or other professional networks.</p>
        </div>
      </div>
    </Layout>
  );
}
