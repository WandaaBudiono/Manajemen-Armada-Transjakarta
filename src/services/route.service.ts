import api from "../helpers/http-client";
import type { Route, ApiListResponse } from "../types/api.types";

interface FetchRoutesOptions {
  offset?: number;
  limit?: number;
  filter?: string;
}

export async function fetchRoutes({
  offset = 0,
  limit = 20,
  filter = "",
}: FetchRoutesOptions = {}): Promise<ApiListResponse<Route>> {
  const params: Record<string, any> = {
    "page[offset]": offset,
    "page[limit]": limit,
    "filter[type]": "3",
    sort: "long_name",
  };

  if (filter) {
    params["filter[long_name]"] = filter;
  }

  const response = await api.get<ApiListResponse<Route>>("/routes", { params });
  return response.data;
}

export async function fetchRouteById(id: string) {
  const response = await api.get<ApiListResponse<Route>>(`/routes/${id}`);
  return response.data;
}
