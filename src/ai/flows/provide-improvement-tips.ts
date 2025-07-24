'use server';

/**
 * @fileOverview An AI agent that provides specific, actionable tips for improving writing.
 *
 * - provideImprovementTips - A function that generates improvement tips for a given text.
 * - ProvideImprovementTipsInput - The input type for the provideImprovementTips function.
 * - ProvideImprovementTipsOutput - The return type for the provideImprovementTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideImprovementTipsInputSchema = z.object({
  text: z.string().describe('The text to provide improvement tips for.'),
  analysis: z.string().describe('The analysis of the text, including grammar, style, and clarity.'),
});
export type ProvideImprovementTipsInput = z.infer<typeof ProvideImprovementTipsInputSchema>;

const ProvideImprovementTipsOutputSchema = z.object({
  improvementTips: z.string().describe('Actionable tips for improving the writing based on the analysis.'),
});
export type ProvideImprovementTipsOutput = z.infer<typeof ProvideImprovementTipsOutputSchema>;

export async function provideImprovementTips(input: ProvideImprovementTipsInput): Promise<ProvideImprovementTipsOutput> {
  return provideImprovementTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideImprovementTipsPrompt',
  input: {schema: ProvideImprovementTipsInputSchema},
  output: {schema: ProvideImprovementTipsOutputSchema},
  prompt: `You are an AI writing assistant that provides specific, actionable tips for improving writing based on an analysis of the text.

  Text: {{{text}}}

  Analysis: {{{analysis}}}

  Based on the analysis, provide actionable tips for improving the writing. Focus on grammar, style, clarity, and overall quality.  Provide the tips as a numbered list.
  `,
});

const provideImprovementTipsFlow = ai.defineFlow(
  {
    name: 'provideImprovementTipsFlow',
    inputSchema: ProvideImprovementTipsInputSchema,
    outputSchema: ProvideImprovementTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
