"use server";

import { analyzeWriting } from "@/ai/flows/analyze-writing";

export async function getAnalysis(text: string) {
  if (!text) {
    throw new Error("Text cannot be empty.");
  }

  try {
    const analysis = await analyzeWriting({ text });
    return analysis;
  } catch (error) {
    console.error("Error in getAnalysis action:", error);
    throw new Error("Failed to get analysis from AI.");
  }
}
