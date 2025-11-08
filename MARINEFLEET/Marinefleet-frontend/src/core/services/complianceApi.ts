// Compliance API Service

export interface ComplianceBalance {
  year: number;
  rawBalance: number;
  bankedSurplus: number;
  totalBalance: number;
}

export interface BankingResult {
  year: number;
  surplus: number;
  bankedSurplus: number;
}

export interface ApplySurplusResult {
  year: number;
  rawBalance: number;
  bankedSurplusApplied: number;
  remainingBankedSurplus: number;
  totalBalance: number;
}

export interface AdjustedCBRoute {
  routeId: string;
  vesselType: string;
  adjustedCB: number;
}

export interface PoolMember {
  routeId: string;
  cb_before: number;
  cb_after: number;
}

export interface PoolResult {
  members: PoolMember[];
}

import { apiClient } from './apiClient';

export const complianceApi = {
  getComplianceBalance: (year: number): Promise<ComplianceBalance> => {
    return apiClient.get<ComplianceBalance>(`/compliance/cb?year=${year}`);
  },

  bankSurplus: (year: number): Promise<BankingResult> => {
    return apiClient.post<BankingResult>(`/banking/bank?year=${year}`);
  },

  applyBankedSurplus: (year: number): Promise<ApplySurplusResult> => {
    return apiClient.post<ApplySurplusResult>(`/banking/apply?year=${year}`);
  },

  getAdjustedCBs: (year: number): Promise<AdjustedCBRoute[]> => {
    return apiClient.get<AdjustedCBRoute[]>(`/compliance/adjusted-cb?year=${year}`);
  },

  createPool: (routeIds: string[], year: number): Promise<PoolResult> => {
    return apiClient.post<PoolResult>('/pools', { routeIds, year });
  },
};


