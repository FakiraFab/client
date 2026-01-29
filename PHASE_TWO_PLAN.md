# Phase Two — Implementation Plan (Account, Checkout, Delivery, Payments)

Last updated: 2026-01-19

Goal
- Move from enquiry-only storefront to a full buyer flow: user accounts, persistent carts/wishlists, checkout with Razorpay, delivery/address management, and admin order workflows.

Priority & MVP definition
- MVP (must-have to accept payments and orders):
  1. User Authentication (signup, login, JWT/session
     tokens, password reset).
  2. Persistent Cart (frontend + backend endpoints).
  3. Checkout UI + Razorpay integration (create order, initiate payment, verify webhook).
  4. Order creation and basic order state (pending, paid, shipped).
  5. Address management (user addresses in profile).

Phase plan (milestones)
- Sprint 1 — API & Auth (2 weeks)
  - Design API spec for auth and user resources.
  - Implement `/api/auth/signup`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/reset-password` endpoints.
  - Frontend: `SignUp`, `Login`, `Account` pages and auth flows (store JWT securely, refresh flows).

- Sprint 2 — Cart & Wishlist (1.5 weeks)
  - Backend endpoints: `/api/cart` (GET/POST/PUT/DELETE) tied to user ID; `/api/wishlist`.
  - Frontend: persist cart to server on signin; merge guest cart on login.

- Sprint 3 — Checkout & Payments (2 weeks)
  - Backend: `/api/orders/create` to create provisional order and fetch Razorpay order id; `/api/orders/verify` to handle Razorpay webhook/signature.
  - Frontend: checkout flow, address selection, payment UI (Razorpay checkout), order confirmation.
  - Webhooks: payment verification endpoint, update order status.

- Sprint 4 — Delivery & Orders (1.5 weeks)
  - Data model for addresses, shipping rates, order status updates.
  - Admin: simple orders list for sales to view/mark shipped; email notifications on status change.

- Sprint 5 — Polish, Tests & Deploy (1 week)
  - End-to-end tests for signup → cart → checkout.
  - CI pipeline config, env/secret management, monitoring and rollback plan.

Backend data models (recommended)
- `users`:
  - id, email, password_hash, name, phone, created_at, updated_at
- `addresses`:
  - id, user_id, name, street, city, state, country, postal_code, phone, is_default
- `products`:
  - (existing from product system) sku, name, price, stock, attrs
- `carts` or `cart_items`:
  - id, user_id (nullable for guest), product_id, qty, metadata
- `wishlists`:
  - id, user_id, product_id, created_at
- `orders` and `order_items`:
  - orders: id, user_id, amount, currency, status, payment_id, shipping_address_id, created_at
  - order_items: order_id, product_id, qty, price
- `payments`:
  - id, order_id, provider, provider_payment_id, status, payload

API endpoints (minimum)
- Auth: POST `/api/auth/signup`, POST `/api/auth/login`, POST `/api/auth/refresh`, POST `/api/auth/forgot`, POST `/api/auth/reset`.
- Cart: GET/POST/PUT/DELETE `/api/cart` (user-scoped).
- Wishlist: GET/POST/DELETE `/api/wishlist`.
- Orders: POST `/api/orders/create`, GET `/api/orders/:id`, GET `/api/orders` (user), GET `/api/admin/orders`.
- Payments: POST `/api/payments/razorpay/create-order`, POST `/api/payments/razorpay/webhook`.

Razorpay integration notes
- Server creates a Razorpay order with amount and currency and returns `order_id` to frontend.
- Frontend opens Razorpay checkout with `order_id`; on success, send payment response to backend for verification.
- Backend verifies signature and payment using Razorpay secret, then marks order `paid`.
- Secure webhook endpoint for async events (payments.failed, payments.captured).

Frontend tasks (components/pages)
- Auth pages: `SignUp.tsx`, `Login.tsx`, `Account/Profile.tsx`, `ForgotPassword.tsx`.
- Cart & Checkout: improve `CartModal` into full `CartPage`, `CheckoutPage`, `OrderConfirmation`.
- Wishlists: `WishlistPage`, wishlist button on product cards.
- Order history & tracking: `OrdersPage`, `OrderDetails`.
- Merge guest cart on login and persist cart in `CartContext`.

Admin & Sales tooling
- Minimal admin UI: list of orders with filters (pending, paid, shipped), ability to update status and add tracking id.
- Optionally integrate with existing sales CRM or send lead emails/SMS when enquiry converts.

Security & compliance
- Hash passwords (bcrypt/argon2) and use HTTPS for all endpoints.
- Sanitize inputs, validate server-side, rate-limit auth endpoints, implement CORS/CSRF protection.

Monitoring & notifications
- Set up email (SMTP or transactional provider) and SMS (optional) for order confirmations.
- Add error/error reporting (Sentry) and analytics for funnel tracking (GA events already present via `GAListener`).

Estimates & timeline (MVP rollout)
- Rough estimate for a small team (frontend + backend dev): 6–8 weeks to reach the MVP above. Timeline can be compressed with existing backend or 3rd-party checkout providers.

Next immediate steps (what I can do now)
1. Prepare detailed API spec (OpenAPI) for required endpoints.
2. Scaffold frontend pages/components for `SignUp`, `Login`, `CartPage`, `CheckoutPage`.
3. Provide sample backend endpoint stubs and DB migration schema (if you want me to scaffold them).

Environment & secrets
- Add the following env vars: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, JWT_SECRET, SMTP credentials, DATABASE_URL.

Opening note
- The existing repo already contains many UI building blocks — most work for Phase Two is backend/API + glue on the frontend for auth, persistent cart, and payment flows.
