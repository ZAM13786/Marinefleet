// Routes API Service

import { apiClient } from './apiClient';
import { Route } from '../domain/Route';

export interface ComparisonData {
  baseline: Route;
  comparisons: Route[];
}

export const routesApi = {
  getAll: (): Promise<Route[]> => {
    return apiClient.get<Route[]>('/routes');
  },

  setBaseline: (routeId: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(`/routes/${routeId}/baseline`);
  },

  getComparison: (): Promise<ComparisonData> => {
    return apiClient.get<ComparisonData>('/routes/comparison');
  },
};


