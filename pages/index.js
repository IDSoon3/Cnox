import dynamic from "next/dynamic";

// Import secara dinamis untuk menghindari SSR issue
const CastAndClaim = dynamic(() => import("../components/CastAndClaim"), {
  ssr: false,
});

export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Cnox Farcaster Airdrop</h1>
      <CastAndClaim />
    </main>
  );
}
