// This file contains the Genkit flow for analyzing writing and providing feedback on grammar, style, and clarity.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @fileOverview Writing analysis AI agent.
 *
 * - analyzeWriting - A function that handles the writing analysis process.
 * - AnalyzeWritingInput - The input type for the analyzeWriting function.
 * - AnalyzeWritingOutput - The return type for the analyzeWriting function.
 */

const AnalyzeWritingInputSchema = z.object({
  text: z.string().describe('The text to be analyzed.'),
});
export type AnalyzeWritingInput = z.infer<typeof AnalyzeWritingInputSchema>;

const AnalyzeWritingOutputSchema = z.object({
  grammarFeedback: z.string().describe('Feedback on the grammar of the text.'),
  styleFeedback: z.string().describe('Feedback on the style of the text.'),
  clarityFeedback: z.string().describe('Feedback on the clarity of the text.'),
  overallFeedback: z.string().describe('Overall feedback on the text.'),
  improvementTips: z.string().describe('Actionable tips for improving the writing.'),
});
export type AnalyzeWritingOutput = z.infer<typeof AnalyzeWritingOutputSchema>;

export async function analyzeWriting(input: AnalyzeWritingInput): Promise<AnalyzeWritingOutput> {
  return analyzeWritingFlow(input);
}

const analyzeWritingPrompt = ai.definePrompt({
  name: 'analyzeWritingPrompt',
  input: {schema: AnalyzeWritingInputSchema},
  output: {schema: AnalyzeWritingOutputSchema},
  prompt: `You are an AI writing assistant that analyzes text and provides feedback.

Analyze the following text for grammar, style, and clarity. Provide specific feedback and actionable tips for improvement.

Text: {{{text}}}

Here's how the response should be formatted:

Grammar Feedback: [Feedback on grammar]
Style Feedback: [Feedback on style]
Clarity Feedback: [Feedback on clarity]
Overall Feedback: [Overall feedback on the text]
Improvement Tips: [Actionable tips for improving the writing]`,
});

const analyzeWritingFlow = ai.defineFlow(
  {
    name: 'analyzeWritingFlow',
    inputSchema: AnalyzeWritingInputSchema,
    outputSchema: AnalyzeWritingOutputSchema,
  },
  async input => {
    const {output} = await analyzeWritingPrompt(input);
    return output!;
  }
);
