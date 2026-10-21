# WE LOVE DOGS

A responsive dog-food storefront prototype built with React and Vite. Product prices, brands, stock, testimonials and business details are demonstration content until the business supplies verified information.

## Requirements

- Node.js 20 or newer (npm is included with Node.js)
- Git for version control and GitHub

Node.js 24 LTS and npm 11 have been installed for the current Windows user. Restart VS Code so new terminals inherit the updated user PATH. Git is not yet installed; it is only needed for version control and GitHub publishing, not for running the website.

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
- Edit `src/data/store.js` with verified phone, WhatsApp, email, address, delivery-area and operating-hour details. Use an international digits-only WhatsApp number, including the country code. Keep the WhatsApp value empty until a real business number is confirmed.
- Replace all demonstration prices and availability with current business information before accepting customer enquiries.
- Add only real customer testimonials with permission. The current page contains a clearly marked testimonial placeholder.
- Connect a real email service or backend before relying on the Contact form to receive messages.

## Git and GitHub

Git is not installed or available on PATH in the current environment, so this folder has not been initialized or connected to a remote. Install Git first. Then inspect the folder before creating history:

```powershell
git status --short --branch
git remote -v
```

If this is the right project folder and there is no existing repository, initialize it and review the files before committing:

```powershell
git init
git status --short
git add .
git diff --cached
git commit -m "Build WE LOVE DOGS storefront"
```

To connect the provided GitHub repository, check its contents first in GitHub. Only add the remote if it is the intended repository and does not contain work that must be merged:

```powershell
git remote add origin https://github.com/nokuthulakubheka1665-creator/Dog-Food.git
git remote -v
```

Before pushing, inspect the branch and remote history. Do not force-push. If GitHub already has commits, fetch and reconcile them first instead of overwriting them. No commit, remote, or push has been made by this setup.

## Deployment

After replacing demo content and testing the production build, deploy the `dist` output to a static hosting provider such as GitHub Pages, Netlify or Vercel. A deployment does not configure payments, order processing or message delivery; those require separate business and service setup.