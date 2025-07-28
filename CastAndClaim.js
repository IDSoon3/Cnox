// file: components/CastAndClaim.js
'use client';

import { useEffect, useState } from 'react';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY || '');

export default function CastAndClaim() {
  const [cast, setCast] = useState(null);

  useEffect(() => {
    async function fetchCast() {
      try {
        const res = await client.lookUpCastByHashOrWarpcastUrl({
          identifier: 'https://warpcast.com/idsoon/0x1ec93064',
        });
        setCast(res.cast);
      } catch (e) {
        console.error('Failed to fetch cast', e);
      }
    }

    fetchCast();
  }, []);

  return (
    <div>
      <h2>Cast Terbaru dari @idsoon</h2>
      {cast ? (
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <p>{cast.text}</p>
          <button style={{ marginTop: '10px' }}>Claim Airdrop</button>
        </div>
      ) : (
        <p>Loading cast...</p>
      )}
    </div>
  );
}
