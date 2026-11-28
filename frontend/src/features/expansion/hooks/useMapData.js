import { useQuery } from '@tanstack/react-query';
import * as api from '../api/expansionApi';

export function useMapData() {
  return useQuery({
    queryKey: ['expansion-map-data'],
    queryFn: api.getMapData,
    staleTime: 10 * 60 * 1000,
  });
}
