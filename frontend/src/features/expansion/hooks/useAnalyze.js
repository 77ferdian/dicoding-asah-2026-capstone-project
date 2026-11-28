import { useQuery } from '@tanstack/react-query';
import * as api from '../api/expansionApi';

export function useAnalyze(candidateId, radius, weights = null) {
  return useQuery({
    queryKey: ['expansion-analysis', candidateId, radius, weights],
    queryFn: () => api.analyzeCandidate(candidateId, { radius, weights }),
    enabled: !!candidateId,
    staleTime: 5 * 60 * 1000,
  });
}
