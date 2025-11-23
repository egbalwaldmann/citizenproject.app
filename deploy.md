# CitizenProject Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Empfohlen für Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify (drag & drop build folder to netlify.com)
# Or use Netlify CLI:
npm i -g netlify-cli
netlify deploy --prod --dir=out
```

### Option 3: GitHub Pages (Static Export)
```bash
# Add to package.json scripts:
"export": "next export"

# Build and export
npm run build
npm run export

# Deploy the 'out' folder to GitHub Pages
```

## 🔧 Pre-Deployment Checklist

### 1. Environment Variables
Create `.env.local` (not committed to Git):
```
NEXT_PUBLIC_SITE_URL=https://citizenproject.app
NEXT_PUBLIC_API_URL=https://api.citizenproject.app
```

### 2. Update next.config.ts
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // For static hosting
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### 3. Domain Configuration
- Point `citizenproject.app` to your hosting provider
- Update DNS A records or CNAME
- Configure SSL certificate

## 📝 Build Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server (if not static)
npm start
```

## 🌐 Domain Setup for citizenproject.app

### DNS Configuration needed:
- A Record: @ -> [Your hosting IP]
- CNAME: www -> citizenproject.app
- SSL Certificate setup

### Vercel Custom Domain:
1. Go to Vercel Dashboard
2. Project Settings > Domains
3. Add `citizenproject.app`
4. Follow DNS instructions

## ✅ Post-Deployment Tasks
- [ ] Test all pages load correctly
- [ ] Verify navigation works
- [ ] Check file upload functionality
- [ ] Test responsive design
- [ ] Validate domain redirects
- [ ] Set up monitoring/analytics