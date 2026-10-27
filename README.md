# WhatsApp Order Automation Plus

Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the root of one GitHub repository, then import it into Vercel as a static project.

## Features
- Responsive design and product search
- Cart and WhatsApp checkout
- Admin demo login (default password: `admin123`)
- Add/edit/delete products
- Order list, status updates, delete orders, CSV export
- Store name, WhatsApp number, currency, payment link, password settings
- Payment method choices: cash on delivery, bank transfer, Easypaisa/JazzCash, payment link

## Setup
Open the site, select **Admin panel**, sign in with `admin123`, then open **Settings**. Enter your store name and WhatsApp number using digits only, including country code (Pakistan example format: `923001234567`). Change the demo password.

## Important limits
This is a static front-end demo. Products, settings, orders, and password are stored only in the current browser's localStorage; they do not sync to other devices or browsers. The browser-only login is not secure for a public production store. WhatsApp opens with a prefilled message and the customer must press Send. Payment methods are manual/informational; this app does not process or verify payments. For a real multi-user store, connect a secure backend/database and a payment provider. Never ask customers to enter card details or payment passwords here.
