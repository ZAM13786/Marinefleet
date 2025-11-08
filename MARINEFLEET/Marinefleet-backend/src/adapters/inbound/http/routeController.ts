// File: src/adapters/inbound/http/routeController.ts

import { Request, Response, Router } from "express";
import { RouteService } from "../../../core/application/RouteService";
import { asyncHandler } from "../../../infrastructure/middleware/asyncHandler";
import { ValidationError } from "../../../core/errors/AppError";

export const createRoutesRouter = (routeService: RouteService): Router => {
  const router = Router();

  /**
   * GET /routes
   * Returns all routes
   */
  router.get("/routes", asyncHandler(async (req: Request, res: Response) => {
    const routes = await routeService.findAllRoutes();
    res.json(routes);
  }));

  /**
   * POST /routes/:routeId/baseline
   * Sets a route as the baseline for comparison
   */
  router.post("/routes/:routeId/baseline", asyncHandler(async (req: Request, res: Response) => {
    const { routeId } = req.params;
    if (!routeId) {
      throw new ValidationError("Route ID is required");
    }
    await routeService.setBaseline(routeId);
    res.status(200).json({ message: `Baseline set for ${routeId}` });
  }));

  /**
   * GET /routes/comparison
   * Fetches baseline and comparison routes
   */
  router.get("/routes/comparison", asyncHandler(async (req: Request, res: Response) => {
    const data = await routeService.getComparisonData();
    res.json(data);
  }));

  return router;
};