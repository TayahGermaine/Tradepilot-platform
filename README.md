# QuantumX

A React (Vite) + Tailwind CSS front-end clone of the QuantumX crypto-terminal UI:
marketing landing page, login screen, broker portal, and admin console — fully
responsive, dark themed, with mock data and working interactions
(login redirect, approve/decline buttons, mobile nav).

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

The production build is written to `dist/`.

## Pages / routes

| Route     | Page                                              |
|-----------|----------------------------------------------------|
| `/`       | Landing page                                        |
| `/login`  | Client portal login (email/password)                |
| `/broker` | Broker Portal dashboard (client book, requests)      |
| `/admin`  | Admin Console (withdrawals, system health, users)    |

The "CONTINUE" button on the login form, and the "BROKER LOGIN" / "ADMIN LOGIN"
shortcuts, route straight into the two dashboards — there's no real backend,
all data in `src/data/mockData.js` is mocked and safe to edit.

## Structure

```
src/
  components/   Shared UI: nav bar, logo, icons, stat cards, tables
  data/         Mock data used across pages
  pages/        Landing, Login, BrokerPortal, AdminConsole
  index.css     Tailwind layers + design tokens (buttons, inputs, cards)
tailwind.config.js  Color palette, fonts, shadows used throughout
```

## Notes

- Approve/Decline and Approve/Hold buttons in the Broker Portal and Admin
  Console update local component state only (no persistence).
- Fonts: Inter (UI) and JetBrains Mono (numeric/data values), loaded from
  Google Fonts in `index.html`.
- All figures, names and balances are placeholder/mock data.
