// File: src/adapter/ui/pages/RoutesPage.tsx

import { useRoutes } from "../../../core/hooks/useRoutes";
import { RoutesTable } from "../components/RoutesTable";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

export function RoutesPage() {
  const { routes, isLoading, error, refetch } = useRoutes();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Routes</h2>
        <LoadingSpinner text="Loading routes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Routes</h2>
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Routes</h2>
        <button
          onClick={refetch}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <RoutesTable routes={routes} onBaselineSet={refetch} />
      </div>
    </div>
  );
}