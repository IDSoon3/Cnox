'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CastAndClaim = () => {
  const [cast, setCast] = useState(null);
  const [fid, setFid] = useState(null);
  const [username, setUsername] = useState('idsoon');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [claimed, setClaimed] = useState(false);

  // Ambil data cast
  const fetchCast = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

      // Ambil FID user
      const userRes = await fetch(`https://api.neynar.com/v2/farcaster/user-by-username?username=${username}`, {
        headers: {
          accept: 'application/json',
          api_key: apiKey,
        },
      });
      const userData = await userRes.json();
      const fidValue = userData.result.user.fid;
      setFid(fidValue);

      // Cek apakah user sudah pernah klaim
      const { data: existingClaim, error: claimCheckError } = await supabase
        .from('claims')
        .select('*')
        .eq('fid', fidValue)
        .single();

      if (existingClaim) {
        setClaimed(true);
      }

      // Ambil cast terbaru
      const castRes = await fetch(`https://api.neynar.com/v2/farcaster/casts?fid=${fidValue}&limit=1`, {
        headers: {
          accept: 'application/json',
          api_key: apiKey,
        },
      });
      const castData = await castRes.json();
      const latestCast = castData.result.casts[0];
      setCast(latestCast);
    } catch (err) {
      console.error('Error fetching cast:', err);
      setError('Gagal memuat data cast.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCast();
  }, []);

  // Proses klaim
  const handleClaim = async () => {
    try {
      const { error } = await supabase.from('claims').insert({
        fid,
        username,
        cast_text: cast.text,
      });

      if (error) {
        console.error('Error inserting claim:', error);
        setError('Gagal klaim.');
        return;
      }

      setClaimed(true);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Terjadi kesalahan.');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Cnox Farcaster Airdrop</h2>

      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username Farcaster"
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button onClick={fetchCast} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading cast...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : cast ? (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Latest Cast by @{username}:</strong></p>
          <p style={{ marginBottom: '1rem' }}>{cast.text}</p>
          <button onClick={handleClaim} disabled={claimed}>
            {claimed ? '✅ Sudah Klaim' : '🎁 Klaim Airdrop'}
          </button>
        </div>
      ) : (
        <p>Cast tidak ditemukan.</p>
      )}
    </div>
  );
};

export default CastAndClaim;
