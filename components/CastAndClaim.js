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
  const [claimsList, setClaimsList] = useState([]);

  useEffect(() => {
    const fetchCast = async () => {
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
        setError('Gagal memuat cast.');
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, []);

  // Cek apakah sudah pernah klaim
  useEffect(() => {
    const checkAlreadyClaimed = async () => {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('fid', fid);

      if (data && data.length > 0) {
        setClaimed(true);
      }
    };

    if (fid) {
      checkAlreadyClaimed();
    }
  }, [fid]);

  // Ambil semua klaim
  useEffect(() => {
    const fetchClaims = async () => {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        setClaimsList(data);
      }
    };

    fetchClaims();
  }, [claimed]);

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

  const handleCopyLink = () => {
    if (cast) {
      const link = `https://warpcast.com/${username}/${cast.hash}`;
      navigator.clipboard.writeText(link);
      alert('Link cast berhasil disalin!');
    }
  };

  return (
    <div style={{ marginTop: '2rem', maxWidth: '600px' }}>
      <h2>Latest Cast by @{username}:</h2>

      {loading ? (
        <p>Loading cast...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : cast ? (
        <div>
          <p>{cast.text}</p>
          <button onClick={handleClaim} disabled={claimed} style={{ marginRight: '1rem' }}>
            {claimed ? '✅ Airdrop Claimed' : 'Claim Airdrop'}
          </button>
          <button onClick={handleCopyLink}>Salin Link Cast 🔗</button>
        </div>
      ) : (
        <p>Cast tidak ditemukan.</p>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h3>Recent Claims:</h3>
      {claimsList.length > 0 ? (
        <ul>
          {claimsList.map((item) => (
            <li key={item.id}>
              @{item.username} - "{item.cast_text.slice(0, 40)}..."
            </li>
          ))}
        </ul>
      ) : (
        <p>Belum ada klaim.</p>
      )}
    </div>
  );
};
