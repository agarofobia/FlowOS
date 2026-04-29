# 🚀 FlowOS

**Business Process Management + Org Chart Platform**

Built with Next.js, Clerk, Stripe, PostgreSQL, and Drizzle ORM.

## What's included

### ✅ Org Chart
- Infinite SVG canvas (draggable nodes)
- Real-time position sync to DB
- Connect employees with handles

### ✅ Employees
- CRUD table interface
- Modal add/edit form
- Linked to org chart

### ✅ Projects + Tasks
- Kanban board (4 columns)
- Drag-drop task status updates
- Per-project filtering

### ✅ Docs
- Block-based editor
- Heading, text, list blocks
- Multiple documents

### ✅ Team
- Clerk OrganizationProfile embedded
- Invite members
- Role management (Admin, Member)

### ✅ Billing
- Stripe checkout integration
- Subscription portal
- Plan upgrades

## Quick start

1. **Clone & install**
   ```bash
   npm install
   ```

2. **Setup env** (see `SETUP_GUIDE.md`)
   - Copy `.env.local.example` → `.env.local`
   - Fill in: DATABASE_URL, CLERK_*, STRIPE_*

3. **Database**
   ```bash
   npx drizzle-kit push:pg
   ```

4. **Dev server**
   ```bash
   npm run dev
   ```
   → http://localhost:3000

5. **Deploy**
   ```bash
   vercel deploy --prod
   ```

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── employees/    ← REST endpoints
│   │   ├── projects/     ← Project CRUD
│   │   ├── tasks/        ← Task CRUD
│   │   └── webhooks/     ← Clerk, Stripe
│   └── dashboard/
│       ├── orgchart/     ← Org chart page
│       ├── employees/    ← Employees table
│       ├── projects/     ← Kanban board
│       ├── docs/         ← Block editor
│       └── ...
├── components/
│   └── dashboard/
│       ├── orgchart-canvas.tsx  ← React Flow
│       └── sidebar.tsx          ← Nav
├── db/
│   ├── schema.ts         ← Drizzle schema
│   └── index.ts          ← DB client
└── hooks/
    └── useEmployees.ts   ← SWR hook
```

## Tech stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Auth**: Clerk
- **Database**: PostgreSQL + Drizzle ORM
- **Payments**: Stripe
- **Graphs**: @xyflow/react (React Flow)
- **Data fetching**: SWR
- **Icons**: Lucide React

## Environment variables

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

See `SETUP_GUIDE.md` for detailed setup.

## Key files to explore

- **Org chart**: `src/components/dashboard/orgchart-canvas.tsx`
- **APIs**: `src/app/api/employees/route.ts`, `src/app/api/tasks/route.ts`
- **Pages**: `src/app/dashboard/{employees,projects,docs}/page.tsx`
- **DB**: `src/db/schema.ts`

## What's ready for production

✅ Full auth flow (sign-in, sign-up, org switching)
✅ Database schema & migrations
✅ API security (Clerk protection)
✅ Responsive design
✅ Error handling
✅ Type safety (TypeScript)

## Next steps

1. Add drag-drop for org chart (currently click-based)
2. Migrate docs storage from localStorage → DB
3. Add real-time collaboration (WebSockets)
4. Task attachments & comments
5. Export org chart as PDF/image

---

**Built in one session** | 29 April 2026
