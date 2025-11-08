// File: src/core/ports/RouteRepository.ts

import { Route } from "../domain/Route";

export interface RouteRepository {
  /**
   * Fetches all routes from the repository.
   */
  getAll(): Promise<Route[]>;

  /**
   * Fetches a single route by its ID.
   */
  getById(routeId: string): Promise<Route | null>;
}