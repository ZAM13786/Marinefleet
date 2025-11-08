// Custom hook for compliance data fetching

import { useState, useEffect, useCallback } from 'react';
import { complianceApi, ComplianceBalance, BankingResult, ApplySurplusResult, AdjustedCBRoute, PoolResult } from '../services/complianceApi';
import { ApiError } from '../services/apiClient';

interface UseComplianceBalanceReturn {
  data: ComplianceBalance | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useComplianceBalance = (year: number): UseComplianceBalanceReturn => {
  const [data, setData] = useState<ComplianceBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const balance = await complianceApi.getComplianceBalance(year);
      setData(balance);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch compliance balance';
      setError(message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { data, isLoading, error, refetch: fetchBalance };
};

interface UseBankingReturn {
  bankSurplus: () => Promise<BankingResult | null>;
  applySurplus: () => Promise<ApplySurplusResult | null>;
  bankingResult: BankingResult | null;
  applyResult: ApplySurplusResult | null;
  isLoading: boolean;
  error: string | null;
}

export const useBanking = (year: number, onSuccess?: () => void): UseBankingReturn => {
  const [bankingResult, setBankingResult] = useState<BankingResult | null>(null);
  const [applyResult, setApplyResult] = useState<ApplySurplusResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bankSurplus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setBankingResult(null);
    setApplyResult(null);
    try {
      const result = await complianceApi.bankSurplus(year);
      setBankingResult(result);
      onSuccess?.();
      return result;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to bank surplus';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [year, onSuccess]);

  const applySurplus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setBankingResult(null);
    setApplyResult(null);
    try {
      const result = await complianceApi.applyBankedSurplus(year);
      setApplyResult(result);
      onSuccess?.();
      return result;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to apply surplus';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [year, onSuccess]);

  return { bankSurplus, applySurplus, bankingResult, applyResult, isLoading, error };
};

interface UseAdjustedCBsReturn {
  routes: AdjustedCBRoute[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAdjustedCBs = (year: number): UseAdjustedCBsReturn => {
  const [routes, setRoutes] = useState<AdjustedCBRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCBs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await complianceApi.getAdjustedCBs(year);
      setRoutes(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch adjusted CBs';
      setError(message);
      setRoutes([]);
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  return { routes, isLoading, error, refetch: fetchCBs };
};

interface UsePoolingReturn {
  createPool: (routeIds: string[]) => Promise<PoolResult | null>;
  poolResult: PoolResult | null;
  isLoading: boolean;
  error: string | null;
}

export const usePooling = (year: number): UsePoolingReturn => {
  const [poolResult, setPoolResult] = useState<PoolResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPool = useCallback(async (routeIds: string[]) => {
    setIsLoading(true);
    setError(null);
    setPoolResult(null);
    try {
      const result = await complianceApi.createPool(routeIds, year);
      setPoolResult(result);
      return result;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to create pool';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  return { createPool, poolResult, isLoading, error };
};


