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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

        // Ambil FID user
        const userRes = await fetch(`https://api.neynar.com/v2/farcaster/user-by-username?username=${username}`, {
          headers: {
            'accept': 'application/json',
            'api_key': apiKey,
          },
        });
        const userData = await userRes.json();
        const fidValue = userData.result.user.fid;
        setFid(fidValue);

        // Ambil cast terbaru
        const castRes = await fetch(`https://api.neynar.com/v2/farcaster/casts?fid=${fidValue}&limit=1`, {
          headers: {
            'accept': 'application/json',
            'api_key': apiKey,
          },
        });
        const castData = await castRes.json();
        const latestCast = castData.result.casts[0];
        setCast(latestCast);
      } catch (err) {
        console.error('Error fetching cast:', err);
        setError('Gagal memuat cast.');
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, []);

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
      <h2>Latest Cast by @{username}:</h2>

      {loading ? (
        <p>Loading cast...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : cast ? (
        <div>
          <p>{cast.text}</p>
          <button onClick={handleClaim} disabled={claimed}>
            {claimed ? '✅ Airdrop Claimed' : 'Claim Airdrop'}
          </button>
        </div>
      ) : (
        <p>Cast tidak ditemukan.</p>
      )}
    </div>
  );
};

export default CastAndClaim;
