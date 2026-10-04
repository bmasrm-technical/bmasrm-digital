# BMASRM.digital V1

BMASRM.digital is a premium digital studio website with a public conversion platform and a private owner administration panel.

## Prerequisites

- Node.js 20.x or newer
- npm 10.x or newer
- A Supabase project (PostgreSQL + Auth + Storage)

## Installation & Setup

1. **Install dependencies:**
   ```bash
   cd bmasrm-digital
   npm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase project credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
   NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/bmasrm.digital
   NEXT_PUBLIC_CONTACT_EMAIL=contact@bmasrm.digital
   RESEND_API_KEY=
   NOTIFY_EMAIL=
   ```

3. **Database & SQL Setup Order:**
   - Execute `schema.sql` in your **Supabase Dashboard > SQL Editor**.
   - Create your owner admin auth user in **Supabase Dashboard > Authentication > Users > Add user**.
   - Add your user ID to the `public.admins` table by running:
     ```sql
     insert into public.admins (user_id, email)
     select id, email from auth.users where email = 'your-admin-email@example.com'
     on conflict (user_id) do nothing;
     ```

4. **Run Locally:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Access Admin Panel

1. Navigate to `http://localhost:3000/admin/login`
2. Log in using the email and password created in Supabase Authentication.
3. Once logged in, you can manage enquiries, update status & notes, CRUD portfolio works, view traffic analytics, and stream Excel `.xlsx` reports.

## Routes Directory

### Public Routes
- `/` - Home conversion landing with 3D intro, service cards, featured case studies, and CTAs
- `/services/website-building` - Signature Build & Managed Website options, pricing terms, direct enquiry links
- `/services/video-editing` - Long-form video editing rules (5+ min policy enforced) & portfolio
- `/works` - Full portfolio gallery with category filters (All / Websites / Videos)
- `/works/[slug]` - Deep case studies with challenge, solution, results, YouTube embed, & live preview links
- `/contact` - High-conversion consultation form with phone normalizer, rate limiter, and honeypot
- `/thank-you` - Post-submission confirmation ("We will call you within 24 hours")
- `/robots.txt` & `/sitemap.xml` - Search engine optimization indexing public routes & published works

### Private Owner Administration Panel
- `/admin/login` - Secure credentials login via Supabase Auth
- `/admin` - Analytics summary, conversion rate, top pages, & recent enquiries
- `/admin/enquiries` - Inquiries manager (Website, Video, and Customers tabs) with direct tel: calling, instant status updates, notes, and follow-up date picker
- `/admin/works` - Portfolio works list with published toggle, sorting, and deletion
- `/admin/works/new` - Create portfolio work with Supabase Storage media upload
- `/admin/works/[id]` - Edit case study information and media
- `/admin/analytics` - First-party traffic trends, views/unique visitors, and conversion funnel
- `/admin/export` - Direct Excel `.xlsx` generator streaming 3 sheets (Customers, Website Bookings, Video Bookings) with formula-injection sanitization

### API Route
- `/api/track` - Anonymous first-party page view & visitor logging

## Placeholders Reference for the Owner

The following values can be edited directly in `.env.local` and `src/config/site.ts`:

1. **Supabase Credentials (`.env.local`)**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. **Contact Direct Links (`.env.local`)**:
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: Direct WhatsApp link digits (with country code, e.g. 919876543210)
   - `NEXT_PUBLIC_INSTAGRAM_URL`: Studio Instagram profile URL
   - `NEXT_PUBLIC_CONTACT_EMAIL`: Studio inquiry email address
3. **Optional Email Notification (`.env.local`)**:
   - `RESEND_API_KEY`: API key from resend.com
   - `NOTIFY_EMAIL`: Email where new consultation alerts are received
4. **Site Copy & Plan Starting Price (`src/config/site.ts`)**:
   - `plans.managedWebsite.managedMonthlyFrom`: Optional monthly starting rate text (leave empty to show only custom pricing text)

## Hosting Later (Production Checklist)

When deploying to Vercel, Netlify, or custom VPS:
1. Configure all environment variables in your hosting provider's secret settings.
2. Update `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://bmasrm.digital`).
3. Update Supabase Site URL in **Supabase Dashboard > Authentication > URL Configuration** to match your production domain.

