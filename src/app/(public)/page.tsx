import Hero from "@/components/home/Hero";
import LiveMarketOverview from "@/components/market/LiveMarketOverview";
import WhyColdWallet from "@/components/home/WhyColdWallet";
import AssetControlSection from "@/components/home/AssetControlSection";
import SecurityFirst from "@/components/home/SecurityFirst";
import HowItWorks from "@/components/home/HowItWorks";
import DashboardPreview from "@/components/home/DashboardPreview";
import ProductShowcase from "@/components/home/ProductShowcase";
import Testimonials from "@/components/home/Testimonials";
import TrustBanner from "@/components/home/TrustBanner";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <>
      <Hero />

      <LiveMarketOverview />

      <WhyColdWallet />

      <AssetControlSection />

      <SecurityFirst />

      <HowItWorks />

      <DashboardPreview />

      <ProductShowcase />

      <Testimonials />

      <TrustBanner />

      <FinalCTA />

      <Footer />
    </>
  );
}