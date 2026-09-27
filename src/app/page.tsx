import AudienceCards from "@/components/home/AudienceCards";
import HeroSection from "@/components/home/HeroSection";
import HomeCTA from "@/components/home/HomeCTA";
import HowGreenBridgeWorks from "@/components/home/HowGreenBridgeWorks";
import WhyGreenBridge from "@/components/home/WhyGreenbridge";

export default function HomePage() {
  return (
    <main
      className="
        overflow-x-hidden
        bg-background
        pb-[calc(72px+env(safe-area-inset-bottom))]
        lg:pb-0
      "
    >
      <HeroSection />
      <AudienceCards />
      <HowGreenBridgeWorks />
      <WhyGreenBridge />
      <HomeCTA />
    </main>
  );
}
