# WhatsApp Order Automation — refreshed storefront prototype

## Included
- Responsive storefront with product search and cart
- Guest checkout that opens WhatsApp with a clean, itemized order message
- Admin dashboard with Overview, Products, Orders, and Settings tabs
- First-use admin password setup (minimum 8 characters); password hash is stored in this browser
- Add/edit/delete products, select an image from the phone gallery, preview it, and remove it
- Order list, status changes, CSV export, store name, WhatsApp number, currency and payment details
- Vercel public-deployment note

## Upload to GitHub / deploy
Upload these files to the root of the existing repository:
- `index.html`
- `styles.css`
- `app.js`
- `README.md`

Then let Vercel deploy the updated `main` branch. Keep Deployment Protection disabled for the public production deployment if customers should not need Vercel accounts.

## Important limitations — read before using for real customers
This is a **static prototype**, not a production-secure e-commerce backend:
- Products, images, store settings, admin password hash, cart and orders use the browser's `localStorage`. They do **not** sync between devices or customers. Each browser has its own separate copy.
- The password setup is a user-interface lock only. Since the app is static and all JavaScript runs in the browser, it cannot securely authorize admins or protect shared data. Do not treat this as real admin security.
- Product images are stored as data URLs in local browser storage; use small images (up to about 1.2 MB) to reduce storage errors.
- WhatsApp checkout opens a prefilled message. The customer must press **Send** in WhatsApp. It does not automatically send messages or save an order to a central database.
- Payment methods in checkout are informational; no payment is processed or verified.

Before running a real public store, integrate Supabase Auth, Database, and Storage. Use database Row Level Security policies so only authenticated admins can write products or manage orders, and keep privileged keys out of frontend JavaScript. Use a secure server-side order workflow if you need shared order records.

Use only product images and media you have permission to use. No tool can guarantee copyright claims will never occur.
