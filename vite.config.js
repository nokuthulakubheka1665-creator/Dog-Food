import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/Dog-Food/' : '/',
  preview: {
    allowedHosts: ['dog-food-1.onrender.com'],
  },
});