# E-commerce Next.js

Tienda online construida con Next.js 15 (App Router) + React 19, Prisma/PostgreSQL, NextAuth v5, y pagos vía Stripe y PayPal. Proyecto de práctica (curso Udemy) sobre el que se ha ido añadiendo funcionalidad más allá del temario original (Stripe, envío de emails con React Email, etc.).

## Stack

| Área | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router, Server Actions) + React 19 |
| Base de datos | PostgreSQL + Prisma ORM (driver adapter Neon disponible) |
| Auth | NextAuth v5 (beta) con `CredentialsProvider` + `PrismaAdapter`, sesión JWT |
| UI | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Formularios | react-hook-form + Zod |
| Pagos | Stripe (`@stripe/stripe-js`, `stripe`) y PayPal (`@paypal/react-paypal-js`) |
| Email | React Email + Resend |
| Uploads | UploadThing |
| Tests | Jest + ts-jest |

## Estructura de carpetas

```
app/                        Rutas (App Router), agrupadas por route groups
├─ (auth)/                  sign-in, sign-up
├─ (root)/                  tienda pública: home, cart, checkout, pedidos
├─ admin/                   panel de administración (productos, pedidos, usuarios, overview)
├─ user/                    área de cuenta del usuario
└─ api/                     route handlers reales: NextAuth, UploadThing, webhook de Stripe

core/                       Intento de arquitectura por capas (parcial, ver mejoras)
├─ domain/enums/            solo `Role`
├─ infrastructure/          validadores Zod y tipos compartidos (NO repositorios/DB)
└─ presentation/
   └─ actions/              Server Actions por dominio (auth, cart, order, product, review, user)

components/
├─ ui/                      primitives de shadcn/ui
└─ shared/                  todos los componentes de feature (auth, cart, order, product, shipping, admin, user, providers) + header, footer

lib/                        utilidades transversales + integraciones (stripe, paypal, uploadthing, encrypt, authguard)
db/                         cliente Prisma (`prisma.ts`) y seed
prisma/                     schema.prisma + migraciones
email/                      plantillas React Email (Purchase Receipt)
types/                      augmentación de tipos (next-auth.d.ts)
tests/                      Jest (actualmente solo `paypal.test.ts`)
.agents/skills/             skills de referencia para agentes (Next, React, Prisma, Stripe, Zod, shadcn, a11y, etc.)
```

## Modelo de datos (Prisma)

`User` (+ `Account`/`Session` de NextAuth) — `Product` — `Cart` — `Order` / `OrderItem` — `Review`.
Precios y ratings se guardan como `Decimal` y se convierten a `string` vía `$extends` en el cliente Prisma para evitar problemas de serialización con Server Components.

## Flujos principales

- **Auth**: `auth.config.ts` protege rutas por regex en el `middleware`; `auth.ts` añade el provider de credenciales, adapta el carrito de invitado (`sessionCartId`) al usuario al iniciar sesión, y expone `role`/`id` en la sesión JWT.
- **Checkout**: carrito → shipping address → payment method (Stripe / PayPal / Cash on Delivery) → place order → confirmación (`stripe-payment-success` para Stripe).
- **Admin**: gestión de productos (con `ProductForm` + UploadThing para imágenes), pedidos (marcar pagado/entregado) y usuarios, protegido con `requireAdmin()`.

## Mejoras estructurales

### Aplicadas
- **Componentes consolidados**: `core/presentation/components/*` se eliminó; todo vive ahora en `components/shared/*` (un único árbol: `components/ui` para shadcn, `components/shared/{feature}` para el resto).
- **Cliente Prisma único**: se eliminó `db/neon-prisma.ts` (código muerto, sin ninguna importación en el repo). Solo queda `db/prisma.ts`.
- **Cliente Stripe único**: `new Stripe(...)` estaba triplicado (webhook, página de éxito de pago, `order/[id]/page.tsx`). Ahora vive en [lib/stripe.ts](lib/stripe.ts) como singleton, siguiendo el mismo patrón que `lib/paypal/index.ts`.
- **`tests/` y `db/mock/` ya no están en `.gitignore`**: estaban excluidos por error (probablemente pensado para `coverage/`, que ya está cubierto aparte), lo que impedía commitear `tests/paypal.test.ts` y el seed data que `db/seed.ts` necesita.
- **`.env.example` limpio**: se quitó la `DATABASE_URL` real de Neon que estaba comentada (usuario+contraseña reales) y se añadió `STRIPE_WEBHOOK_SECRET`, que el webhook requiere pero no estaba documentado.

### Pendientes
1. **`core/` sugiere Clean Architecture pero no la implementa.** `domain/` solo tiene un enum, `infrastructure/` solo tiene validadores Zod y tipos (nada de acceso a datos), y `presentation/actions/*` llaman a `prisma` directamente. Requiere decisión de diseño explícita (puertos/repositorios reales en `infrastructure`, casos de uso en un nuevo `application/`) antes de tocar código — está fuera del alcance de esta ronda de limpieza mecánica.
2. **Server Actions como capa de datos.** Ligado al punto anterior: extraer las queries de `product.actions.ts`, `cart.actions.ts`, etc. a repositorios testeables por separado.
3. **`lib/` como cajón de sastre**: mezcla utilidades genéricas (`utils.ts`, `constants`) con seguridad (`encrypt.ts`, `authguard.ts`) e integraciones de terceros (`stripe.ts`, `paypal/`, `uploadthing.ts`). Baja prioridad mientras el punto 1 no se resuelva.

## Scripts

```bash
npm run dev          # servidor de desarrollo
npm run dev:turbo    # con Turbopack
npm run build         
npm run test          # Jest
npm run email          # preview de plantillas React Email (puerto 3001)
```
