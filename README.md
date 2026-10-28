# ShopEase — Online Shopping Platform

A full-featured e-commerce web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js).

![ShopEase](https://img.shields.io/badge/ShopEase-v1.0-indigo) ![MERN](https://img.shields.io/badge/Stack-MERN-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## Features

### Customer Features
- 🛍️ Browse, search, filter, and sort products
- 👤 User registration & login with JWT authentication
- 🛒 Shopping cart with stock validation
- 📦 Checkout with Cash on Delivery
- 📋 Order history & tracking

### Admin Features
- 📊 Dashboard with analytics (revenue, orders, customers)
- 📦 Product management (CRUD + image upload)
- 🔄 Order management with status workflow
- 🔒 Role-based access control

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| HTTP Client | Axios |
| Notifications | React Hot Toast |

## Prerequisites

- **Node.js** v18+ 
- **MongoDB** running locally or a MongoDB Atlas connection string
- **npm** v9+

## Quick Start

### 1. Clone & Setup

```bash
cd ShopEase
```

### 2. Configure Environment

```bash
# Copy the example env file
cp server/.env.example server/.env
```

Edit `server/.env` with your settings:
```env
MONGO_URI=mongodb://localhost:27017/shopease
JWT_SECRET=your_super_secret_key_change_this
PORT=5000
NODE_ENV=development
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- **Admin account:** `admin@shopease.com` / `admin123`
- **Customer account:** `john@example.com` / `password123`
- **16 sample products** across 5 categories

### 5. Start the Application

You can start both frontend and backend together with a **single command** from the root folder:

```bash
# From the project root (D:\ShopEase)
npm run dev
```

Or run them in **two separate terminals**:

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 3000)
cd client
npm run dev
```

Visit: **http://localhost:3000**

## Project Structure

```
ShopEase/
├── server/                    # Express.js Backend API
│   ├── config/                # Database configuration
│   ├── controllers/           # Route handlers & business logic
│   ├── middleware/             # Auth, error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API route definitions
│   ├── utils/                 # Helpers (order ref, status transitions)
│   ├── uploads/               # Product image storage
│   ├── seed.js                # Database seeder
│   └── server.js              # App entry point
│
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth & Cart state management
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client
│   │   └── App.jsx            # Main app with routing
│   └── index.html
│
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new customer | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products (search, filter, sort) | No |
| GET | `/api/products/categories` | Get all categories | No |
| GET | `/api/products/:id` | Get product details | No |

### Cart
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/cart` | Get user's cart | Yes |
| POST | `/api/cart` | Add item to cart | Yes |
| PUT | `/api/cart/:itemId` | Update item quantity | Yes |
| DELETE | `/api/cart/:itemId` | Remove item from cart | Yes |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Place new order | Yes |
| GET | `/api/orders` | Get user's orders | Yes |
| GET | `/api/orders/:id` | Get order details | Yes |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/products` | All products (inc. inactive) | Admin |
| POST | `/api/admin/products` | Create product | Admin |
| PUT | `/api/admin/products/:id` | Update product | Admin |
| DELETE | `/api/admin/products/:id` | Soft-delete product | Admin |
| GET | `/api/admin/orders` | All orders | Admin |
| GET | `/api/admin/orders/:id` | Order details | Admin |
| PUT | `/api/admin/orders/:id/status` | Update order status | Admin |

## Order Status Workflow

```
Pending → Confirmed → Processing → Shipped → Delivered
   ↓          ↓           ↓
 Cancelled  Cancelled   Cancelled
```

## Default Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopease.com | admin123 |
| Customer | john@example.com | password123 |

## License

MIT
