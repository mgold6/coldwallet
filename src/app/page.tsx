import CryptoTicker from "@/components/market/CryptoTicker";
import Hero from "@/components/home/Hero";
import LiveMarketOverview from "@/components/market/LiveMarketOverview";
import MarketShowcase from "@/components/market/MarketShowcase";
import WhyColdWallet from "@/components/home/WhyColdWallet";
import HowItWorks from "@/components/home/HowItWorks";
import SecurityFirst from "@/components/home/SecurityFirst";
import DashboardPreview from "@/components/home/DashboardPreview";
import ProductShowcase from "@/components/home/ProductShowcase";
import TrustBanner from "@/components/home/TrustBanner";
import Testimonials from "@/components/home/Testimonials";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <>

      <CryptoTicker />

      <Hero />

      <LiveMarketOverview />

      <MarketShowcase />

      <WhyColdWallet />

      <HowItWorks />

      <SecurityFirst />

      <DashboardPreview />

      <ProductShowcase />

      <TrustBanner />

      <Testimonials />

      <FinalCTA />

      <Footer />

    </>
  );
}