# WhatsApp Order Automation — Updated Demo

## What's included
- Professional responsive storefront and admin dashboard
- Guest visitors can browse products, add to cart, and prepare an order for WhatsApp
- Admin panel login password for this static demo: `ZAHEER` (case-sensitive)
- Add/edit/delete products, upload product images from a phone or computer, and preview images
- Order list, status updates, CSV export, store settings
- WhatsApp order message with a formatted itemized list, quantities, subtotals, customer details, and total
- Public Vercel deployment should not require visitors to have Vercel accounts if Deployment Protection is disabled for the production deployment

## Deploy
Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the root of the GitHub repository, then redeploy the project on Vercel.

## Important security and storage limits
This is still a **static front-end demo**, not a production-secure store. The password is present in client-side JavaScript and can be discovered by a technically capable visitor. It protects the normal interface only; it is not secure authorization. Products, uploaded images, settings, and orders are saved in the current browser's localStorage, so they do not sync to other visitors/devices. Images are stored as browser data and should be small (under about 1.2 MB). For genuine admin security and shared product/order data, add a backend such as Supabase Auth + database + Storage, and enforce authorization with database policies/server-side logic. Never place secret service-role keys in browser code.

WhatsApp checkout opens a prefilled message. The customer must press Send. This site does not send messages automatically or process/verify payments. Only upload product images and use media you have rights to use. No tool can guarantee copyright claims will never happen.
