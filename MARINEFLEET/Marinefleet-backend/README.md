# Marine Fleet Management Backend

Backend API for Marine Fleet Management System.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Build

Build for production:

```bash
npm run build
```

## Production

Run the production server:

```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes/:routeId/baseline` - Set baseline route
- `GET /api/routes/comparison` - Get comparison data

### Compliance
- `GET /api/compliance/cb?year=YYYY` - Get compliance balance
- `POST /api/banking/bank?year=YYYY` - Bank surplus
- `POST /api/banking/apply?year=YYYY` - Apply banked surplus
- `GET /api/compliance/adjusted-cb?year=YYYY` - Get adjusted CBs
- `POST /api/pools` - Create pool

## Environment Variables

- `PORT` - Server port (default: 3001)

