import { useQuery } from "@tanstack/react-query";
import { fetchVehicleById } from "../services/vehicle.service";

export function useVehicle(id: string | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => fetchVehicleById(id!),
    enabled: !!id,
  });

  return {
    vehicle: data?.data,
    loading: isLoading,
    error: error as Error,
  };
}
