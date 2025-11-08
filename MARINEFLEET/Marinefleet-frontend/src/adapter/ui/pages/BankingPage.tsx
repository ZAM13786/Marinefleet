// File: src/adapter/ui/pages/BankingPage.tsx

import { useState } from "react";
import { useComplianceBalance, useBanking } from "../../../core/hooks/useCompliance";
import { SUPPORTED_YEARS } from "../../../core/constants";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

function KpiCard({ title, value, isTotal = false }: { title: string; value: number; isTotal?: boolean }) {
  const isPositive = value > 0;
  const isZero = value === 0;
  const colorClass = isTotal
    ? 'text-blue-600'
    : isZero
      ? 'text-gray-900'
      : isPositive
        ? 'text-green-600'
        : 'text-red-600';

  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md border border-gray-200">
      <span className="font-medium text-gray-700">{title}</span>
      <span className={`text-xl font-bold ${colorClass}`}>
        {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
    </div>
  );
}

export function BankingPage() {
  const [year, setYear] = useState<number>(2024);
  const { data, isLoading: isLoadingBalance, error: balanceError, refetch } = useComplianceBalance(year);
  const { bankSurplus, applySurplus, bankingResult, applyResult, isLoading: isLoadingAction, error: actionError } = useBanking(year, refetch);

  const error = balanceError || actionError;
  const isLoading = isLoadingBalance || isLoadingAction;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Compliance Banking</h2>

      {/* Year Selector */}
      <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <label htmlFor="year" className="font-medium text-gray-700">Select Year:</label>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {SUPPORTED_YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Error Display */}
      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {/* Loading State */}
      {isLoadingBalance && <LoadingSpinner text="Loading compliance balance..." />}

      {/* Main Content */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KPIs */}
          <div className="space-y-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Balance for {data.year}</h3>
            <KpiCard title="Raw Balance" value={data.rawBalance} />
            <KpiCard title="Banked Surplus" value={data.bankedSurplus} />
            <hr className="border-gray-200" />
            <KpiCard title="Total Balance" value={data.totalBalance} isTotal />
            
            {bankingResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm font-semibold text-green-800 mb-2">✓ Banking Successful!</p>
                <p className="text-xs text-green-700">Surplus: {bankingResult.surplus.toFixed(2)}</p>
                <p className="text-xs text-green-700">Total Banked: {bankingResult.bankedSurplus.toFixed(2)}</p>
              </div>
            )}
            
            {applyResult && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm font-semibold text-yellow-800 mb-2">✓ Applied Successfully!</p>
                <p className="text-xs text-yellow-700">Applied: {applyResult.bankedSurplusApplied.toFixed(2)}</p>
                <p className="text-xs text-yellow-700">Remaining: {applyResult.remainingBankedSurplus.toFixed(2)}</p>
                <p className="text-xs text-yellow-700">New Total: {applyResult.totalBalance.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
            <p className="text-sm text-gray-600">
              Actions are based on the Raw Balance value.
            </p>
            
            <button
              onClick={bankSurplus}
              disabled={isLoading || !data || data.rawBalance <= 0}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingAction ? "Processing..." : "Bank Positive CB"}
            </button>
            <p className="text-xs text-gray-500">
              Only enabled if "Raw Balance" is positive (&gt; 0).
            </p>

            <button
              onClick={applySurplus}
              disabled={isLoading || !data || data.rawBalance >= 0 || data.bankedSurplus <= 0}
              className="w-full rounded-md bg-yellow-600 px-4 py-2 text-white font-medium hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingAction ? "Processing..." : "Apply Banked Surplus to Deficit"}
            </button>
            <p className="text-xs text-gray-500">
              Only enabled if "Raw Balance" is negative (&lt; 0) and "Banked Surplus" is positive (&gt; 0).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
