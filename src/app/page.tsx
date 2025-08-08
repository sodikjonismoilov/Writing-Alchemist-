"use client";

import { useState, useEffect } from "react";
import { Loader2, Palette, PenLine, Sparkles, SpellCheck, ThumbsUp, Lightbulb, Download, Timer as TimerIcon, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { getAnalysis } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { AnalyzeWritingOutput } from "@/ai/flows/analyze-writing";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeWritingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [duration, setDuration] = useState(15 * 60);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [timerOn, setTimerOn] = useState(false);

  useEffect(() => {
    if (!timerOn) return;

    if (timeLeft <= 0) {
      setTimerOn(false);
      toast({
        title: "Time's up!",
        description: "Your writing session has ended.",
      });
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerOn, timeLeft, toast]);

  const handleSetDuration = (minutes: number) => {
    if (timerOn) return;
    const newDuration = minutes * 60;
    setDuration(newDuration);
    setTimeLeft(newDuration);
  };

  const startTimer = () => {
    if (timeLeft > 0) {
      setTimerOn(true);
    }
  };

  const pauseTimer = () => {
    setTimerOn(false);
  };
  
  const resetTimer = () => {
    setTimerOn(false);
    setTimeLeft(duration);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const progress = (timeLeft / duration) * 100;
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Text is empty",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await getAnalysis(text);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      toast({
        title: "Analysis Failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!analysis) return;

    const content = `Original Text:\n-----------------\n${text}\n\n\nAnalysis:\n-----------------\n\n[Grammar Feedback]\n${analysis.grammarFeedback}\n\n[Style Feedback]\n${analysis.styleFeedback}\n\n[Clarity Feedback]\n${analysis.clarityFeedback}\n\n[Overall Feedback]\n${analysis.overallFeedback}\n\n[Improvement Tips]\n${analysis.improvementTips}`;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "writing_analysis.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const analysisSections = analysis ? [
    { title: "Grammar", icon: SpellCheck, content: analysis.grammarFeedback },
    { title: "Style", icon: Palette, content: analysis.styleFeedback },
    { title: "Clarity", icon: Sparkles, content: analysis.clarityFeedback },
    { title: "Overall", icon: ThumbsUp, content: analysis.overallFeedback },
    { title: "Improvement Tips", icon: Lightbulb, content: analysis.improvementTips },
  ] : [];

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-4 mb-2">
            <PenLine className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-headline tracking-wider">Writing Alchemist</h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your words with the power of AI. Get instant feedback to elevate your grammar, style, and clarity.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Your Text</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your writing here and let the magic happen..."
              className="min-h-[300px] md:min-h-[450px] text-base resize-none"
              aria-label="Text input for writing analysis"
            />
            <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Text"
              )}
            </Button>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                      <TimerIcon className="w-6 h-6 text-primary" />
                      <CardTitle className="font-headline text-2xl">Focus Timer</CardTitle>
                  </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-6">
                  <div className="relative h-32 w-32">
                      <svg className="absolute inset-0" viewBox="0 0 120 120">
                          <circle
                              className="text-border"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              r="52"
                              cx="60"
                              cy="60"
                          />
                          <circle
                              className="text-primary transition-all duration-1000 ease-linear"
                              stroke="currentColor"
                              strokeWidth="8"
                              strokeLinecap="round"
                              fill="transparent"
                              r="52"
                              cx="60"
                              cy="60"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              transform="rotate(-90 60 60)"
                          />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold font-mono text-primary tracking-widest">
                          {formatTime(timeLeft)}
                      </div>
                  </div>

                  {!timerOn && (
                    <div className="flex gap-2">
                        {[5, 15, 30, 60].map(min => (
                            <Button key={min} variant={duration === min * 60 ? "default" : "outline"} size="sm" onClick={() => handleSetDuration(min)}>
                                {min}m
                            </Button>
                        ))}
                    </div>
                  )}

                  <div className="flex gap-4 items-center">
                      <Button onClick={resetTimer} variant="outline" size="icon" className="rounded-full h-12 w-12">
                          <RotateCcw className="h-5 w-5" />
                      </Button>
                      {!timerOn ? (
                          <Button onClick={startTimer} size="lg" className="rounded-full h-20 w-20 text-lg" disabled={timeLeft === 0}>
                              <Play className="h-6 w-6" />
                          </Button>
                      ) : (
                          <Button onClick={pauseTimer} size="lg" className="rounded-full h-20 w-20 text-lg">
                              <Pause className="h-6 w-6" />
                          </Button>
                      )}
                       <div className="w-12" />
                  </div>
              </CardContent>
          </Card>
          {isLoading && (
            <>
              <Progress value={undefined} className="w-full h-2 animate-pulse" />
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="shadow-lg">
                  <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {!isLoading && analysis && (
            <div className="flex flex-col gap-4 animate-in fade-in-50 duration-500">
               <div className="flex justify-end">
                <Button onClick={handleDownload} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Analysis
                </Button>
               </div>
              {analysisSections.map((item, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    <CardTitle className="font-headline text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg dark:prose-invert max-w-none font-body whitespace-pre-wrap">
                      {item.content}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!isLoading && !analysis && (
            <div className="flex items-center justify-center h-[300px] bg-card rounded-lg border-2 border-dashed shadow-sm">
                <div className="text-center text-muted-foreground p-8">
                    <Sparkles className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-xl font-semibold font-headline">Awaiting Your Masterpiece</h3>
                    <p>Your writing analysis will appear here.</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
