import { PricingAssistantForm } from "@/components/pricing-assistant-form";

export default function PricingAssistantPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">AI Pricing Assistant</h1>
        <p className="mt-2 text-muted-foreground">
          Get AI-powered recommendations to optimize your venue's pricing and
          amenities.
        </p>
      </div>
      <PricingAssistantForm venueDetails="A beautiful farmhouse set in acres of lush green meadows, perfect for weddings and corporate retreats. Located in Sunnyvale, CA. Capacity: 200 guests. Current price: $1500/day." />
    </div>
  );
}
