// File: src/adapter/ui/components/RoutesTable.tsx

import { Route } from "../../../core/domain/Route";
import { useSetBaseline } from "../../../core/hooks/useRoutes";
import { useState } from "react";

interface Props {
  routes: Route[];
  onBaselineSet?: () => void;
}

export function RoutesTable({ routes, onBaselineSet }: Props) {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const { setBaseline, isLoading, error } = useSetBaseline(onBaselineSet);

  const handleSetBaseline = async (routeId: string) => {
    setSelectedRouteId(routeId);
    try {
      await setBaseline(routeId);
    } catch (err) {
      // Error is already handled in the hook
      console.error("Failed to set baseline:", err);
    } finally {
      setSelectedRouteId(null);
    }
  };
  if (error && selectedRouteId) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Route ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vessel Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fuel Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GHG Intensity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fuel (t)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Distance (km)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Emissions (t)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {routes.map((route) => (
            <tr key={route.routeId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {route.routeId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{route.vesselType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{route.fuelType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{route.year}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{route.ghgIntensity.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{route.fuelConsumption.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{route.distance.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{route.totalEmissions.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => handleSetBaseline(route.routeId)}
                  disabled={isLoading && selectedRouteId === route.routeId}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading && selectedRouteId === route.routeId ? "Setting..." : "Set Baseline"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}