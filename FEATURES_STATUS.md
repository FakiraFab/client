# Fakira-Fab — Feature Status (Client)

Last audited: 2026-01-19

Summary
- Purpose: public storefront to display unstitched fabrics and ready-made block prints. Current sales flow: enquiries (no direct checkout).

Completed (frontend)
- Product discovery
  - Product listing pages: `AllProducts`, `CategoryPage`, `NewArrivals`, `ProductDetails`.
  - Product card and product detail components: `ProductCard`, `ProductInfoTabs`, `ModernProductSpecs`.
- Categories & filters
  - Category components: `Categories`, `CategoriesGrid`, `CategoryFilter`, `FilterTabs`.
- Content & marketing
  - Banners and carousels: `Hero`, `Carousel`, `AutoCarousel`.
  - Blog support: `BlogList`, `BlogDetails`, `BlogCard`, `blogApi` client.
  - SEO helpers: `Seo`, `JsonLd`, plus `robots.txt` and `sitemap.xml` in `public/`.
- Media & engagement
  - Instagram reels support: `InstgramReels` component.
  - Search modal: `SearchModal` and styles present.
- Lead/enquiry flow
  - `EnquiryForm` used instead of direct purchase; sales team handles leads.
- UI/UX foundation
  - `Header`, `Footer`, `Toast` system, `ScrollTop`, `GAListener`.
  - `QuickView`, `CartModal` (UI exists), skeletons and loaders.

Existing API clients (frontend)
- `src/api/products.ts`, `src/api/banners.ts`, `src/api/blogApi.ts`, `src/api/workshopApi.tsx`, and a `client.tsx` wrapper.

Context & state
- `CartContext` and `ToastContext` present for basic state management.

Missing / Phase Two scope (high-level)
- Authentication & user accounts (signup/login/profile/password recovery).
- Persistent carts and wishlists (per-user storage).
- Checkout & payments (Razorpay integration, payment verification, receipts).
- Delivery management (addresses, shipping rates, tracking updates).
- Orders & admin workflows (order dashboard, lead conversion automation).
- Notifications (transactional emails/SMS) and receipts.
- Security, testing, CI/CD and monitoring.

Notes
- Frontend displays, components and API clients exist, but server-side endpoints (auth, orders, payments) appear absent. Phase Two primarily requires backend APIs plus frontend account/checkout UIs.
