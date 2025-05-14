export interface Vehicle {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  current_status: "IN_TRANSIT_TO" | "STOPPED_AT" | string;
  updated_at: string;
  route?: {
    id: string;
    type: string;
  };
  trip?: {
    id: string;
    type: string;
  };
}
