import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home(props) {
  const cast = props.cast;

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
  const cast = {
    author: {
      username: "idsoon",
    },
    text: "Ini dummy cast Farcaster 🚀",
  };

  return {
    props: {
      cast,
    },
  };
}
