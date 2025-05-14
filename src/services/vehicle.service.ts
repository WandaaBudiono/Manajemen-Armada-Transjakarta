import api from "../helpers/http-client";
import type { Vehicle, ApiResponse, ApiListResponse } from "../types/api.types";

export interface VehicleFilters {
  routes?: string[];
  trips?: string[];
}

interface FetchVehiclesOptions {
  offset?: number;
  limit?: number;
  routeIds?: string[];
  tripIds?: string[];
}

export async function fetchVehicles({
  offset = 0,
  limit = 20,
  routeIds,
  tripIds,
}: FetchVehiclesOptions = {}): Promise<ApiListResponse<Vehicle>> {
  const params: Record<string, any> = {
    "page[offset]": offset,
    "page[limit]": limit,
    include: "trip,route",
    sort: "-updated_at",
  };

  if (routeIds?.length) {
    params["filter[route]"] = routeIds.join(",");
  }

  if (tripIds?.length) {
    params["filter[trip]"] = tripIds.join(",");
  }

  const response = await api.get<ApiListResponse<Vehicle>>("/vehicles", {
    params,
  });
  return response.data;
}

export async function fetchVehicleById(
  id: string
): Promise<ApiResponse<Vehicle>> {
  const response = await api.get<ApiResponse<Vehicle>>(`/vehicles/${id}`, {
    params: {
      include: "trip,route",
    },
  });
  return response.data;
}
