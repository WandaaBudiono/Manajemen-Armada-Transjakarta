import api from "../helpers/http-client";
import type { Trip, ApiListResponse } from "../types/api.types";

interface FetchTripsOptions {
  offset?: number;
  limit?: number;
  filter?: string;
  routeIds?: string[];
}

export async function fetchTrips({
  offset = 0,
  limit = 20,
  filter = "",
  routeIds,
}: FetchTripsOptions = {}): Promise<ApiListResponse<Trip>> {
  const params: Record<string, any> = {
    "page[offset]": offset,
    "page[limit]": limit,
    include: "route",
    sort: "-updated_at",
  };

  if (routeIds?.length) {
    params["filter[route]"] = routeIds.join(",");
  }

  if (!routeIds?.length && !filter) {
    const today = new Date().toISOString().split("T")[0];
    params["filter[date]"] = today;
  }

  const response = await api.get<ApiListResponse<Trip>>("/trips", { params });
  return response.data;
}

export async function fetchTripById(
  id: string
): Promise<ApiListResponse<Trip>> {
  const response = await api.get<ApiListResponse<Trip>>(`/trips/${id}`, {
    params: {
      include: "route",
    },
  });
  return response.data;
}
