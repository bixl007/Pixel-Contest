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

interface ClistContest {
  id: number;
  resource: string;
  resource_id: number;
  host: string;
  event: string;
  start: string;
  end: string;
  duration: number;
  href: string;
}

const CLIST_USERNAME = import.meta.env.VITE_CLIST_USERNAME;
const CLIST_API_KEY = import.meta.env.VITE_CLIST_API_KEY;

const fetchClistContests = async (): Promise<Contest[]> => {
  if (!CLIST_USERNAME || !CLIST_API_KEY) {
    console.warn('Clist API credentials missing. Please set VITE_CLIST_USERNAME and VITE_CLIST_API_KEY.');
    throw new Error('API configuration missing');
  }

  const now = new Date().toISOString();
  // 1 = Codeforces, 2 = CodeChef, 102 = LeetCode
  const resourceIds = '1,2,102';
  // Use query parameters for authentication to avoid 400 Bad Request
  // resource_id__in (single underscore between resource and id) is correct
  const url = `https://clist.by/api/v4/contest/?resource_id__in=${resourceIds}&start__gte=${encodeURIComponent(now)}&order_by=start&limit=20&username=${CLIST_USERNAME}&api_key=${CLIST_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch contests: ${response.statusText}`);
  }

  const data = await response.json();
  
  return data.objects.map((c: ClistContest) => {
    let site: Contest['site'] = 'Codeforces';
    if (c.resource_id === 2) site = 'CodeChef';
    if (c.resource_id === 102) site = 'LeetCode';

    return {
      name: c.event,
      url: c.href,
      start_time: c.start,
      end_time: c.end,
      duration: String(c.duration),
      site,
      in_24_hours: (new Date(c.start).getTime() - Date.now()) < 86400000 ? 'Yes' : 'No',
      status: 'BEFORE'
    };
  });
};

export const useContests = () => {
  return useQuery({
    queryKey: ['contests', 'clist'],
    queryFn: fetchClistContests,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
};

