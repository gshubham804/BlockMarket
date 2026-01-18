# BlockMarket Backend

Backend coordination layer for BlockMarket - a blockspace marketplace with gasless transaction execution.

## 🏗️ Architecture

This backend serves as a coordination layer that:
- ✅ Coordinates gasless execution
- ✅ Tracks blockspace commitment lifecycle
- ✅ Prevents double usage of commitments
- ✅ Caches market data
- ✅ Tracks transaction states

**Important:** This backend:
- ❌ Does NOT custody funds
- ❌ Does NOT sign transactions on behalf of users
- ❌ Does NOT interact with mainnet
- 🧪 Testnet Only

## 📁 Project Structure

```
backend/
├─ src/
│  ├─ server.ts              # Entry point
│  ├─ app.ts                 # Express app setup
│  ├─ config/
│  │  ├─ env.ts              # Environment configuration
│  │  └─ db.ts                # MongoDB connection
│  ├─ models/
│  │  ├─ User.model.ts       # User schema & types
│  │  ├─ Market.model.ts     # Market commitment schema
│  │  └─ Order.model.ts      # Order/transaction schema
│  ├─ modules/
│  │  ├─ auth/               # Authentication module
│  │  ├─ market/             # Marketplace module
│  │  └─ orders/             # Orders/transactions module
│  ├─ middlewares/
│  │  ├─ auth.middleware.ts  # JWT authentication
│  │  └─ error.middleware.ts  # Error handling
│  ├─ utils/
│  │  └─ ethgas.client.ts    # ETHGas API client
│  └─ types/
│     └─ ethgas.ts           # ETHGas API types
├─ package.json
└─ README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# MongoDB will connect automatically on server start
```

### Environment Variables

Create a `.env` file:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL="mongodb://localhost:27017/blockmarket"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
ETHGAS_API_URL="https://api.ethgas.testnet"
ETHGAS_API_KEY="optional-api-key"
CORS_ORIGIN="http://localhost:5173"
```

### Development

```bash
# Run in development mode with hot reload
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/connect` - Connect wallet and get JWT token
- `GET /api/auth/profile` - Get user profile (requires auth)

### Market

- `GET /api/market/commitments` - Get available commitments
- `POST /api/market/commitments` - Create new commitment (requires auth)
- `POST /api/market/commitments/:id/reserve` - Reserve commitment (requires auth)
- `GET /api/market/my-commitments` - Get user's commitments (requires auth)

### Orders

- `POST /api/orders` - Create new order/transaction (requires auth)
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get order by ID (requires auth)
- `PATCH /api/orders/:id/status` - Update order status (requires auth)

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM (Object Document Mapper)
- **Zod** - Schema validation
- **JWT** - Authentication
- **Axios** - HTTP client for ETHGas API

## 📝 Database Schema

The database schema is managed by Mongoose. See models in `src/models/`:
- `User.model.ts` - User schema
- `Market.model.ts` - Market commitment schema
- `Order.model.ts` - Order/transaction schema

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test
```

## 📜 License

MIT
