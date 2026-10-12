# MSE Zone

MSE Zone is a full-stack e-commerce storefront for browsing clothing, cosmetics, kitchenware, toys, and lifestyle products. It includes a customer-facing store and an admin dashboard for managing products, orders, returns, and analytics.

## Features

- Product browsing, search, categories, and product details
- Customer accounts, Google sign-in, profiles, and order history
- Shopping cart and checkout with Cash on Delivery or WhatsApp ordering
- Product reviews, newsletter subscriptions, and return requests
- Admin tools for products, orders, returns, and analytics
- MongoDB data storage and Cloudinary image integration

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Image storage:** Cloudinary

## Requirements

- Node.js 20.19+ or 22.12+ (required by Vite 7)
- npm
- A MongoDB database
- Cloudinary credentials for image uploads

## Getting started

### 1. Install dependencies

From the project root, install each app's dependencies:

```bash
cd backend
npm install
cd ../frontend
npm install --legacy-peer-deps
```

The frontend install flag is needed because the currently declared `react-avatar-editor` version has a React peer range that does not include the app's React 19 version.

### 2. Configure environment variables

Create `backend/.env`:

```dotenv
PORT=4000
MONGO_KEY=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@example.com
FRONTEND_URL=http://localhost:5173

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_SEC_KEY=your_cloudinary_api_secret

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=your_email_address
SMTP_PASS=your_email_password
```

Create `frontend/.env`:

```dotenv
VITE_BACKEND_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_ADMIN_EMAIL=admin@example.com
```

Use credentials for your own services. Do not commit `.env` files or production secrets. The root `.gitignore` excludes them.

### 3. Start the apps

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The Vite development server runs at `http://localhost:5173`; the API runs at `http://localhost:4000`. The backend health endpoint is `http://localhost:4000/api/health`.

## Production build

Build the frontend:

```bash
cd frontend
npm run build
```

Vite writes the production files to `backend/dist`. The Express server serves that directory when it exists. Start the backend from `backend` with:

```bash
npm start
```

## Useful commands

| Directory | Command | Purpose |
| --- | --- | --- |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Build the production frontend into `backend/dist` |
| `frontend` | `npm run lint` | Run ESLint |
| `frontend` | `npm run preview` | Preview the production frontend build |
| `backend` | `npm run dev` | Start the API with nodemon |
| `backend` | `npm start` | Start the API with Node.js |
