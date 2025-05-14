export interface PaginationLinks {
  self?: string;
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
}

export interface PaginationMeta {
  total?: number;
}

export interface ApiResponse<T> {
  data: T;
  included?: any[];
  links: PaginationLinks;
  meta?: PaginationMeta;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {}

export interface Route {
  id: string;
  attributes: {
    long_name: string;
    short_name: string;
    description: string;
    direction_names: string[];
    direction_destinations: string[];
  };
}

export interface Trip {
  id: string;
  attributes: {
    headsign: string;
    name: string;
    direction_id: number;
    block_id: string;
  };
  relationships: {
    route: {
      data: {
        id: string;
      };
    };
  };
}

export interface Vehicle {
  id: string;
  attributes: {
    label: string;
    current_status: string;
    latitude: number;
    longitude: number;
    updated_at: string;
    speed?: number;
    direction_id?: number;
    current_stop_sequence?: number;
    bearing?: number;
  };
  relationships: {
    route: {
      data: {
        id: string;
      };
    };
    trip: {
      data: {
        id: string;
      };
    };
  };
}
