export default function Home() {
  const handleClaim = async () => {
    const res = await fetch('/api/claim');
    const data = await res.json();
    alert(data.message || JSON.stringify(data));
  };

  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>🪙 Cnox - Claim your Degen</h1>
      <button onClick={handleClaim} style={{
        marginTop: 20,
        padding: '10px 20px',
        fontSize: 18,
        cursor: 'pointer'
      }}>
        Claim Degen
      </button>
    </main>
  );
}
