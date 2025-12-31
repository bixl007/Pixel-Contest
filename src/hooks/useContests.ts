import { useQuery } from '@tanstack/react-query';

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

export const useContests = () => {
  return useQuery({
    queryKey: ['contests'],
    queryFn: async (): Promise<Contest[]> => {
      console.log('Fetching contests from direct sources...');
      
      // 1. Fetch Codeforces
      const cfPromise = fetch('https://codeforces.com/api/contest.list?gym=false')
        .then(res => res.json())
        .then(data => data.result
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
          }))
        ).catch((err) => {
          console.error('Codeforces fetch failed:', err);
          return [];
        });

      // 2. Fetch LeetCode (via proxy)
      const lcPromise = fetch('/leetcode-api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query upcomingContests { upcomingContests { title titleSlug startTime duration } }`
        })
      })
        .then(res => res.json())
        .then(data => data.data.upcomingContests.map((c: any) => ({
          name: c.title,
          url: `https://leetcode.com/contest/${c.titleSlug}`,
          start_time: new Date(c.startTime * 1000).toISOString(),
          end_time: new Date((c.startTime + c.duration) * 1000).toISOString(),
          duration: String(c.duration),
          site: 'LeetCode',
          in_24_hours: (c.startTime * 1000 - Date.now()) < 86400000 ? 'Yes' : 'No',
          status: 'BEFORE'
        })))
        .catch((err) => {
          console.error('LeetCode fetch failed:', err);
          return [];
        });

      // 3. Fetch CodeChef (via proxy)
      const ccPromise = fetch('/codechef-api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all')
        .then(res => res.json())
        .then(data => data.future_contests.map((c: any) => ({
          name: c.contest_name,
          url: `https://www.codechef.com/${c.contest_code}`,
          start_time: c.contest_start_date_iso,
          end_time: c.contest_end_date_iso,
          duration: String(parseInt(c.contest_duration) * 60), // CodeChef duration is in minutes
          site: 'CodeChef',
          in_24_hours: (new Date(c.contest_start_date_iso).getTime() - Date.now()) < 86400000 ? 'Yes' : 'No',
          status: 'BEFORE'
        })))
        .catch((err) => {
          console.error('CodeChef fetch failed:', err);
          return [];
        });

      const [cfContests, lcContests, ccContests] = await Promise.all([cfPromise, lcPromise, ccPromise]);

      return [...cfContests, ...lcContests, ...ccContests].sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
    },
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    staleTime: 10 * 60 * 1000, // Consider data stale after 10 minutes
  });
};
