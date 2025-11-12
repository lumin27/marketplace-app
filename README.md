# 🛒 Marketplace App

A modern, full-featured marketplace application built with Next.js, Supabase, and Tailwind CSS.

## ✨ Features

- **User Authentication** - Secure login/signup with Supabase Auth
- **Product Listings** - Create, browse, and manage marketplace listings
- **Image Upload** - Upload and manage product images
- **Favorites System** - Save and manage favorite items
- **Messaging** - Direct communication between buyers and sellers
- **Analytics Dashboard** - Track sales and performance metrics
- **Responsive Design** - Mobile-first, modern UI with dark/light mode
- **Real-time Updates** - Live updates using Supabase real-time features

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account

### 1. Clone and Install

```bash
# Clone the repository
git clone <>
cd marketplace_app

# Install dependencies
pnpm install
# or
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token  # Optional
```

### 3. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to Settings → API to get your project URL and anon key

#### Authentication Setup

1. Go to Authentication → Settings in your Supabase dashboard
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs for your app
4. Enable email authentication

#### Storage Setup (Optional)

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `listing-images`
3. Set it to public if you want images to be publicly accessible
4. Configure RLS policies for the bucket

### 4. Start Development

```bash
# Start the development server
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
marketplace-app/
├── app/                    # Next.js 13+ app router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── browse/           # Browse listings
│   └── listing/          # Individual listing pages
├── components/            # Reusable UI components
│   └── ...               # Custom components
├── lib/                  # Utility functions
│   └── supabase/         # Supabase client configuration
├── scripts/              # Database setup SQL files
├── public/               # Static assets
└── styles/               # Global styles
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Cloudinary (optional)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

## 📝 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

## 🔧 Configuration

### Tailwind CSS

The app uses Tailwind CSS with custom configuration. The config file is at `tailwind.config.js`.

### Supabase

- Client configuration: `lib/supabase/client.ts`
- Server configuration: `lib/supabase/server.ts`
- Middleware: `lib/supabase/middleware.ts`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Environment Variables**: Make sure all required environment variables are set
2. **Database Connection**: Verify your Supabase URL and keys are correct
3. **RLS Policies**: Ensure Row Level Security policies are properly configured
4. **Authentication**: Check that Supabase Auth is properly set up

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Next.js Documentation](https://nextjs.org/docs)
- Open an issue in this repository

---

Built with ❤️ using Next.js and Supabase
```

```
marketplace_app
├─ .next
│  ├─ app-build-manifest.json
│  ├─ build-manifest.json
│  ├─ cache
│  │  ├─ images
│  │  │  ├─ 6tf8+0In+5S01fTx8of2AvPqu8+VJPeNvZXhBiKRIm8=
│  │  │  │  └─ 2592000.1765387386855.CLUZr90NfIgMPxpbZtSOyLHz26kJ6WuuBRljlqRdPhk=.webp
│  │  │  ├─ EShNgoaKUZWuSce3T6m1Wkh8CSj+Nf0ZYPnxK2FD2EU=
│  │  │  │  └─ 60.1762796480250.PNXMSK+pH7-OLIp4acX8BpaNrMpy5pLACQy4uZEn0m0=.webp
│  │  │  ├─ JxfiDdH+cX2PjA5Btzw46NNcEveV7GaTPpPFKXKAlNQ=
│  │  │  │  └─ 60.1762796380732.jxAgm3OZZT67BXGhl7x3V67XRd9rNUwQxEUxk8UYzHs=.webp
│  │  │  └─ t4gs4aJwNXNSbM2FHpKwCRkzOCIo4fvl1DEyjgCgLJw=
│  │  │     └─ 2592000.1765387386857.-L9JO0GhmxJGBAiFsdOvZ0HLK76vHwWBhJ-Qy811FA0=.webp
│  │  ├─ swc
│  │  │  └─ plugins
│  │  │     └─ v7_macos_aarch64_0.106.15
│  │  └─ webpack
│  │     ├─ client-development
│  │     │  ├─ 0.pack.gz
│  │     │  ├─ 1.pack.gz
│  │     │  ├─ 2.pack.gz
│  │     │  ├─ 3.pack.gz
│  │     │  ├─ 4.pack.gz
│  │     │  ├─ 5.pack.gz
│  │     │  ├─ 6.pack.gz
│  │     │  ├─ 7.pack.gz
│  │     │  ├─ index.pack.gz
│  │     │  └─ index.pack.gz.old
│  │     └─ server-development
│  │        ├─ 0.pack.gz
│  │        ├─ 1.pack.gz
│  │        ├─ 2.pack.gz
│  │        ├─ 3.pack.gz
│  │        ├─ 4.pack.gz
│  │        ├─ 5.pack.gz
│  │        ├─ 6.pack.gz
│  │        ├─ index.pack.gz
│  │        └─ index.pack.gz.old
│  ├─ package.json
│  ├─ react-loadable-manifest.json
│  ├─ server
│  │  ├─ app
│  │  │  ├─ _not-found
│  │  │  │  ├─ page.js
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ browse
│  │  │  │  ├─ page.js
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ dashboard
│  │  │  │  ├─ listings
│  │  │  │  │  ├─ page.js
│  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  ├─ profile
│  │  │  │  │  ├─ page.js
│  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  └─ settings
│  │  │  │     ├─ page.js
│  │  │  │     └─ page_client-reference-manifest.js
│  │  │  ├─ page.js
│  │  │  └─ page_client-reference-manifest.js
│  │  ├─ app-paths-manifest.json
│  │  ├─ interception-route-rewrite-manifest.js
│  │  ├─ middleware-build-manifest.js
│  │  ├─ middleware-manifest.json
│  │  ├─ middleware-react-loadable-manifest.js
│  │  ├─ next-font-manifest.js
│  │  ├─ next-font-manifest.json
│  │  ├─ pages-manifest.json
│  │  ├─ server-reference-manifest.js
│  │  ├─ server-reference-manifest.json
│  │  ├─ vendor-chunks
│  │  │  ├─ @hookform.js
│  │  │  ├─ @supabase.js
│  │  │  ├─ @swc.js
│  │  │  ├─ @vercel.js
│  │  │  ├─ cloudinary.js
│  │  │  ├─ clsx.js
│  │  │  ├─ cookie.js
│  │  │  ├─ date-fns.js
│  │  │  ├─ framer-motion.js
│  │  │  ├─ geist.js
│  │  │  ├─ lodash.js
│  │  │  ├─ lucide-react.js
│  │  │  ├─ motion-dom.js
│  │  │  ├─ motion-utils.js
│  │  │  ├─ next-themes.js
│  │  │  ├─ next.js
│  │  │  ├─ q.js
│  │  │  ├─ react-hook-form.js
│  │  │  ├─ react-toastify.js
│  │  │  ├─ sonner.js
│  │  │  ├─ tr46.js
│  │  │  ├─ webidl-conversions.js
│  │  │  ├─ whatwg-url.js
│  │  │  └─ zod.js
│  │  └─ webpack-runtime.js
│  ├─ static
│  │  ├─ chunks
│  │  │  ├─ app
│  │  │  │  ├─ _not-found
│  │  │  │  │  └─ page.js
│  │  │  │  ├─ browse
│  │  │  │  │  ├─ loading.js
│  │  │  │  │  └─ page.js
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ layout.js
│  │  │  │  │  ├─ listings
│  │  │  │  │  │  └─ page.js
│  │  │  │  │  ├─ loading.js
│  │  │  │  │  ├─ page.js
│  │  │  │  │  ├─ profile
│  │  │  │  │  │  └─ page.js
│  │  │  │  │  └─ settings
│  │  │  │  │     └─ page.js
│  │  │  │  ├─ layout.js
│  │  │  │  └─ page.js
│  │  │  ├─ app-pages-internals.js
│  │  │  ├─ main-app.js
│  │  │  ├─ polyfills.js
│  │  │  └─ webpack.js
│  │  ├─ css
│  │  │  └─ app
│  │  │     └─ layout.css
│  │  ├─ development
│  │  │  ├─ _buildManifest.js
│  │  │  └─ _ssgManifest.js
│  │  ├─ media
│  │  │  ├─ 028c0d39d2e8f589-s.p.woff2
│  │  │  └─ 5b01f339abf2f1a5.p.woff2
│  │  └─ webpack
│  │     ├─ 0c521ee3402c346a.webpack.hot-update.json
│  │     ├─ 0d2e6499afafe470.webpack.hot-update.json
│  │     ├─ 38a68f1de30d83d9.webpack.hot-update.json
│  │     ├─ 633457081244afec._.hot-update.json
│  │     ├─ 84a766636d80df5d.webpack.hot-update.json
│  │     ├─ 88e5a7a42894b5ca.webpack.hot-update.json
│  │     ├─ ab4e9a5200a80073.webpack.hot-update.json
│  │     ├─ app
│  │     │  ├─ dashboard
│  │     │  │  └─ settings
│  │     │  │     └─ page.88e5a7a42894b5ca.hot-update.js
│  │     │  ├─ layout.0d2e6499afafe470.hot-update.js
│  │     │  ├─ layout.88e5a7a42894b5ca.hot-update.js
│  │     │  └─ layout.c82e84595c369ccc.hot-update.js
│  │     ├─ bc64d20721109a62.webpack.hot-update.json
│  │     ├─ c82e84595c369ccc.webpack.hot-update.json
│  │     ├─ f2416652ecac08aa.webpack.hot-update.json
│  │     ├─ webpack.0c521ee3402c346a.hot-update.js
│  │     ├─ webpack.0d2e6499afafe470.hot-update.js
│  │     ├─ webpack.38a68f1de30d83d9.hot-update.js
│  │     ├─ webpack.84a766636d80df5d.hot-update.js
│  │     ├─ webpack.88e5a7a42894b5ca.hot-update.js
│  │     ├─ webpack.ab4e9a5200a80073.hot-update.js
│  │     ├─ webpack.bc64d20721109a62.hot-update.js
│  │     ├─ webpack.c82e84595c369ccc.hot-update.js
│  │     └─ webpack.f2416652ecac08aa.hot-update.js
│  ├─ trace
│  └─ types
│     ├─ app
│     │  ├─ browse
│     │  │  └─ page.ts
│     │  ├─ dashboard
│     │  │  ├─ layout.ts
│     │  │  ├─ listings
│     │  │  │  └─ page.ts
│     │  │  ├─ page.ts
│     │  │  ├─ profile
│     │  │  │  └─ page.ts
│     │  │  └─ settings
│     │  │     └─ page.ts
│     │  ├─ layout.ts
│     │  └─ page.ts
│     └─ package.json
├─ README.md
├─ eslint.config.mjs
├─ middleware.ts
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ migrations
│  │  ├─ 20250916223607_init
│  │  │  └─ migration.sql
│  │  ├─ 20250919113826_added_listing_view
│  │  │  └─ migration.sql
│  │  ├─ 20250919121918_added_read_at_feat_in_message
│  │  │  └─ migration.sql
│  │  ├─ 20251004074549_added_public_id_in_listing_image
│  │  │  └─ migration.sql
│  │  ├─ 20251021232519_added_public_id_in_user
│  │  │  └─ migration.sql
│  │  ├─ 20251024113653_added_darkmode_in_user
│  │  │  └─ migration.sql
│  │  ├─ 20251024141759_add_notification_system
│  │  │  └─ migration.sql
│  │  ├─ 20251029180959_add_push_subscription
│  │  │  └─ migration.sql
│  │  ├─ 20251107150457_removed_notification_feature
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  └─ seed.ts
├─ public
│  ├─ elegant-dining-set.png
│  ├─ favicon.ico
│  ├─ gaming-laptop.png
│  ├─ iphone-14-pro-max.png
│  ├─ luxury-quilted-handbag.png
│  ├─ noAvatar.png
│  ├─ placeholder-logo.png
│  ├─ placeholder-logo.svg
│  ├─ placeholder-user.jpg
│  ├─ placeholder.jpg
│  ├─ placeholder.svg
│  ├─ trek-mountain-bike.png
│  └─ vintage-leather-sofa.png
├─ scripts
│  └─ generate-vapid-keys.js
├─ src
│  ├─ app
│  │  ├─ api
│  │  │  ├─ listings
│  │  │  │  └─ [id]
│  │  │  │     └─ view
│  │  │  │        └─ route.ts
│  │  │  ├─ messages
│  │  │  │  └─ mark-read
│  │  │  │     └─ route.ts
│  │  │  ├─ upload
│  │  │  │  └─ route.ts
│  │  │  └─ user
│  │  │     └─ route.ts
│  │  ├─ auth
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  ├─ signup
│  │  │  │  └─ page.tsx
│  │  │  └─ signup-success
│  │  │     └─ page.tsx
│  │  ├─ browse
│  │  │  ├─ loading.tsx
│  │  │  └─ page.tsx
│  │  ├─ buying
│  │  │  └─ page.tsx
│  │  ├─ categories
│  │  │  └─ page.tsx
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ dashboard
│  │  │  ├─ analytics
│  │  │  │  └─ page.tsx
│  │  │  ├─ favorites
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ listings
│  │  │  │  ├─ [id]
│  │  │  │  │  ├─ UpdateListingForm.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ loading.tsx
│  │  │  ├─ messages
│  │  │  │  ├─ [id]
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ message-read-tracker.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ profile
│  │  │  │  └─ page.tsx
│  │  │  ├─ sell
│  │  │  │  ├─ SellForm.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ settings
│  │  │     └─ page.tsx
│  │  ├─ favorites
│  │  │  └─ page.tsx
│  │  ├─ globals.css
│  │  ├─ help
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ listing
│  │  │  └─ [id]
│  │  │     ├─ not-found.tsx
│  │  │     └─ page.tsx
│  │  ├─ page.tsx
│  │  ├─ privacy
│  │  │  └─ page.tsx
│  │  ├─ selling
│  │  │  └─ page.tsx
│  │  └─ terms
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ AnalyticsCard.tsx
│  │  ├─ CTASection.tsx
│  │  ├─ CategoryClient.tsx
│  │  ├─ CategoryGrid.tsx
│  │  ├─ ContactSellerButton.tsx
│  │  ├─ DashboardHeader.tsx
│  │  ├─ DashboardSidebar.tsx
│  │  ├─ DeletListingButton.tsx
│  │  ├─ EditLink.tsx
│  │  ├─ FavoriteButton.tsx
│  │  ├─ FavoriteClientPage.tsx
│  │  ├─ FeaturedListings.tsx
│  │  ├─ FeaturedListingsClient.tsx
│  │  ├─ FeaturedListingsLoading.tsx
│  │  ├─ Footer.tsx
│  │  ├─ Header.tsx
│  │  ├─ Hero.tsx
│  │  ├─ ImgeUpload.tsx
│  │  ├─ ListingDetailsClient.tsx
│  │  ├─ NotificationBell.tsx
│  │  ├─ ProfileInputForm.tsx
│  │  ├─ ReplyContainer.tsx
│  │  ├─ ServiceWorke.tsx
│  │  ├─ SettingForm.tsx
│  │  └─ theme-provider.tsx
│  ├─ hooks
│  │  ├─ ListingViewTracker.ts
│  │  ├─ UseMobile.ts
│  │  └─ use-toast.ts
│  └─ lib
│     ├─ CategoryUtils.ts
│     ├─ actions.ts
│     ├─ cloudinary.ts
│     ├─ prisma.ts
│     ├─ supabase
│     │  ├─ .middleware.ts.swp
│     │  ├─ admin.ts
│     │  ├─ client.ts
│     │  ├─ middleware.ts
│     │  └─ server.ts
│     ├─ utils.ts
│     └─ validations.ts
├─ tailwind.config.js
└─ tsconfig.json

```