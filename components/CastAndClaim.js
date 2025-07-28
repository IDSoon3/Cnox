'use client';
import { useEffect, useState } from 'react';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

const client = new NeynarAPIClient('719EBBE1-BF6D-45F4-AD31-96B2BD437494');

const CastAndClaim = () => {
  const [cast, setCast] = useState(null);

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const result = await client.lookUpUserByUsername('idsoon');
        const fid = result.result.user.fid;

        const casts = await client.fetchCasts(fid, { limit: 1 });
        const latestCast = casts.result.casts[0];
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
