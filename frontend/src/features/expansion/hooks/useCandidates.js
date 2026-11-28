import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/expansionApi';

export function useCandidates() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['expansion-candidates'],
    queryFn: api.listCandidates,
  });

  const add = useMutation({
    mutationFn: api.addCandidate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expansion-candidates'] }),
  });

  const remove = useMutation({
    mutationFn: api.deleteCandidate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expansion-candidates'] }),
  });

  return { ...query, add, remove };
}
