// File: src/infrastructure/server.ts

import express from "express";
import cors from "cors";
import { InMemoryRouteRepository } from "../adapters/outbound/memory/InMemoryRouteRepository";
import { RouteService } from "../core/application/RouteService";
import { createRoutesRouter } from "../adapters/inbound/http/routeController";
import { ComplianceService } from "../core/application/ComplianceService";
import { createComplianceRouter } from "../adapters/inbound/http/complianceController";
import { errorHandler } from "./middleware/errorHandler";

// Create Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "marinefleet-backend"
  });
});

// Dependency Injection - Create repositories (outbound adapters)
const routeRepository = new InMemoryRouteRepository();

// Create application services (core)
const routeService = new RouteService(routeRepository);
const complianceService = new ComplianceService(routeRepository);

// Create HTTP routers (inbound adapters)
const routesRouter = createRoutesRouter(routeService);
const complianceRouter = createComplianceRouter(complianceService);

// Register routes
app.use("/api", routesRouter);
app.use("/api", complianceRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 API endpoints: http://localhost:${PORT}/api`);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});