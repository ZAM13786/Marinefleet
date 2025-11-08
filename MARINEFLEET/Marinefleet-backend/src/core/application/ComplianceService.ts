// File: src/core/application/ComplianceService.ts

import { Route } from "../domain/Route";
import { RouteRepository } from "../ports/RouteRepository";
import { TARGET_GHG } from "../constants";
import { NotFoundError, BusinessLogicError, ValidationError } from "../errors/AppError";

// ... (ComplianceData interface remains the same) ...

export class ComplianceService {
  private bankedSurplus: number = 0;
  constructor(private readonly routeRepository: RouteRepository) {}

  // --- NEW HELPER METHOD ---
  /**
   * Calculates the compliance balance for a single route.
   */
  private calculateRouteBalance(route: Route): number {
    const balance = (TARGET_GHG - route.ghgIntensity) * route.totalEmissions;
    return parseFloat(balance.toFixed(2));
  }

  /**
   * Calculates the raw compliance balance for a given year.
   */
  private async calculateRawBalance(year: number): Promise<number> {
    const routes = await this.routeRepository.getAll();
    const yearRoutes = routes.filter(r => r.year === year);
    if (yearRoutes.length === 0) {
      throw new NotFoundError(`No routes found for year ${year}`);
    }

    // Now uses the helper method
    const totalBalance = yearRoutes.reduce((sum, route) => {
      return sum + this.calculateRouteBalance(route);
    }, 0);

    return parseFloat(totalBalance.toFixed(2));
  }

  /**
   * Gets the compliance balance for a given year (raw balance + banked surplus).
   */
  public async getComplianceBalance(year: number): Promise<{ 
    year: number; 
    rawBalance: number; 
    bankedSurplus: number; 
    totalBalance: number 
  }> {
    const rawBalance = await this.calculateRawBalance(year);
    const totalBalance = rawBalance + this.bankedSurplus;
    
    return {
      year,
      rawBalance: parseFloat(rawBalance.toFixed(2)),
      bankedSurplus: parseFloat(this.bankedSurplus.toFixed(2)),
      totalBalance: parseFloat(totalBalance.toFixed(2))
    };
  }

  /**
   * Banks the surplus for a given year (if there is a surplus).
   */
  public async bankSurplus(year: number): Promise<{ 
    year: number; 
    surplus: number; 
    bankedSurplus: number 
  }> {
    const rawBalance = await this.calculateRawBalance(year);
    
    if (rawBalance <= 0) {
      throw new BusinessLogicError(`No surplus to bank for year ${year}. Current balance: ${rawBalance.toFixed(2)}`);
    }
    
    this.bankedSurplus += rawBalance;
    
    return {
      year,
      surplus: parseFloat(rawBalance.toFixed(2)),
      bankedSurplus: parseFloat(this.bankedSurplus.toFixed(2))
    };
  }

  /**
   * Applies the banked surplus to a given year's compliance balance.
   */
  public async applyBankedSurplus(year: number): Promise<{ 
    year: number; 
    rawBalance: number; 
    bankedSurplusApplied: number; 
    remainingBankedSurplus: number; 
    totalBalance: number 
  }> {
    const rawBalance = await this.calculateRawBalance(year);
    
    if (this.bankedSurplus <= 0) {
      throw new BusinessLogicError(`No banked surplus available to apply.`);
    }
    
    // Only apply if there's a deficit (negative rawBalance)
    if (rawBalance >= 0) {
      throw new BusinessLogicError(`No deficit to apply banked surplus to for year ${year}. Current balance is ${rawBalance.toFixed(2)}.`);
    }
    
    const deficit = Math.abs(rawBalance);
    const appliedAmount = Math.min(this.bankedSurplus, deficit);
    this.bankedSurplus -= appliedAmount;
    const totalBalance = rawBalance + appliedAmount;
    
    return {
      year,
      rawBalance: parseFloat(rawBalance.toFixed(2)),
      bankedSurplusApplied: parseFloat(appliedAmount.toFixed(2)),
      remainingBankedSurplus: parseFloat(this.bankedSurplus.toFixed(2)),
      totalBalance: parseFloat(totalBalance.toFixed(2))
    };
  }

  // --- NEW METHOD for GET /compliance/adjusted-cb ---
  /**
   * Fetches the adjusted CB for each ship/route for a given year.
   */
  public async getAdjustedCBs(year: number): Promise<{ routeId: string; vesselType: string; adjustedCB: number }[]> {
    const routes = await this.routeRepository.getAll();
    const yearRoutes = routes.filter(r => r.year === year);

    if (yearRoutes.length === 0) {
      throw new NotFoundError(`No routes found for year ${year}`);
    }

    return yearRoutes.map(route => ({
      routeId: route.routeId,
      vesselType: route.vesselType,
      adjustedCB: this.calculateRouteBalance(route)
    }));
  }

  // --- NEW METHOD for POST /pools ---
  /**
   * Creates a pool and calculates the before/after CBs for its members.
   */
  public async createPool(routeIds: string[], year: number): Promise<{ members: { routeId: string, cb_before: number, cb_after: number }[] }> {
    if (routeIds.length < 2) {
      throw new ValidationError("A pool requires at least two members.");
    }
    
    // 1. Fetch all routes for the year to find our pool members
    const allRoutes = await this.routeRepository.getAll();
    const yearRoutes = allRoutes.filter(r => r.year === year);

    const poolMembers: Route[] = [];
    for (const id of routeIds) {
      const member = yearRoutes.find(r => r.routeId === id);
      if (member) {
        poolMembers.push(member);
      }
    }

    if (poolMembers.length !== routeIds.length) {
      throw new NotFoundError("One or more routeIds not found for the specified year.");
    }

    // 2. Calculate "before" CBs and the total
    const membersWithBeforeCB = poolMembers.map(member => ({
      route: member,
      cb_before: this.calculateRouteBalance(member)
    }));

    const totalPoolBalance = membersWithBeforeCB.reduce((sum, m) => sum + m.cb_before, 0);

    // 3. Check Rule 1: Sum(adjustedCB) >= 0
    if (totalPoolBalance < 0) {
      throw new BusinessLogicError(`Pool is not compliant. Total balance is ${totalPoolBalance.toFixed(2)} (must be >= 0).`);
    }

    // 4. Calculate "after" CB (average balance)
    const averagePoolBalance = totalPoolBalance / poolMembers.length;

    // 5. Format results
    // The rules (2 & 3) are automatically satisfied by averaging a non-negative sum:
    // - Deficit ship (negative) MUST improve (move towards positive average).
    // - Surplus ship (positive) MUST end >= 0 (because the average is >= 0).
    const members = membersWithBeforeCB.map(m => ({
      routeId: m.route.routeId,
      cb_before: m.cb_before,
      cb_after: parseFloat(averagePoolBalance.toFixed(2))
    }));
    
    return { members };
  }
}