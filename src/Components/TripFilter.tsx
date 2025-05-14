import React, { useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTrips } from "../services/trip.service";
import type { Trip } from "../types/api.types";

interface TripFilterProps {
  selectedTrips: string[];
  onChange: (trips: string[]) => void;
}

const TripFilter: React.FC<TripFilterProps> = ({ selectedTrips, onChange }) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetching, error, isError } =
    useInfiniteQuery({
      queryKey: ["trips"],
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        fetchTrips({
          offset: pageParam,
          limit: 20,
        }),
      getNextPageParam: (lastPage, allPages) => {
        const loadedCount = allPages.flatMap((p) => p.data).length;
        return loadedCount < (lastPage.meta?.total || 0)
          ? loadedCount
          : undefined;
      },
    });

  const lastTripRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetching, hasNextPage, fetchNextPage]
  );

  const trips = React.useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data?.pages]
  );

  const toggleTrip = (tripId: string) => {
    const newSelection = selectedTrips.includes(tripId)
      ? selectedTrips.filter((id) => id !== tripId)
      : [...selectedTrips, tripId];
    onChange(newSelection);
  };

  return (
    <div className="bg-base-100 rounded-lg">
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-bold text-base-content">Filter by Trips</h3>

        <div className="bg-base-200 rounded-lg max-h-48 overflow-y-auto">
          {isError ? (
            <div className="p-4">
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
                <span>
                  {error instanceof Error
                    ? error.message
                    : "Error loading trips"}
                </span>
              </div>
            </div>
          ) : trips.length === 0 && isFetching ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center p-4 text-base-content/70">
              No trips found. Select a route first to see its trips.
            </div>
          ) : (
            trips.map((trip: Trip, index: number) => (
              <div
                key={trip.id}
                ref={index === trips.length - 1 ? lastTripRef : undefined}
                className="form-control"
              >
                <label className="flex items-center gap-2 p-2 cursor-pointer hover:bg-base-300 rounded-lg">
                  <div className="flex-1">
                    <div className="text-base-content">
                      {trip.attributes.headsign || trip.id}
                    </div>
                    {trip.relationships?.route?.data?.id && (
                      <div className="text-base-content/70 text-sm">
                        Route: {trip.relationships.route.data.id}
                      </div>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedTrips.includes(trip.id)}
                    onChange={() => toggleTrip(trip.id)}
                  />
                </label>
              </div>
            ))
          )}
          {isFetching && (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripFilter;
