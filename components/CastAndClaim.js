'use client';
import { useEffect, useState } from 'react';

const CastAndClaim = () => {
  const [cast, setCast] = useState(null);

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

        // 1. Dapatkan FID dari username
        const resUser = await fetch(`https://api.neynar.com/v2/farcaster/user-by-username?username=idsoon`, {
          headers: {
            'accept': 'application/json',
            'api_key': API_KEY
          }
        });

        const userData = await resUser.json();
        const fid = userData.result.user.fid;

        // 2. Ambil cast terbaru
        const resCast = await fetch(`https://api.neynar.com/v2/farcaster/casts?fid=${fid}&limit=1`, {
          headers: {
            'accept': 'application/json',
            'api_key': API_KEY
          }
        });

        const castData = await resCast.json();
        const latestCast = castData.result.casts[0];

        setCast(latestCast);
      } catch (error) {
        console.error('Error fetching cast:', error);
      }
    };

    fetchCast();
  }, []);

  return (
    <div>
      <h2>Latest Cast by @idsoon:</h2>
      {cast ? (
        <div>
          <p>{cast.text}</p>
          <button>Claim Airdrop</button>
        </div>
      ) : (
        <p>Loading cast...</p>
      )}
    </div>
  );
};

export default CastAndClaim;
