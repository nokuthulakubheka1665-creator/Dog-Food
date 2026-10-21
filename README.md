# WE LOVE DOGS

A responsive dog-food storefront prototype built with React and Vite. Product prices, brands and availability are demonstration content. Business contact details were supplied by the business; the testimonial area remains a placeholder.

## Requirements

- Node.js 20 or newer (npm is included with Node.js)
- Git for version control and GitHub

Node.js 24 LTS, npm 11 and Git for Windows are installed for the current Windows user. Restart VS Code if a new terminal does not recognize these commands.

## Run locally

From this project folder:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. To make a production build, run:

```powershell
npm run build
npm run preview
```

## What's included

- Responsive home page, product catalogue, breed gallery, About, How to Order and Contact sections.
- Search, product category filters and price sorting.
- Cart with quantity controls, subtotal and browser-local persistence.
- A WhatsApp order enquiry builder. It does not take payment or confirm an order; the customer must review and send the message in WhatsApp.
- Contact form validation. The form is a front-end preview only and does not send or store messages.

Images are loaded from Unsplash and need an internet connection. Replace or verify image choices before launch.

## Update products and store details

- Edit `src/data/products.js` to change products, descriptions, sample prices, package sizes, categories and images.
- Edit `src/data/breeds.js` to change the gallery breeds and descriptions.
- Edit `src/data/store.js` to update the business phone, WhatsApp, email, address, delivery areas and operating hours. The WhatsApp link uses the international digits-only number with South Africa's `27` country code.
- Replace all demonstration prices and availability with current business information before accepting customer enquiries.
- Add only real customer testimonials with permission. The current page contains a clearly marked testimonial placeholder.
- Connect a real email service or backend before relying on the Contact form to receive messages.

## Git and GitHub

This project is already initialized on branch `main` and connected to the provided GitHub repository as `origin`. Check status before committing changes:

```powershell
git status --short --branch
git remote -v
```

Review changes before committing and pushing. Do not force-push; fetch and reconcile first if the remote has changes you do not have locally.

## Deployment

After replacing demo content and testing the production build, deploy the `dist` output to a static hosting provider such as GitHub Pages, Netlify or Vercel. A deployment does not configure payments, order processing or message delivery; those require separate business and service setup.