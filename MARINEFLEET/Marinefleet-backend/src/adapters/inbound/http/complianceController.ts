// File: src/adapters/inbound/http/complianceController.ts

import { Request, Response, Router } from "express";
import { ComplianceService } from "../../../core/application/ComplianceService";
import { asyncHandler } from "../../../infrastructure/middleware/asyncHandler";
import { ValidationError } from "../../../core/errors/AppError";
import { VALID_YEAR_MIN, VALID_YEAR_MAX } from "../../../core/constants";

export const createComplianceRouter = (complianceService: ComplianceService): Router => {
  const router = Router();

  const getYear = (req: Request): number => {
    const yearParam = req.query.year as string;
    if (!yearParam) {
      throw new ValidationError("A 'year' query parameter is required.");
    }
    const year = parseInt(yearParam, 10);
    if (isNaN(year) || year < VALID_YEAR_MIN || year > VALID_YEAR_MAX) {
      throw new ValidationError(`Invalid year parameter. Year must be a valid number between ${VALID_YEAR_MIN} and ${VALID_YEAR_MAX}.`);
    }
    return year;
  };

  /**
   * GET /compliance/cb?year=YYYY
   * Returns the compliance balance for a given year
   */
  router.get("/compliance/cb", asyncHandler(async (req: Request, res: Response) => {
    const year = getYear(req);
    const data = await complianceService.getComplianceBalance(year);
    res.json(data);
  }));

  /**
   * POST /banking/bank?year=YYYY
   * Banks the surplus for a given year
   */
  router.post("/banking/bank", asyncHandler(async (req: Request, res: Response) => {
    const year = getYear(req);
    const data = await complianceService.bankSurplus(year);
    res.json(data);
  }));

  /**
   * POST /banking/apply?year=YYYY
   * Applies banked surplus to a given year's compliance balance
   */
  router.post("/banking/apply", asyncHandler(async (req: Request, res: Response) => {
    const year = getYear(req);
    const data = await complianceService.applyBankedSurplus(year);
    res.json(data);
  }));

  /**
   * GET /compliance/adjusted-cb?year=YYYY
   * Returns adjusted compliance balance for each route in a given year
   */
  router.get("/compliance/adjusted-cb", asyncHandler(async (req: Request, res: Response) => {
    const year = getYear(req);
    const data = await complianceService.getAdjustedCBs(year);
    res.json(data);
  }));

  /**
   * POST /pools
   * Creates a pool and calculates before/after CBs for pool members
   * Body: { routeIds: string[], year: number }
   */
  router.post("/pools", asyncHandler(async (req: Request, res: Response) => {
    const { routeIds, year } = req.body;
    
    if (!routeIds || !Array.isArray(routeIds)) {
      throw new ValidationError("routeIds must be an array");
    }
    
    if (!year || typeof year !== "number") {
      throw new ValidationError("year must be a number");
    }
    
    if (year < VALID_YEAR_MIN || year > VALID_YEAR_MAX) {
      throw new ValidationError(`year must be between ${VALID_YEAR_MIN} and ${VALID_YEAR_MAX}`);
    }
    
    const data = await complianceService.createPool(routeIds, year);
    res.json(data);
  }));

  return router;
};