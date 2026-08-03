import Navbar from "@/components/layout/Navbar";
import CryptoTicker from "@/components/market/CryptoTicker";
import Hero from "@/components/home/Hero";
import LiveMarketOverview from "@/components/market/LiveMarketOverview";
import WhyColdWallet from "@/components/home/WhyColdWallet";
import HowItWorks from "@/components/home/HowItWorks";
import SecurityFirst from "@/components/home/SecurityFirst";
import DashboardPreview from "@/components/home/DashboardPreview";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white">

      <Navbar />

      <CryptoTicker />

      <Hero />

      <LiveMarketOverview />

      <WhyColdWallet />

      <HowItWorks />

      <SecurityFirst />

      <DashboardPreview />

      <Footer />

    </main>
  );
}