export interface ContributorScore {
  totalScore: number;
  githubScore: number;
  twitterScore: number;
  walletScore: number;
  poapScore: number;
  transactionScore: number;
  
  metrics: {
    repos: number;
    commits: number;
    stars: number;
    followers: number;
    tweets: number;
    engagement: number;
    transactions: number;
    volume: number;
    age: number;
    poaps: number;
    uniqueTransactions: number;
    eventAttendance: number;
  };
  
  insights: {
    github: string;
    twitter: string;
    wallet: string;
    poap: string;
    transaction: string;
  };
  
  user: {
    twitter: string;
    github: string;
    wallet: string;
    ensName: string;
  };
}