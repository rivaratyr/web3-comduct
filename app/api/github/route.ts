// pages/api/githubMetrics.ts
import { NextResponse } from 'next/server';

const GITHUB_API_URL = 'https://api.github.com';

interface GithubMetrics {
  repos: number;
  stars: number;
  commits: number;
  contributions: number;
  pullRequests: number;
  issues: number;
}

async function fetchWithAuth(url: string) {
  // If the URL is using /search/commits, GitHub requires the 'cloak-preview' Accept header:
  const isCommitSearch = url.startsWith(`${GITHUB_API_URL}/search/commits`);
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Accept': isCommitSearch
      ? 'application/vnd.github.cloak-preview+json'
      : 'application/vnd.github.v3+json'
  };
  return fetch(url, { headers });
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // 1. Fetch user to confirm they exist
    const userResponse = await fetchWithAuth(`${GITHUB_API_URL}/users/${username}`);
    if (!userResponse.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userData = await userResponse.json();

    // 2. Fetch all public repos for that user (max 100 per page; you could paginate if needed)
    const reposResponse = await fetchWithAuth(
      `${GITHUB_API_URL}/users/${username}/repos?per_page=100&type=all`
    );
    if (!reposResponse.ok) {
      // Possibly a rare error if GitHub is rate‐limiting repo listing
      return NextResponse.json({ error: 'Failed to fetch repos' }, { status: 500 });
    }
    const repos = await reposResponse.json();

    // Initialize metrics
    const metrics: GithubMetrics = {
      repos: Array.isArray(repos) ? repos.length : 0,
      stars: Array.isArray(repos)
        ? repos.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0)
        : 0,
      commits: 0,
      contributions: 0,
      pullRequests: 0,
      issues: 0
    };

    // 3. Fetch total commit count (global) via search/commits
    //    Note: we set per_page=1 because we only care about total_count
    const contributionsResponse = await fetchWithAuth(
      `${GITHUB_API_URL}/search/commits?q=author:${username}&per_page=1`
    );
    if (contributionsResponse.ok) {
      const contributionsData = await contributionsResponse.json();
      metrics.commits = contributionsData.total_count || 0;
    } else {
      // If GitHub returns a 422 or some error, just leave commits=0
      metrics.commits = 0;
    }

    // 4. Fetch total PRs authored (global)
    const prsResponse = await fetchWithAuth(
      `${GITHUB_API_URL}/search/issues?q=author:${username}+type:pr&per_page=1`
    );
    if (prsResponse.ok) {
      const prsData = await prsResponse.json();
      metrics.pullRequests = prsData.total_count || 0;
    } else {
      metrics.pullRequests = 0;
    }

    // 5. Fetch total issues authored (global)
    const issuesResponse = await fetchWithAuth(
      `${GITHUB_API_URL}/search/issues?q=author:${username}+type:issue&per_page=1`
    );
    if (issuesResponse.ok) {
      const issuesData = await issuesResponse.json();
      metrics.issues = issuesData.total_count || 0;
    } else {
      metrics.issues = 0;
    }

    // 6. If you want a “contributions” field that is, for example, commits + PRs + issues,
    //    you can define it however you like. For demonstration, let’s say:
    metrics.contributions = metrics.commits + metrics.pullRequests + metrics.issues;

    // 7. Pick top 5 repos by star count
    const topRepos = Array.isArray(repos)
      ? repos
          .sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
          .slice(0, 5)
          .map((repo: any) => ({
            name: repo.name,
            stars: repo.stargazers_count,
            description: repo.description,
            url: repo.html_url
          }))
      : [];

    return NextResponse.json({
      user: userData,
      metrics,
      topRepos
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
