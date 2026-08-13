import Navbar from "@/components/layout/Navbar";
import CryptoTicker from "@/components/market/CryptoTicker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CryptoTicker />

      <Navbar />

      {children}
    </>
  );
}