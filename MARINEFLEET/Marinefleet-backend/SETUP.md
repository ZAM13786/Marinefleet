# Backend Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Verify Server is Running**
   - Open browser: `http://localhost:3001/health`
   - You should see: `{"status":"ok","timestamp":"...","service":"marinefleet-backend"}`

## Troubleshooting

### Port Already in Use
If you see "Port 3001 is already in use":
- Change the port: `PORT=3002 npm run dev`
- Or kill the process using port 3001

### TypeScript Errors
If you see TypeScript compilation errors:
```bash
npm install --save-dev typescript ts-node @types/node @types/express @types/cors
```

### Module Not Found Errors
Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Common Issues Fixed

1. ✅ Express version downgraded from 5.1.0 to 4.18.2 (stable)
2. ✅ TypeScript config updated for CommonJS (Node.js compatible)
3. ✅ Module resolution set to "node" (modern)
4. ✅ Type definitions properly configured
5. ✅ Error handling improved
6. ✅ Server startup error handling added

## API Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:3001/health

# Get all routes
curl http://localhost:3001/api/routes

# Get compliance balance
curl http://localhost:3001/api/compliance/cb?year=2024
```

