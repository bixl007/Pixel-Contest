import { useQueries } from '@tanstack/react-query';

export interface Contest {
  name: string;
  url: string;
  start_time: string;
  end_time: string;
  duration: string;
  site: 'LeetCode' | 'Codeforces' | 'CodeChef';
  in_24_hours: string;
  status: string;
}

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const fetchCodeforces = async (): Promise<Contest[]> => {
  try {
    const res = await fetchWithTimeout('https://codeforces.com/api/contest.list?gym=false');
    const data = await res.json();
    return data.result
      .filter((c: any) => c.phase === 'BEFORE')
      .map((c: any) => ({
        name: c.name,
        url: 'https://codeforces.com/contests/' + c.id,
        start_time: new Date(c.startTimeSeconds * 1000).toISOString(),
        end_time: new Date((c.startTimeSeconds + c.durationSeconds) * 1000).toISOString(),
        duration: String(c.durationSeconds),
        site: 'Codeforces',
        in_24_hours: c.relativeTimeSeconds > -86400 ? 'Yes' : 'No',
        status: 'BEFORE'
      }));
  } catch (err) {
    console.error('Codeforces fetch failed:', err);
    return [];
  }
};

const fetchLeetCode = async (): Promise<Contest[]> => {
  try {
    let data;
    if (import.meta.env.DEV) {
      const res = await fetchWithTimeout('/leetcode-api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query upcomingContests { upcomingContests { title titleSlug startTime duration } }`
        })
      });
      const json = await res.json();
      data = json.data.upcomingContests;
    } else {
      const query = `query upcomingContests { upcomingContests { title titleSlug startTime duration } }`;
      const targetUrl = `https://leetcode.com/graphql?query=${encodeURIComponent(query)}`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      
      const res = await fetchWithTimeout(proxyUrl);
      const json = await res.json();
      const innerData = JSON.parse(json.contents);
      data = innerData.data.upcomingContests;
    }

    return data.map((c: any) => ({
      name: c.title,
      url: `https://leetcode.com/contest/${c.titleSlug}`,
      start_time: new Date(c.startTime * 1000).toISOString(),
      end_time: new Date((c.startTime + c.duration) * 1000).toISOString(),
      duration: String(c.duration),
      site: 'LeetCode',
      in_24_hours: (c.startTime * 1000 - Date.now()) < 86400000 ? 'Yes' : 'No',
      status: 'BEFORE'
    }));
  } catch (err) {
    console.error('LeetCode fetch failed:', err);
    return [];
  }
};

const fetchCodeChef = async (): Promise<Contest[]> => {
  try {
    let data;
    if (import.meta.env.DEV) {
      const res = await fetchWithTimeout('/codechef-api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all');
      data = await res.json();
    } else {
      const targetUrl = 'https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all';
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetchWithTimeout(proxyUrl);
      data = await res.json();
    }

    return data.future_contests.map((c: any) => ({
      name: c.contest_name,
      url: `https://www.codechef.com/${c.contest_code}`,
      start_time: c.contest_start_date_iso,
      end_time: c.contest_end_date_iso,
      duration: String(parseInt(c.contest_duration) * 60), // CodeChef duration is in minutes
      site: 'CodeChef',
      in_24_hours: (new Date(c.contest_start_date_iso).getTime() - Date.now()) < 86400000 ? 'Yes' : 'No',
      status: 'BEFORE'
    }));
  } catch (err) {
    console.error('CodeChef fetch failed:', err);
    return [];
  }
};

export const useContests = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ['contests', 'codeforces'],
        queryFn: fetchCodeforces,
        staleTime: 10 * 60 * 1000,
        refetchInterval: 30 * 60 * 1000,
      },
      {
        queryKey: ['contests', 'leetcode'],
        queryFn: fetchLeetCode,
        staleTime: 10 * 60 * 1000,
        refetchInterval: 30 * 60 * 1000,
      },
      {
        queryKey: ['contests', 'codechef'],
        queryFn: fetchCodeChef,
        staleTime: 10 * 60 * 1000,
        refetchInterval: 30 * 60 * 1000,
      }
    ]
  });

  const hasData = results.some(r => r.data && r.data.length > 0);
  
  // Show loading if some are loading AND we have no data yet
  // This prevents "No contests found" flash while waiting for slower APIs
  const isLoading = results.some(r => r.isLoading) && !hasData;
  
  const isRefetching = results.some(r => r.isRefetching);
  const error = results.find(r => r.error)?.error || null;

  const data = results
    .flatMap(r => r.data || [])
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const refetch = () => {
    results.forEach(r => r.refetch());
  };

  return { data, isLoading, error, refetch, isRefetching };
};
