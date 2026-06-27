import { createServerFn } from "@tanstack/react-start";

export type GithubRepo = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  archived: boolean;
  fork: boolean;
};

type GithubApiRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  archived: boolean;
  fork: boolean;
  private: boolean;
};

export const getGithubRepos = createServerFn({ method: "GET" }).handler(
  async (): Promise<GithubRepo[]> => {
    const username = "Aaliyan-coder";
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "aaliyan-portfolio",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`,
        { headers },
      );
      if (!res.ok) return [];
      const json = (await res.json()) as GithubApiRepo[];
      return json
        .filter((r) => !r.fork && !r.archived && !r.private)
        .map<GithubRepo>((r) => ({
          id: r.id,
          name: r.name,
          fullName: r.full_name,
          description: r.description,
          url: r.html_url,
          homepage: r.homepage,
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language,
          topics: r.topics ?? [],
          updatedAt: r.updated_at,
          archived: r.archived,
          fork: r.fork,
        }))
        .sort((a, b) => {
          if (b.stars !== a.stars) return b.stars - a.stars;
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
    } catch {
      return [];
    }
  },
);
