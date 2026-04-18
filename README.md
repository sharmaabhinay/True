# True Furnitures — Vite React App

> Premium furniture store for Indore, MP — built with React 18, Redux Toolkit, Redux Saga, and Tailwind CSS.

## Tech Stack

| Layer         | Technology                         |
|---------------|------------------------------------|
| UI            | React 18, JSX                      |
| Styling       | Tailwind CSS 3                     |
| State         | Redux Toolkit + Redux Saga         |
| Routing       | React Router v6                    |
| 3D Rendering  | Custom Canvas 2D engine (no WebGL) |
| Persistence   | localStorage via custom middleware |

## Folder Structure

```
src/
├── components/
│   ├── layout/        # Navbar, Footer, MobileNav, Loader, Toast
│   ├── store/         # Hero, Categories, Products, ModelViewer, RoomPlanner, EMI, Testimonials, Newsletter
│   ├── admin/         # Dashboard, Products, Visitors, Quotes, Orders, Settings panels
│   ├── common/        # CartDrawer, QuoteModal, LocationStrip, ContactBar
│   └── ui/            # Button, Badge, Modal — reusable primitives
├── pages/
│   ├── StorePage.jsx  # Public storefront
│   └── AdminPage.jsx  # Password-protected admin panel
├── store/
│   ├── slices/        # cartSlice, productsSlice, uiSlice, adminSlice, visitorSlice
│   ├── sagas/         # rootSaga, locationSaga, productsSaga, visitorSaga
│   ├── store.js       # configureStore with saga middleware
│   └── index.js       # barrel export
├── hooks/             # useReveal, use3DCanvas, useEMI, useRoomPlanner
├── utils/             # engine3d.js, formatters.js, localStorage.js, tracker.js
├── data/              # products.js, testimonials.js, roomItems.js, constants.js
└── styles/            # index.css (Tailwind + custom fonts/keyframes)
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
copy .env.example .env

# 3. Start development server
npm run dev
```

Open the local Vite URL shown in the terminal — store is at `/`, admin at `/admin`.

## Admin Panel

- URL: `/admin`
- Username: `admin`
- Password: `admin123`

Features: live visitor tracking, product CRUD with image + 3D model upload, quote requests, EMI calculator, room planner.

## Environment Variables

See `.env.example` for all available variables. Never commit `.env.local` or production secrets.
