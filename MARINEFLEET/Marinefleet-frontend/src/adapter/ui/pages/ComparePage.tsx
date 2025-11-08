// File: src/adapter/ui/pages/ComparePage.tsx

import { useComparison } from "../../../core/hooks/useRoutes";
import { CompareTable } from "../components/CompareTable";
import { CompareChart } from "../components/CompareChart";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

export function ComparePage() {
  const { data, isLoading, error, refetch } = useComparison();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Compare Routes</h2>
        <LoadingSpinner text="Loading comparison data..." />
      </div>
    );
  }

  if (error) {
    const isBaselineError = error.includes("Baseline not set");
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Compare Routes</h2>
        <ErrorMessage
          message={error}
          onRetry={refetch}
          variant={isBaselineError ? "warning" : "error"}
        />
        {isBaselineError && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              Please go to the <strong>Routes</strong> tab and set a baseline for a route to view comparisons.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Compare Routes</h2>
        <div className="p-4 text-center text-gray-500">No comparison data available.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Compare Routes</h2>
        <button
          onClick={refetch}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>
      
      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <CompareChart baseline={data.baseline} comparisons={data.comparisons} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <CompareTable baseline={data.baseline} comparisons={data.comparisons} />
      </div>
    </div>
  );
}