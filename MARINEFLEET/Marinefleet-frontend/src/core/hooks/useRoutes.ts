// Custom hook for routes data fetching

import { useState, useEffect, useCallback } from 'react';
import { routesApi, ComparisonData } from '../services/routesApi';
import { Route } from '../domain/Route';
import { ApiError } from '../services/apiClient';

interface UseRoutesReturn {
  routes: Route[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRoutes = (): UseRoutesReturn => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await routesApi.getAll();
      setRoutes(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch routes';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return { routes, isLoading, error, refetch: fetchRoutes };
};

interface UseComparisonReturn {
  data: ComparisonData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useComparison = (): UseComparisonReturn => {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const comparisonData = await routesApi.getComparison();
      setData(comparisonData);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch comparison data';
      setError(message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  return { data, isLoading, error, refetch: fetchComparison };
};

interface UseSetBaselineReturn {
  setBaseline: (routeId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useSetBaseline = (onSuccess?: () => void): UseSetBaselineReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setBaseline = useCallback(async (routeId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await routesApi.setBaseline(routeId);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to set baseline';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess]);

  return { setBaseline, isLoading, error };
};


