// Mock API function to simulate fetching contributor score from OpenAI
// In a real implementation, this would make an actual call to OpenAI API

import { ContributorScore } from "@/types/contributor";

interface ContributorRequest {
  twitter?: string;
  github?: string;
  wallet?: string;
}

export async function fetchContributorScore(data: ContributorRequest): Promise<ContributorScore> {
  // If Twitter handle is provided, fetch Twitter data
  let twitterMetrics = null;
  if (data.twitter) {
    try {
      const response = await fetch('/api/twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: data.twitter }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch Twitter data');
      }
      
      const twitterData = await response.json();
      twitterMetrics = twitterData.metrics;
    } catch (error) {
      console.error('Error fetching Twitter data:', error);
    }
  }

  // If GitHub username is provided, fetch GitHub data
  let githubMetrics = null;
  if (data.github) {
    try {
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: data.github }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub data');
      }
      
      const githubData = await response.json();
      githubMetrics = githubData.metrics;
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    }
  }

  // If wallet address is provided, fetch ENS name and POAP data
  let ensName = null;
  let poapMetrics = null;
  if (data.wallet) {
    try {
      // Fetch ENS name
      const ensResponse = await fetch('/api/ens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: data.wallet }),
      });
      
      if (ensResponse.ok) {
        const ensData = await ensResponse.json();
        ensName = ensData.ensName;
      }

      // Fetch POAP data
      const poapResponse = await fetch('/api/poap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: data.wallet }),
      });
      
      if (poapResponse.ok) {
        const poapData = await poapResponse.json();
        poapMetrics = poapData.metrics;
      }
    } catch (error) {
      console.error('Error fetching ENS/POAP data:', error);
    }
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Initialize scores based on provided data
  const githubScore = data.github ? Math.min(40, (githubMetrics?.contributions || 0) / 100 + (githubMetrics?.pullRequests || 0) / 20 + (githubMetrics?.stars || 0) / 50) : 0;
  const twitterScore = data.twitter ? Math.min(30, (twitterMetrics?.followers || 0) / 1000 + (twitterMetrics?.engagement || 0) * 2) : 0;
  const walletScore = data.wallet ? Math.floor(Math.random() * 20) + 10 : 0;
  const poapScore = poapMetrics ? Math.min(20, (poapMetrics.totalPoaps * 2) + (poapMetrics.uniqueEvents)) : 0;
  const transactionScore = data.wallet ? Math.floor(Math.random() * 15) + 5 : 0;
  
  // Calculate total score based on provided inputs and additional metrics
  const providedInputs = [data.github, data.twitter, data.wallet].filter(Boolean).length;
  const baseScore = githubScore + twitterScore + walletScore;
  const additionalScore = poapScore + transactionScore;
  const totalScore = Math.min(100, Math.floor((baseScore + additionalScore) * (3 / providedInputs)));
  
  // Generate metrics based on the scores and API data
  const repos = githubMetrics?.repos || 0;
  const commits = githubMetrics?.commits || 0;
  const stars = githubMetrics?.stars || 0;
  
  const followers = twitterMetrics?.followers || 0;
  const tweets = twitterMetrics?.tweetsCount || 0;
  const engagement = twitterMetrics ? 
    Math.floor(((twitterMetrics.likesCount + twitterMetrics.retweetsCount + twitterMetrics.repliesCount) / 3) / tweets * 100) :
    0;
  
  const transactions = data.wallet ? Math.floor((walletScore / 30) * 200) + 20 : 0;
  const volume = data.wallet ? Math.floor((walletScore / 30) * 10000) + 500 : 0;
  const age = data.wallet ? Math.floor((walletScore / 30) * 500) + 30 : 0;
  
  // POAP and Transaction specific metrics
  const poaps = poapMetrics?.totalPoaps || 0;
  const uniqueTransactions = data.wallet ? Math.floor((transactionScore / 20) * 100) + 10 : 0;
  const eventAttendance = poapMetrics?.uniqueEvents || 0;
  
  // Generate insights based on provided data
  const githubInsight = data.github 
    ? (githubScore > 30 
        ? `Exceptional GitHub activity with ${commits} commits and ${stars} stars across ${repos} repositories. Strong open source contributor.`
        : githubScore > 20 
          ? `Good GitHub presence with ${commits} commits and ${stars} stars across ${repos} repositories.`
          : `Active on GitHub with ${commits} commits across ${repos} repositories. Consider increasing open source contributions.`)
    : `No GitHub data provided.`;
      
  const twitterInsight = data.twitter
    ? (twitterScore > 25 
        ? `High social engagement with ${followers} followers and ${engagement}% engagement rate.`
        : twitterScore > 15 
          ? `Moderate social activity with ${followers} followers and ${engagement}% engagement rate.`
          : `Limited social presence with ${followers} followers. Consider increasing community engagement.`)
    : `No Twitter data provided.`;
      
  const walletInsight = data.wallet
    ? (walletScore > 25 
        ? `Active wallet with significant transaction history and ecosystem participation.${ensName ? ` Associated ENS: ${ensName}` : ''}`
        : walletScore > 15 
          ? `Moderate wallet activity showing regular ecosystem participation.${ensName ? ` Associated ENS: ${ensName}` : ''}`
          : `Limited wallet activity detected. Consider increasing on-chain participation.${ensName ? ` Associated ENS: ${ensName}` : ''}`)
    : `No wallet data provided.`;

  const poapInsight = data.wallet
    ? (poapScore > 15
        ? `Exceptional event participation with ${poaps} POAPs collected across ${eventAttendance} unique events.`
        : poapScore > 10
          ? `Good event attendance with ${poaps} POAPs collected across ${eventAttendance} unique events.`
          : `Some POAP activity detected with ${poaps} POAPs across ${eventAttendance} events. Consider participating in more events.`)
    : `No wallet data provided for POAP analysis.`;

  const transactionInsight = data.wallet
    ? (transactionScore > 15
        ? `High transaction diversity with ${uniqueTransactions} unique transactions.`
        : transactionScore > 10
          ? `Regular transaction patterns with ${uniqueTransactions} unique transactions.`
          : `Basic transaction activity with ${uniqueTransactions} unique transactions. Consider exploring more protocols.`)
    : `No wallet data provided for transaction analysis.`;

  return {
    totalScore,
    githubScore,
    twitterScore,
    walletScore,
    poapScore,
    transactionScore,
    metrics: {
      repos,
      commits,
      stars,
      followers,
      tweets,
      engagement,
      transactions,
      volume,
      age,
      poaps,
      uniqueTransactions,
      eventAttendance
    },
    insights: {
      github: githubInsight,
      twitter: twitterInsight,
      wallet: walletInsight,
      poap: poapInsight,
      transaction: transactionInsight
    },
    user: {
      twitter: data.twitter || "",
      github: data.github || "",
      wallet: data.wallet || "",
      ensName: ensName || ""
    }
  };
}