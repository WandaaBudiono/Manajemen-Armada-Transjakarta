import React, { useState, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchRoutes } from "../services/route.service";
import type { Route } from "../types/api.types";

interface RouteFilterProps {
  selectedRoutes: string[];
  onChange: (routes: string[]) => void;
}

const RouteFilter: React.FC<RouteFilterProps> = ({
  selectedRoutes,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetching, error } =
    useInfiniteQuery({
      queryKey: ["routes", search],
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        fetchRoutes({
          offset: pageParam,
          limit: 20,
          filter: search,
        }),
      getNextPageParam: (lastPage, allPages) => {
        const loadedCount = allPages.flatMap((p) => p.data).length;
        return loadedCount < (lastPage.meta?.total || 0)
          ? loadedCount
          : undefined;
      },
    });

  const lastRouteRef = useCallback(
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

  const routes = React.useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data?.pages]
  );

  const toggleRoute = (routeId: string) => {
    const newSelection = selectedRoutes.includes(routeId)
      ? selectedRoutes.filter((id) => id !== routeId)
      : [...selectedRoutes, routeId];
    onChange(newSelection);
  };

  return (
    <div className="bg-base-100 rounded-lg">
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-bold text-base-content">
          Filter by Routes
        </h3>

        {/* Search Input */}
        <div className="form-control">
          <div className="join w-full">
            <input
              type="text"
              className="input input-bordered join-item w-full"
              placeholder="Search routes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary join-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Routes List */}
        <div className="bg-base-200 rounded-lg max-h-48 overflow-y-auto">
          {error ? (
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
                    : "Error loading routes"}
                </span>
              </div>
            </div>
          ) : routes.length === 0 && isFetching ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : routes.length === 0 ? (
            <div className="text-center p-4 text-base-content/70">
              No routes found
            </div>
          ) : (
            <div className="p-2">
              {routes.map((route: Route, index: number) => (
                <div
                  key={route.id}
                  ref={index === routes.length - 1 ? lastRouteRef : undefined}
                  className="form-control"
                >
                  <label className="flex items-center gap-2 p-2 cursor-pointer hover:bg-base-300 rounded-lg">
                    <div className="flex-1 text-base-content">
                      {route.attributes.long_name}
                    </div>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={selectedRoutes.includes(route.id)}
                      onChange={() => toggleRoute(route.id)}
                    />
                  </label>
                </div>
              ))}
              {isFetching && (
                <div className="flex justify-center p-4">
                  <span className="loading loading-spinner loading-md text-primary"></span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteFilter;
