"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Github, Twitter, Wallet, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScoreResults } from "@/components/score-results";
import { LoadingScreen } from "@/components/loading-screen";
import { fetchContributorScore } from "@/lib/contributor-api";
import { ContributorScore } from "@/types/contributor";

const formSchema = z.object({
  twitter: z.string().optional(),
  github: z.string().optional(),
  wallet: z.string().optional(),
}).refine((data) => {
  // At least one field must be filled
  return data.twitter || data.github || data.wallet;
}, {
  message: "At least one identity (Twitter, GitHub, or Wallet) is required",
  path: ["twitter"], // This shows the error under the first field
});

export function ContributorForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [scoreResults, setScoreResults] = useState<ContributorScore | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      twitter: "",
      github: "",
      wallet: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      // Simulate a minimum loading time of 3 seconds
      const [result] = await Promise.all([
        fetchContributorScore(values),
        new Promise(resolve => setTimeout(resolve, 3000))
      ]);
      
      setScoreResults(result);
      toast({
        title: "Score calculated!",
        description: "Your contributor score has been successfully calculated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to calculate your score. Please try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (scoreResults) {
    return <ScoreResults score={scoreResults} onReset={() => setScoreResults(null)} />;
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" /> Twitter Handle
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        @
                      </span>
                      <Input className="pl-8" placeholder="username" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your Twitter/X username without the @ symbol.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Github className="h-4 w-4" /> GitHub Username
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="github-username" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your GitHub username used for contributions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="wallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" /> Wallet Address
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Ethereum wallet address where you receive contributions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full transition-all duration-300 bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-2 hover:to-chart-1" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating Score
                </>
              ) : (
                "Calculate Your Score"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}