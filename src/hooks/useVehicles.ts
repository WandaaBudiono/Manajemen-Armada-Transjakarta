import { useQuery } from "@tanstack/react-query";
import { fetchVehicles } from "../services/vehicle.service";
import type { VehicleFilters } from "../services/vehicle.service";

interface UseVehiclesOptions {
  limit: number;
  offset: number;
  filters: VehicleFilters;
}

export function useVehicles({ limit, offset, filters }: UseVehiclesOptions) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["vehicles", limit, offset, filters],
    queryFn: () =>
      fetchVehicles({
        limit,
        offset,
        routeIds: filters.routes,
        tripIds: filters.trips,
      }),
  });

  return {
    vehicles: data?.data ?? [],
    totalItems: data?.meta?.total ?? 0,
    loading: isLoading,
    error: error as Error,
    refetch,
  };
}
