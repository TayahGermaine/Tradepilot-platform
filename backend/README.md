# TradePilot Backend

A MongoDB-backed Express API for the TradePilot frontend. It implements every
endpoint the frontend's `src/services/*.js` files already call, with request/
response shapes matched to what the React components expect — no frontend
data-mapping changes required.

## Stack

- Node.js (ESM) + Express
- MongoDB via Mongoose
- JWT auth (`jsonwebtoken`) + bcrypt password hashing (`bcryptjs`)
- helmet, cors, express-rate-limit, morgan

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGODB_URI` — a local `mongod` instance or a MongoDB Atlas connection string.
- `JWT_SECRET` — any long random string.
- `CORS_ORIGIN` — your frontend's dev URL (defaults to `http://localhost:5173`, Vite's default).

Seed some demo data (an admin, a broker, and two clients with sample
positions/orders/wallet balances):

```bash
npm run seed
```

This prints the demo login credentials at the end. Then start the server:

```bash
npm run dev     # auto-restarts on changes
# or
npm start
```

The API listens on `http://localhost:4000` by default, mounted under `/api`.
A plain health check is available at `GET /health`.

## Connecting the frontend

In the frontend project root, copy `.env.example` to `.env` — it already
points `VITE_API_BASE_URL` at `http://localhost:4000/api`, which is what
`src/services/api.js` reads. Run the frontend as usual (`npm run dev`) and it
will talk to this backend.

Note: the frontend's `authApi.js` also has a **client-side shortcut** for the
`admin` role (hardcoded `admin@tradepilot.io` / `AdminSecure2026!`) that
never touches the network. It still works, but it's disconnected from
whatever admin account you seed here. To fully route admin login through the
backend, log in with the seeded admin's real email/password on the `client`
or `broker` tab, or remove that shortcut block in `authApi.js` — it wasn't
changed here since it doesn't block the backend integration.

## Auth model

- `POST /api/auth/register` and `POST /api/auth/login` return `{ token, user }`.
  The frontend stores the token in `localStorage` under `tradepilot_token`
  and sends it back as `Authorization: Bearer <token>` (see `api.js`) — this
  backend expects exactly that header.
- Roles: `client`, `broker`, `admin`. Registration cannot create `admin`
  accounts (matches the frontend's own guard) — create the admin via
  `npm run seed` or directly in the database.
- Every `/api/client/*`, `/api/broker/*`, `/api/admin/*` route is guarded by
  both authentication and a role check, so a client token can't hit broker
  or admin routes and vice versa. `/api/ai/*` only requires authentication
  (matches the frontend's `/ai` route, which has no role gate).

## Endpoint reference

All paths below are relative to `/api`. Everything except `auth/register` and
`auth/login` requires an `Authorization: Bearer <token>` header.

### Auth (`authApi.js`)
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/register` | `{ fullName, email, password, role }` — role is `client` or `broker` |
| POST | `/auth/login` | `{ email, password, role }` |
| GET | `/auth/me` | Not called by the current frontend; useful for session checks |

### Client (`clientApi.js`) — role: `client`
| Method | Path | Notes |
|---|---|---|
| GET | `/client/profile` | |
| GET | `/client/portfolio` | NAV / PnL / margin summary |
| GET | `/client/positions` | |
| GET | `/client/wallet` | |
| GET | `/client/holdings` | Per-asset breakdown with allocation % |
| GET | `/client/transactions` | Last 25 |
| GET | `/client/orders` | |
| POST | `/client/orders` | `{ pair, side, type, size, price }` — `price` omitted for `market` orders |
| DELETE | `/client/orders/:orderId` | Only cancels `open` orders |
| POST | `/client/wallet/deposit` | `{ asset, amount }` — credits the wallet immediately (demo behavior) |
| POST | `/client/wallet/withdraw` | `{ asset, amount, address }` — debits the wallet, creates a pending admin-reviewed withdrawal |
| GET | `/client/ai/signals` | |
| GET | `/client/ai/tools` | |
| POST | `/client/ai/run` | `{ tool }` |
| GET | `/client/kyc` | |
| POST | `/client/kyc` | `{ fullName, dob, nationality, address, idType, idNumber, docUploaded, selfieUploaded }` |

### Broker (`brokerApi.js`) — role: `broker`
| Method | Path | Notes |
|---|---|---|
| GET | `/broker/profile` | |
| GET | `/broker/stats` | |
| GET | `/broker/clients` | Only clients where `brokerId` matches the logged-in broker |
| GET | `/broker/clients/:clientId` | 404s if that client isn't assigned to this broker |
| GET | `/broker/requests` | Pending requests only |
| PATCH | `/broker/requests/:requestId` | `{ decision: "approved" \| "declined" }` |
| GET | `/broker/alerts` | Clients with margin usage over 70% |

### Admin (`adminApi.js`) — role: `admin`
| Method | Path | Notes |
|---|---|---|
| GET | `/admin/stats` | |
| GET | `/admin/withdrawals` | Pending only |
| PATCH | `/admin/withdrawals/:ref` | `{ decision: "approved" \| "hold" }` — `hold` refunds the client's wallet |
| GET | `/admin/health` | Database status is live; other rows are illustrative |
| GET | `/admin/users` | All users, any role |
| GET | `/admin/users/:userId` | |
| PATCH | `/admin/users/:userId` | `{ role: "client" \| "broker" \| "admin" }` |
| GET | `/admin/kyc` | Pending submissions |
| PATCH | `/admin/kyc/:userId` | `{ decision: "approved" \| "rejected" }` |

### AI Console (`aiApi.js`) — any authenticated role
| Method | Path | Notes |
|---|---|---|
| GET | `/ai/stats` | |
| GET | `/ai/tools` | |
| POST | `/ai/run` | `{ tool }` |
| GET | `/ai/actions` | |
| GET | `/ai/signals` | |
| GET | `/ai/sentiment` | |
| GET | `/ai/news-digest` | |

## Data model

| Model | Purpose |
|---|---|
| `User` | Account + role (`client`/`broker`/`admin`); clients have a `brokerId` reference |
| `Wallet` | One per user — per-asset balances plus cash/collateral summary fields |
| `Kyc` | One per user — identity verification submission + review status |
| `Position` | Open trading positions shown on the portfolio/terminal pages |
| `Order` | Placed orders (limit/market/stop), tracks `open`/`filled`/`cancelled` |
| `Transaction` | Deposit/withdrawal/swap/trade history |
| `Withdrawal` | Withdrawal requests awaiting admin review |
| `BrokerRequest` | Client-initiated requests a broker approves/declines |
| `AiToolRun` | Log of AI tool invocations |

## Things worth knowing before production use

- **Asset pricing** (`src/utils/marketPrices.js`) is a small static table used
  only to value wallet holdings server-side. The frontend gets live prices
  from CoinGecko directly (`useLiveMarkets.js`) and isn't affected. Swap this
  for a real price feed if you need accurate server-side valuations.
- **Deposits credit the wallet instantly** and **withdrawals debit it
  instantly** (pending admin approval) — that mirrors the frontend's
  optimistic UI, but a real money-movement flow would integrate an actual
  payment/custody provider and likely keep funds in a separate "pending"
  bucket instead of moving them immediately.
- **The AI Console** (`aiEngine.js`) returns randomized, illustrative output.
  There's no real model behind `/ai/*` or `/client/ai/*` — replace
  `runTool()` and the generator functions with real calls when you have a
  model/data source to wire up.
- **Rate limiting and CORS** are configured for local development
  (permissive limits, single origin). Tighten both before deploying.
