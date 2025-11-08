import { Route } from "../../../core/domain/Route";
import { RouteRepository } from "../../../core/ports/RouteRepository";

// The mock data, right here in the file
const mockRoutes: Route[] = [
  {
    routeId: 'R001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500
  },
  {
    routeId: 'R002',
    vesselType: 'BulkCarrier',
    fuelType: 'LNG',
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200
  },
  {
    routeId: 'R003',
    vesselType: 'Tanker',
    fuelType: 'MGO',
    year: 2024,
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    distance: 12500,
    totalEmissions: 4700
  },
  {
    routeId: 'R004',
    vesselType: 'RoRo',
    fuelType: 'HFO',
    year: 2025,
    ghgIntensity: 89.2,
    fuelConsumption: 4900,
    distance: 11800,
    totalEmissions: 4300
  },
  {
    routeId: 'R005',
    vesselType: 'Container',
    fuelType: 'LNG',
    year: 2025,
    ghgIntensity: 90.5,
    fuelConsumption: 4950,
    distance: 11900,
    totalEmissions: 4400
  },
];


export class InMemoryRouteRepository implements RouteRepository {
  // Store the routes in a private variable
  private readonly routes: Map<string, Route> = new Map();

  constructor() {
    // Load the mock data into the map when the repository is created
    for (const route of mockRoutes) {
      this.routes.set(route.routeId, route);
    }
  }

  async getAll(): Promise<Route[]> {
    // Just return all the values from the map as an array
    const allRoutes = Array.from(this.routes.values());
    return Promise.resolve(allRoutes);
  }

  async getById(routeId: string): Promise<Route | null> {
    const route = this.routes.get(routeId);
    return Promise.resolve(route || null);
  }
}