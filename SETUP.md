# ALC App — Setup Guide

## Prerequisites
- Node.js 18+
- Supabase account
- Vercel account

## 1. Supabase Setup (5 minutes)

1. Go to https://supabase.com → New Project
2. Name: alc-app | Region: us-east-1
3. Copy your project URL and keys

4. Run migrations in this order via Supabase SQL Editor:
   - supabase/migrations/001_initial_schema.sql
   - supabase/migrations/002_seed_grade4_standards.sql
   - supabase/migrations/003_rls_policies.sql

5. Under Authentication → Providers → Email: ensure Email/Password is enabled

## 2. Local Development

```bash
cp .env.example .env.local
# Fill in your Supabase URL and keys in .env.local

npm install
npm run dev
# Open http://localhost:3000
```

## 3. Vercel Deployment

1. Push repo to GitHub (SparkwaveAI1/alc-app)
2. Import to Vercel: vercel.com/new
3. Add env vars:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
4. Deploy
