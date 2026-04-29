# AuthFlow E-Commerce RBAC

AuthFlow is a full-stack authentication and e-commerce demo with role-based access control. It includes user registration/login, admin management, product management, dynamic cart behavior, and Stripe Checkout session creation.

## Features

- JWT-based authentication
- Role-based access control for `MAIN_ADMIN`, `ADMIN`, and `USER`
- Main Admin dashboard with platform stats and recent activity
- Main Admin user/admin management
- Admin dashboard and product management
- Public storefront with dynamic product loading
- User-only cart and checkout flow
- Stripe Checkout session integration
- MongoDB persistence with Mongoose
- Angular frontend with Bootstrap styling

## Tech Stack

- Frontend: Angular 21, Bootstrap, RxJS
- Backend: Node.js, Express, TypeScript, Mongoose
- Database: MongoDB
- Payments: Stripe Checkout API

## Project Structure

```text
backend/
  src/
    controllers/
    middleware/
    models/
    routes/
    seeds/
frontend/
  src/app/
    core/
    features/
    layouts/
```

## Environment Variables

Create a local backend environment file from the example:

```bash
cp backend/.env.example backend/.env
```

Then set your own private values:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_strong_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
MAIN_ADMIN_EMAIL=main_admin@example.com
MAIN_ADMIN_PASSWORD=replace_with_a_strong_password
```

Do not commit `backend/.env`. It is ignored by Git.

The frontend API base URL is centralized in:

```text
frontend/src/app/core/config/api.config.ts
```

Default value:

```ts
export const API_BASE_URL = 'http://127.0.0.1:5001/api';
```

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Running Locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run start -- --host 127.0.0.1 --port 4200 --allowed-hosts
```

Open:

```text
http://127.0.0.1:4200
```

## Seeding Products

After creating a `MAIN_ADMIN` or `ADMIN`, seed starter products:

```bash
cd backend
npm run seed:products
```

To create the first main admin account, set `MAIN_ADMIN_EMAIL` and `MAIN_ADMIN_PASSWORD` in `backend/.env`, then run the main admin seed script manually:

```bash
cd backend
npm run seed:main-admin
```

## Roles

- `MAIN_ADMIN`: platform dashboard, users, admins, product management, settings
- `ADMIN`: admin dashboard, product management, activity
- `USER`: product browsing, cart, checkout, user dashboard, profile, activity

Only `MAIN_ADMIN` and `ADMIN` users can create and manage products.

Only `USER` accounts can complete purchases. Admin roles are blocked from checkout in both the frontend and backend.

## API Overview

Base URL:

```text
http://127.0.0.1:5001/api
```

Main route groups:

- `/auth`
- `/admin`
- `/activity`
- `/dashboard`
- `/products`
- `/orders`

## Security Notes

- Never commit `.env` files or real credentials.
- Use a strong `JWT_SECRET`.
- Use Stripe test keys only for local development, and keep them in your local `.env` file.
- Rotate any credential that was accidentally committed or shared.
- Review CORS and environment-specific URLs before sharing the app outside local development.

## Validation

Useful checks:

```bash
cd backend
npx tsc --noEmit
```

```bash
cd frontend
npm run build
```
