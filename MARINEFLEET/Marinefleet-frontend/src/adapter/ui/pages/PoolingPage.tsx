// File: src/adapter/ui/pages/PoolingPage.tsx

import { useState } from "react";
import { useAdjustedCBs, usePooling } from "../../../core/hooks/useCompliance";
import { SUPPORTED_YEARS } from "../../../core/constants";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

export function PoolingPage() {
  const [year, setYear] = useState<number>(2024);
  const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set());
  
  const { routes, isLoading: isLoadingRoutes, error: routesError, refetch: refetchRoutes } = useAdjustedCBs(year);
  const { createPool, poolResult, isLoading: isLoadingPool, error: poolError } = usePooling(year);

  const error = routesError || poolError;
  const isLoading = isLoadingRoutes || isLoadingPool;

  const handleSelectRoute = (routeId: string) => {
    const newSelection = new Set(selectedRoutes);
    if (newSelection.has(routeId)) {
      newSelection.delete(routeId);
    } else {
      newSelection.add(routeId);
    }
    setSelectedRoutes(newSelection);
  };

  const handleCreatePool = async () => {
    if (selectedRoutes.size >= 2) {
      await createPool(Array.from(selectedRoutes));
    }
  };

  const renderCB = (cb: number) => (
    <span className={cb >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
      {cb.toFixed(2)}
    </span>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Route Pooling</h2>

      {/* Year Selector */}
      <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <label htmlFor="year" className="font-medium text-gray-700">Select Year:</label>
        <select
          id="year"
          value={year}
          onChange={(e) => {
            setYear(Number(e.target.value));
            setSelectedRoutes(new Set());
          }}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {SUPPORTED_YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button
          onClick={refetchRoutes}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? "Loading..." : "Fetch Routes"}
        </button>
      </div>

      {/* Error Display */}
      {error && <ErrorMessage message={error} onRetry={refetchRoutes} />}

      {/* Loading State */}
      {isLoadingRoutes && <LoadingSpinner text="Loading routes..." />}

      {/* Route Selection & Pool Creation */}
      {routes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Route List */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Select routes to pool:</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {routes.map((route) => (
                <label
                  key={route.routeId}
                  className="flex items-center gap-4 p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoutes.has(route.routeId)}
                    onChange={() => handleSelectRoute(route.routeId)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900 w-16">{route.routeId}</span>
                  <span className="text-sm text-gray-600 w-24">{route.vesselType}</span>
                  <span className="text-sm font-mono ml-auto">{renderCB(route.adjustedCB)}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleCreatePool}
              disabled={isLoading || selectedRoutes.size < 2}
              className="mt-4 w-full rounded-md bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingPool ? "Pooling..." : `Create Pool (${selectedRoutes.size} members)`}
            </button>
            {selectedRoutes.size < 2 && (
              <p className="text-xs text-gray-500 mt-2">Select at least 2 routes to create a pool.</p>
            )}
          </div>

          {/* Pool Results */}
          {poolResult && (
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Pool Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CB Before
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CB After
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {poolResult.members.map((member) => (
                      <tr key={member.routeId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.routeId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                          {renderCB(member.cb_before)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                          {renderCB(member.cb_after)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
