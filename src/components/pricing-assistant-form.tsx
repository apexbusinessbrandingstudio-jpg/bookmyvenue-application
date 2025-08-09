
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  suggestPricing,
  type SuggestPricingOutput,
} from "@/ai/flows/suggest-pricing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Sparkles, Lightbulb, IndianRupee } from "lucide-react";

const formSchema = z.object({
  venueDetails: z.string().min(1, "Venue details are required."),
  competitorData: z.string().min(1, "Competitor data is required."),
  demandData: z.string().min(1, "Demand data is required."),
  historicalBookingData: z
    .string()
    .min(1, "Historical booking data is required."),
});

type PricingAssistantFormProps = {
  venueDetails: string;
};

export function PricingAssistantForm({
  venueDetails,
}: PricingAssistantFormProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestPricingOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      venueDetails: venueDetails,
      competitorData: "",
      demandData: "",
      historicalBookingData: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const output = await suggestPricing(values);
      setResult(output);
    } catch (e: any) {
      setError(
        "An error occurred while generating suggestions. Please try again."
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Input Data</CardTitle>
          <CardDescription>
            Provide the following information for an accurate analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="venueDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Details</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Describe your venue..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="competitorData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competitor Data</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Pricing, amenities, and booking rates of similar venues in your area."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="demandData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demand Data</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Seasonal trends, popular event types, and booking lead times."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalBookingData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Booking Data</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Your past booking rates, revenue per booking, and peak seasons."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Get Suggestions
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mt-8 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Sparkles className="text-accent" /> AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <IndianRupee className="text-primary" />
                Suggested Pricing
              </h3>
              <p className="rounded-md bg-secondary/50 p-4">
                {result.suggestedPricing}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Lightbulb className="text-primary" />
                Recommended Amenities
              </h3>
              <p className="rounded-md bg-secondary/50 p-4">
                {result.recommendedAmenities}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Lightbulb className="text-primary" />
                Reasoning
              </h3>
              <p className="whitespace-pre-wrap rounded-md bg-secondary/50 p-4">
                {result.reasoning}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
