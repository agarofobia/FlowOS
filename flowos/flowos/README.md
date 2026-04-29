# FlowOS

> El sistema operativo de tu empresa. Org chart, proyectos, wiki y CRM en una sola herramienta.

Construido con **Next.js 15**, **Clerk** (auth + organizations), **Stripe** (suscripciones), **Drizzle + Supabase Postgres** (DB) y **React Flow** (canvas del org chart).

---

## 🚀 Setup rápido

```bash
npm install
cp .env.example .env.local
# completá las variables (ver más abajo)
npm run dev
```

App en `http://localhost:3000`.

## 📦 Scripts

| Comando | Hace |
|---|---|
| `npm run dev` | Levanta dev server con hot reload |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build |
| `npm run db:generate` | Genera migraciones de Drizzle desde schema.ts |
| `npm run db:push` | Aplica el schema directo a la DB (dev only) |

---

## 🔑 Variables de entorno

### Clerk
1. Crear app en [dashboard.clerk.com](https://dashboard.clerk.com)
2. **Activar Organizations** en Configure → Organizations → ON
3. **Copiar claves** desde API Keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. **Configurar webhook** apuntando a `https://tu-dominio/api/webhooks/clerk`
   - Eventos: `user.created`, `organization.created`, `organization.deleted`
   - Copiar el signing secret a `CLERK_WEBHOOK_SECRET`

### Stripe
1. **Productos ya creados** en tu cuenta (vía MCP):
   - FlowOS Pro: `prod_UQ3Z39vWZoMfVt`
   - FlowOS Enterprise: `prod_UQ3Z0IfuVZVTYa`
2. **Copiar claves** desde [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys
3. **Configurar webhook** apuntando a `https://tu-dominio/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. **Activar Customer Portal** en Settings → Customer Portal

### Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Settings → Database → Connection string → mode `transaction` (puerto 6543)
3. `npm run db:push` para crear las tablas

---

## 📐 Arquitectura

```
src/
├── app/                   # App Router de Next.js
│   ├── page.tsx           # Landing
│   ├── sign-in, sign-up   # Auth (Clerk)
│   ├── onboarding         # Crear primera org
│   ├── select-org         # Switcher cuando hay varias
│   ├── dashboard/         # App protegida
│   │   ├── page.tsx       # Home con stats
│   │   ├── orgchart/      # Canvas con React Flow
│   │   ├── team/          # Gestión de miembros
│   │   ├── billing/       # Stripe checkout + portal
│   │   └── settings/      # Org settings
│   └── api/
│       ├── billing/       # checkout + portal
│       └── webhooks/      # stripe + clerk
├── components/            # UI reutilizable
├── db/                    # Drizzle schema + cliente
├── lib/                   # plans, stripe, utils
├── middleware.ts          # Clerk auth + redirects
└── styles/globals.css     # Design tokens editorial
```

### Multi-tenant
- **Auth + orgs** delegados a Clerk (gratis hasta 100 orgs activas)
- Cada query a la DB filtra por `organizationId = orgId` del request
- Supabase RLS opcional para defense-in-depth

### Pagos
- Productos y prices creados en Stripe
- Checkout server-side en `/api/billing/create-checkout`
- Webhook actualiza `org.publicMetadata.plan` en Clerk
- UI lee `useOrganization().organization.publicMetadata.plan`

---

## 🌐 Deploy a Vercel

1. Push a GitHub
2. Import en Vercel
3. Pegar todas las env vars
4. Deploy

Después:
- Apuntar dominio `flowos.io` (o el que sea) a Vercel
- Actualizar `NEXT_PUBLIC_APP_URL` con el dominio final
- Reconfigurar webhooks de Stripe y Clerk con la URL pública

---

## 🎨 Design

Estética editorial / arquitectónica:
- Display: **Instrument Serif** (Google Fonts)
- Body: **Inter Tight**
- Mono: **JetBrains Mono**
- Paleta: paper warm + ink negro cálido + ocre + rust + moss

No es generic-AI-SaaS. Tiene carácter.

---

## 🪪 Licencia

Propietario. © 2026 Insureline MutualAid.
