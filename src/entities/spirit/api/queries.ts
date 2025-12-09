import { useQuery } from '@tanstack/react-query';
import { Spirit, spiritSchema } from '../model';

interface SpiritsResponse {
  success: boolean;
  data: Spirit[];
  total: number;
}

async function fetchSpirits(): Promise<Spirit[]> {
  const response = await fetch('/api/spirits');

  if (!response.ok) {
    throw new Error('Failed to load spirits list');
  }

  const json: SpiritsResponse = await response.json();

  if (!json.success) {
    throw new Error('Failed to fetch data');
  }

  return json.data.map(spirit => spiritSchema.parse(spirit));
}

export const spiritKeys = {
  all: ['spirits'] as const,
  lists: () => [...spiritKeys.all, 'list'] as const,
  list: () => [...spiritKeys.lists()] as const,
};

export function useSpiritsQuery() {
  return useQuery({
    queryKey: spiritKeys.list(),
    queryFn: fetchSpirits,
  });
}
