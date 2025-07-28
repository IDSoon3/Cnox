'use client';
import { useEffect, useState } from 'react';

const CastAndClaim = () => {
  const [cast, setCast] = useState(null);

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

        // Ambil FID user @idsoon
        const userRes = await fetch(`https://api.neynar.com/v2/farcaster/user-by-username?username=idsoon`, {
          headers: {
            'accept': 'application/json',
            'api_key': apiKey,
          },
        });
        const userData = await userRes.json();
        const fid = userData.result.user.fid;

        // Ambil cast terbaru
        const castRes = await fetch(`https://api.neynar.com/v2/farcaster/casts?fid=${fid}&limit=1`, {
          headers: {
            'accept': 'application/json',
            'api_key': apiKey,
          },
        });
        const castData = await castRes.json();
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
