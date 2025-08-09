// This file uses server-side code.
'use server';

/**
 * @fileOverview AI tool that suggests optimal pricing and recommends amenities for venue owners.
 *
 * - suggestPricing - A function that handles the pricing suggestion process.
 * - SuggestPricingInput - The input type for the suggestPricing function.
 * - SuggestPricingOutput - The return type for the suggestPricing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPricingInputSchema = z.object({
  venueDetails: z
    .string()
    .describe('Detailed information about the venue, including location, capacity, and current pricing.'),
  competitorData: z
    .string()
    .describe('Data on competitor venues, including their pricing, amenities, and booking rates.'),
  demandData: z
    .string()
    .describe('Information about the current demand for venues in the area, including seasonal trends.'),
  historicalBookingData: z
    .string()
    .describe('Historical booking data for the venue, including booking rates and revenue.'),
});
export type SuggestPricingInput = z.infer<typeof SuggestPricingInputSchema>;

const SuggestPricingOutputSchema = z.object({
  suggestedPricing: z
    .string()
    .describe('The AI-suggested optimal pricing for the venue, based on the input data.'),
  recommendedAmenities: z
    .string()
    .describe('AI-recommended amenities to add to the venue to increase its appeal and revenue.'),
  reasoning: z
    .string()
    .describe('Explanation of why the pricing and amenities were suggested.'),
});
export type SuggestPricingOutput = z.infer<typeof SuggestPricingOutputSchema>;

export async function suggestPricing(input: SuggestPricingInput): Promise<SuggestPricingOutput> {
  return suggestPricingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPricingPrompt',
  input: {schema: SuggestPricingInputSchema},
  output: {schema: SuggestPricingOutputSchema},
  prompt: `You are an AI tool that suggests optimal pricing and recommends amenities for venue owners.

  Analyze the following venue details, competitor data, demand data, and historical booking data to determine the best pricing strategy and amenities to maximize revenue.

  Venue Details: {{{venueDetails}}}
  Competitor Data: {{{competitorData}}}
  Demand Data: {{{demandData}}}
  Historical Booking Data: {{{historicalBookingData}}}

  Based on this information, suggest an optimal pricing strategy and recommend amenities to the venue owner.

  Include the reasoning for the suggestions.

  Output your suggestions in the following format:
  Suggested Pricing: <suggested pricing>
  Recommended Amenities: <recommended amenities>
  Reasoning: <reasoning for suggestions>
  `,
});

const suggestPricingFlow = ai.defineFlow(
  {
    name: 'suggestPricingFlow',
    inputSchema: SuggestPricingInputSchema,
    outputSchema: SuggestPricingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
