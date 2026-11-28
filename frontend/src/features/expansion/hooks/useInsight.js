import { useMutation } from '@tanstack/react-query';
import * as api from '../api/expansionApi';

export function useInsight() {
  return useMutation({
    mutationFn: ({ candidateId, payload }) => api.generateInsight(candidateId, payload),
  });
}
