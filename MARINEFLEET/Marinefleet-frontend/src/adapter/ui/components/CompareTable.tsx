// File: src/adapter/ui/components/CompareTable.tsx

import { Route } from "../../../core/domain/Route";
import { TARGET_GHG } from "../../../core/constants";

// Helper to format percentage
const formatPercent = (val: number) => {
  const percent = val * 100;
  return `${percent.toFixed(2)}%`;
};

// Helper for compliance check
const isCompliant = (ghgIntensity: number) => {
  return ghgIntensity <= TARGET_GHG;
};

interface Props {
  baseline: Route;
  comparisons: Route[];
}

export function CompareTable({ baseline, comparisons }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Route ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GHG Intensity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              % Difference (from baseline)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Compliant (≤ {TARGET_GHG})
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Baseline Row */}
          <tr className="bg-blue-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">
              {baseline.routeId} <span className="text-blue-500">(Baseline)</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">
              {baseline.ghgIntensity.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">-</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isCompliant(baseline.ghgIntensity)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {isCompliant(baseline.ghgIntensity) ? "✓ Compliant" : "✗ Non-compliant"}
              </span>
            </td>
          </tr>
          
          {/* Comparison Rows */}
          {comparisons.map((route) => {
            const percentDiff = (route.ghgIntensity / baseline.ghgIntensity) - 1;
            const compliant = isCompliant(route.ghgIntensity);
            
            return (
              <tr key={route.routeId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {route.routeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {route.ghgIntensity.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  percentDiff > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatPercent(percentDiff)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    compliant
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {compliant ? "✓ Compliant" : "✗ Non-compliant"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}