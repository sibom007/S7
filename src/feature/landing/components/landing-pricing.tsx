import { PricingTable } from "@clerk/nextjs";

export function LandingPricing() {
  return (
    <section
      id="pricing"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-foreground/2">
      <PricingTable newSubscriptionRedirectUrl="/billing/success" />
    </section>
  );
}
