import { useQuery } from '@tanstack/react-query';
import * as api from '../api/expansionApi';

export function useCompare(ids) {
  return useQuery({
    queryKey: ['expansion-compare', ids],
    queryFn: () => api.compareCandidates(ids),
    enabled: ids && ids.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
