import { useState } from "react";
import { useVehicles } from "../hooks/useVehicles";
import { useVehicle } from "../hooks/useVehicle";
import Modal from "../Components/Modal";
import TripFilter from "../Components/TripFilter";
import RouteFilter from "../Components/RouteFilter";
import Pagination from "../Components/Pagination";
import VehicleMap from "../Components/VehicleMap";
import type { Vehicle } from "../types/api.types";

export default function VehicleList() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedFilters, setSelectedFilters] = useState<{
    routes: string[];
    trips: string[];
  }>({ routes: [], trips: [] });

  const { vehicles, totalItems, loading, error } = useVehicles({
    limit: itemsPerPage,
    offset: (page - 1) * itemsPerPage,
    filters: selectedFilters,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {
    vehicle: selectedVehicle,
    loading: detailLoading,
    error: detailError,
  } = useVehicle(selectedId);

  const handleFiltersChange = (newFilters: typeof selectedFilters) => {
    setSelectedFilters(newFilters);
    setPage(1);
  };

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-base-content">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RouteFilter
              selectedRoutes={selectedFilters.routes}
              onChange={(routes) =>
                handleFiltersChange({ ...selectedFilters, routes })
              }
            />
            <TripFilter
              selectedTrips={selectedFilters.trips}
              onChange={(trips) =>
                handleFiltersChange({ ...selectedFilters, trips })
              }
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center p-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle: Vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => setSelectedId(vehicle.id)}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="card-body">
              <h3 className="card-title text-base-content">
                {vehicle.attributes.label}
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-base-content/70">Status:</span>
                  <span className="badge badge-primary">
                    {vehicle.attributes.current_status}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-base-content/70">Location:</span>
                  <span className="text-base-content">
                    {vehicle.attributes.latitude.toFixed(5)},
                    {vehicle.attributes.longitude.toFixed(5)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-base-content/70">Last Update:</span>
                  <span className="text-base-content">
                    {new Date(vehicle.attributes.updated_at).toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedId} onClose={() => setSelectedId(null)}>
        {detailLoading ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : detailError ? (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{detailError.message}</span>
          </div>
        ) : selectedVehicle ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-base-content">
              Vehicle {selectedVehicle.attributes.label}
            </h2>

            {/* Vehicle Map */}
            <div className="rounded-lg overflow-hidden border border-base-300 bg-base-200">
              <VehicleMap
                latitude={selectedVehicle.attributes.latitude}
                longitude={selectedVehicle.attributes.longitude}
                label={selectedVehicle.attributes.label}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h3 className="card-title text-base-content text-lg mb-2">
                    Vehicle Information
                  </h3>
                  <div className="space-y-2">
                    <p className="flex justify-between items-center">
                      <span className="text-base-content/70">Status:</span>
                      <span className="badge badge-primary">
                        {selectedVehicle.attributes.current_status}
                      </span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-base-content/70">Speed:</span>
                      <span className="text-base-content">
                        {selectedVehicle.attributes.speed || "N/A"} m/s
                      </span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-base-content/70">Bearing:</span>
                      <span className="text-base-content">
                        {selectedVehicle.attributes.bearing || "N/A"}°
                      </span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-base-content/70">
                        Stop Sequence:
                      </span>
                      <span className="text-base-content">
                        {selectedVehicle.attributes.current_stop_sequence ||
                          "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h3 className="card-title text-base-content text-lg mb-2">
                    Route Information
                  </h3>
                  <div className="space-y-2">
                    <p className="flex justify-between items-center">
                      <span className="text-base-content/70">Route:</span>
                      <span className="badge badge-secondary">
                        {selectedVehicle.relationships.route.data.id}
                      </span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-base-content/70">Trip:</span>
                      <span className="badge badge-secondary">
                        {selectedVehicle.relationships.trip.data.id}
                      </span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-base-content/70">
                        Last Updated:
                      </span>
                      <span className="text-base-content">
                        {new Date(
                          selectedVehicle.attributes.updated_at
                        ).toLocaleString("id-ID")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items);
          setPage(1);
        }}
      />
    </div>
  );
}
