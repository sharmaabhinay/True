# True Furnitures — Vite React App v2.0

Custom furniture store for Indore, MP. Built with Vite + React 18, Redux Toolkit, Redux Saga, Tailwind CSS, Framer Motion, React Icons.

## Quick Start

```bash
npm install
npm run dev        # dev server on http://localhost:3000
npm run build      # production build → dist/
npm run preview    # preview production build
```

## Routes
- `/` — Store homepage
- `/product/:id` — Product detail with gallery + 3D viewer
- `/checkout` — Checkout (requires login)
- `/thank-you` — Order confirmation with animation
- `/wishlist` — Saved items
- `/track-order` — Order tracking
- `/about` — About Us
- `/careers` — Careers
- `/privacy` — Privacy Policy
- `/terms` — Terms & Conditions
- `/admin` — Admin panel (admin / admin123)
- `/admin/customers/:id` — Customer detail
- `/admin/orders/:id` — Order detail with timeline

## Admin Credentials
- URL: `/admin`
- Username: `admin`
- Password: `admin123`

## Key Features
- Animated typewriter hero ("Get your fully customized Sofa / Almirah / Bedroom Set…")
- Interactive 3D furniture models (custom canvas engine, no WebGL)
- Auth system (login/signup modal, profile dropdown, protected checkout)
- Full checkout flow: address → payment method → confirm → thank you page
- 10% deposit requirement note on checkout
- Wishlist with persistence
- Admin: Customers list + detail, Orders with timeline + status dropdown, Products with multi-image + variants + specs + features + 3D OBJ upload
- Static pages: About, Careers, Privacy, Terms, Track Order
