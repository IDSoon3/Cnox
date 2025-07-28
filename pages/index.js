// pages/index.tsx

import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home({ cast }: any) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cnox</title>
        <meta name="description" content="Airdrop claiming interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Welcome to Cnox</h1>
        <p>Airdrop claiming interface using Supabase and Ethers.js</p>

        <h2>Latest Cast by @{cast.author.username}:</h2>
        <p>{cast.text}</p>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  // ✅ Dummy data sementara (gak perlu API)
  const cast = {
    author: {
      username: "idsoon",
    },
    text: "Ini contoh cast dummy dari Farcaster 🚀",
  };

  return {
    props: {
      cast,
    },
  };
}
