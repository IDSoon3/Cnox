import Head from 'next/head';
import dynamic from 'next/dynamic';

// Import komponen CastAndClaim dengan dynamic import (tanpa SSR)
const CastAndClaim = dynamic(() => import('../components/CastAndClaim'), {
  ssr: false
});

export default function Home() {
  return (
    <div>
      <Head>
        <title>Welcome to Cnox</title>
      </Head>

      <h1>Welcome to Cnox</h1>
      <p>Airdrop claiming interface using Supabase and Ethers.js</p>

      <CastAndClaim />
    </div>
  );
}
