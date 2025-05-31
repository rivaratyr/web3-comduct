"use client";

import { useState } from "react";
import { ArrowLeft, BadgeCheck, Download, Award, Github, Twitter, Wallet, Medal, Activity, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ContributorScore } from "@/types/contributor";
import { ScoreChart } from "@/components/score-chart";
import { generateWalletPass } from "@/lib/wallet-pass";
import { useToast } from "@/hooks/use-toast";

interface ScoreResultsProps {
  score: ContributorScore;
  onReset: () => void;
}

export function ScoreResults({ score, onReset }: ScoreResultsProps) {
  const { toast } = useToast();
  const [isGeneratingPass, setIsGeneratingPass] = useState(false);
  
  const handleGenerateWalletPass = async (type: 'google' | 'apple') => {
    setIsGeneratingPass(true);
    
    try {
      await generateWalletPass(score, type);
      toast({
        title: "Success!",
        description: `Your pass has been added to your ${type === 'apple' ? 'Apple' : 'Google'} wallet.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add pass to your ${type === 'apple' ? 'Apple' : 'Google'} wallet.`,
      });
      console.error(error);
    } finally {
      setIsGeneratingPass(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <Button 
        variant="ghost" 
        className="group mb-4" 
        onClick={onReset}
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Form
      </Button>

      <Card className="border-2 border-primary/10 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <BadgeCheck className="h-6 w-6 text-chart-1" />
              Contributor Score
            </CardTitle>
            <div className="text-4xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              {score.totalScore}/100
            </div>
          </div>
          <CardDescription>
            Based on your digital identities and contribution history
          </CardDescription>
          {score.user.wallet && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Wallet className="h-4 w-4" />
              <span className="font-medium">{score.user.wallet}</span>
              {score.user.ensName ? (
                <div className="flex items-center gap-1 text-green-500 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{score.user.ensName}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <XCircle className="h-4 w-4" />
                  <span>No ENS name found</span>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-4 pb-2">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Score Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4 space-y-4">
              <ScoreChart score={score} />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub Contributions
                    </span>
                    <span className="font-medium">{score.githubScore}/40</span>
                  </div>
                  <Progress value={(score.githubScore / 40) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Twitter className="mr-2 h-4 w-4" />
                      Social Engagement
                    </span>
                    <span className="font-medium">{score.twitterScore}/30</span>
                  </div>
                  <Progress value={(score.twitterScore / 30) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4" />
                      Wallet Activity
                    </span>
                    <span className="font-medium">{score.walletScore}/30</span>
                  </div>
                  <Progress value={(score.walletScore / 30) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Medal className="mr-2 h-4 w-4" />
                      POAP Score
                    </span>
                    <span className="font-medium">{score.poapScore}/20</span>
                  </div>
                  <Progress value={(score.poapScore / 20) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Activity className="mr-2 h-4 w-4" />
                      Transaction Score
                    </span>
                    <span className="font-medium">{score.transactionScore}/20</span>
                  </div>
                  <Progress value={(score.transactionScore / 20) * 100} className="h-2" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Github className="h-4 w-4" /> GitHub Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {score.insights.github}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.repos}</div>
                      <div className="text-xs text-muted-foreground">Repos</div>
                    </div>
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.commits}</div>
                      <div className="text-xs text-muted-foreground">Commits</div>
                    </div>
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.stars}</div>
                      <div className="text-xs text-muted-foreground">Stars</div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Twitter className="h-4 w-4" /> Twitter Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {score.insights.twitter}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.followers}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.tweets}</div>
                      <div className="text-xs text-muted-foreground">Tweets</div>
                    </div>
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.engagement}%</div>
                      <div className="text-xs text-muted-foreground">Engagement</div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Wallet className="h-4 w-4" /> Wallet Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {score.insights.wallet}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.transactions}</div>
                      <div className="text-xs text-muted-foreground">Transactions</div>
                    </div>
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">${score.metrics.volume}</div>
                      <div className="text-xs text-muted-foreground">Volume</div>
                    </div>
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.age} days</div>
                      <div className="text-xs text-muted-foreground">Age</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Medal className="h-4 w-4" /> POAP Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {score.insights.poap}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-center text-sm">
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.poaps}</div>
                      <div className="text-xs text-muted-foreground">POAPs</div>
                    </div>
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.eventAttendance}</div>
                      <div className="text-xs text-muted-foreground">Events</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Transaction Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {score.insights.transaction}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-center text-sm">
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.uniqueTransactions}</div>
                      <div className="text-xs text-muted-foreground">Unique TXs</div>
                    </div>
                    <div className="rounded-md bg-background p-2">
                      <div className="font-medium">{score.metrics.transactions}</div>
                      <div className="text-xs text-muted-foreground">Total TXs</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col pt-4 gap-3">
          <div className="text-sm text-muted-foreground text-center w-full pb-2">
            Add your contributor score to your digital wallet
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleGenerateWalletPass('google')}
              disabled={isGeneratingPass}
            >
              {isGeneratingPass ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Google Wallet
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleGenerateWalletPass('apple')}
              disabled={isGeneratingPass}
            >
              {isGeneratingPass ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Apple Wallet
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}