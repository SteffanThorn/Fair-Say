# NZ Civics Express API

This is an Express REST API for the nz_civics MongoDB database, providing endpoints for MPs and Parties data.

## Setup

1. Ensure MongoDB is running and `MONGODB_URI` is set in `.env.local`.
2. Install dependencies: `npm install`
3. Run the API server: `npm run api`

The server runs on port 3001 by default.

## Endpoints

### MPs

- `GET /api/mps` - Get all MPs
  - Query params: `?party=National&spectrum=centre-right`
- `GET /api/mps/:id` - Get MP by MongoDB ID
- `GET /api/mps/search?name=` - Search MPs by name
- `POST /api/mps` - Add new MP (admin auth required)
- `PUT /api/mps/:id` - Update MP (admin auth required)

### Parties

- `GET /api/parties` - Get all parties
- `GET /api/parties/:name` - Get party by name
- `POST /api/parties` - Add new party (admin auth required)
- `PUT /api/parties/:name` - Update party (admin auth required)

## Authentication

Admin endpoints require basic auth with username `admin` and password `password`. Change this in the route files for production.

## Response Format

All responses are JSON in the format:
- Success: `{ success: true, data: {} }`
- Error: `{ success: false, error: "message" }`