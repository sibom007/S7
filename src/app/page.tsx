import { LandingFeatures } from "@/feature/landing/components/landing-features";
import {
  LandingCTA,
  LandingFooter,
} from "@/feature/landing/components/landing-footer";
import { LandingHeader } from "@/feature/landing/components/landing-header";
import { LandingHero } from "@/feature/landing/components/landing-hero";
import { LandingPricing } from "@/feature/landing/components/landing-pricing";
import { LandingShowcase } from "@/feature/landing/components/landing-showcase";

export default function Page() {
  return (
    <main className="overflow-hidden">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingShowcase />
      <LandingPricing />
      <LandingCTA />
      <LandingFooter />
    </main>
  );
}
