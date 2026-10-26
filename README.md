# OrderFlow — WhatsApp Order Automation

A static starter website for small shops. It uses plain HTML, CSS and JavaScript, so no build step or paid API is needed.

## Features
- Responsive product storefront and search
- Shopping cart with quantities and estimated total
- Customer checkout form
- Creates a pre-filled WhatsApp order message for the store's WhatsApp number
- Browser-local store settings and product editing
- Export product list to CSV
- Demo products included

## Important limitations
This is a static prototype, not a multi-user SaaS backend:
- Product changes and store settings are saved in the current browser using `localStorage`.
- They are not shared with customers or across devices automatically.
- The customer taps Send in WhatsApp; this does not send messages silently.
- It does not collect orders into a central database, provide login/accounts, process payments, or send automated WhatsApp messages.
- Never put API keys or passwords in frontend code. For shared accounts/orders, use a backend/database. For WhatsApp Business Platform messaging, follow Meta's official rules and pricing.

## Run locally
Open `index.html` in a modern browser. For a local development server, use VS Code Live Server or run `python -m http.server 8000` in this folder and open `http://localhost:8000`.

## Deploy to GitHub + Vercel
1. Create a GitHub repository.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the repository root.
3. In Vercel, choose **Add New → Project**, import the GitHub repository.
4. Framework preset: **Other**. Build command: leave empty. Output directory: `.` (or leave the default if it detects the static site).
5. Deploy. No environment variables are required.

## Customize
- Update the demo products in `app.js` if you want different default products.
- Store owner should open Manage store and enter a WhatsApp number in international format, numbers only. Example Pakistan number: `923001234567`.
- This is a demo; if selling to a client, make sure their products and WhatsApp number are configured in their own browser, or customize a separate deployment for them.
