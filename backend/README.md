# TourEdo Backend

Express API for the TourEdo tourism platform.

## Run locally

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

The integrated app runs at `http://localhost:5000` by default. The backend serves the moved `frontend/` folder and shared root `assets/` folder, so the homepage is available at `http://localhost:5000/`. It starts with an in-memory development store, so MongoDB is optional for the first frontend integration pass.

If a `.env` file assigns another port, either use that port or override it in PowerShell:

```powershell
$env:PORT="5000"
npm start
```

To use MongoDB, set `MONGODB_URI` in `.env`. Persistence models can be introduced without changing the HTTP contracts.

## Main endpoints

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET /api/auth/me`
- `GET /api/attractions`
- `GET /api/attractions/:id`
- `GET /api/hotels`
- `GET /api/hotels/:id`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/bookings`
- `GET /api/bookings`
- `PATCH /api/bookings/:id/cancel`
- `POST /api/reviews`
- `GET /api/reviews?attractionId=okomu`
- `POST /api/recommendations`
- `GET /api/admin/attractions`

Protected endpoints expect:

```text
Authorization: Bearer <jwt>
```

The current data store is intentionally in memory for local UI development. Restarting the server resets newly created users, bookings, and reviews.
