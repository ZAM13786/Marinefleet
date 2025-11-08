// File: src/core/application/RouteService.ts

import { Route } from "../domain/Route";
import { RouteRepository } from "../ports/RouteRepository";
import { NotFoundError, BusinessLogicError } from "../errors/AppError";

export class RouteService {
  // Use a simple in-memory variable to store the baseline ID
  private baselineRouteId: string | null = null; 

  constructor(private readonly routeRepository: RouteRepository) {}

  public async findAllRoutes(): Promise<Route[]> {
    return this.routeRepository.getAll();
  }

  // --- NEW METHOD ---
  public async setBaseline(routeId: string): Promise<void> {
    const route = await this.routeRepository.getById(routeId);
    if (!route) {
      throw new NotFoundError(`Route with ID ${routeId} not found`);
    }
    this.baselineRouteId = route.routeId;
  }

  // --- NEW METHOD ---
  public async getComparisonData(): Promise<{ baseline: Route; comparisons: Route[] }> {
    if (!this.baselineRouteId) {
      throw new BusinessLogicError("Baseline not set. Please set a baseline first.");
    }

    const baseline = await this.routeRepository.getById(this.baselineRouteId);
    if (!baseline) {
      throw new NotFoundError("Baseline route not found in database.");
    }

    const allRoutes = await this.routeRepository.getAll();
    
    // All routes that are NOT the baseline route
    const comparisons = allRoutes.filter(
      (route) => route.routeId !== this.baselineRouteId
    );

    return { baseline, comparisons };
  }
}