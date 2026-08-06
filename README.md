# Suivi — App de suivi de dépenses (PWA)

Phase 0 : scaffold Next.js + PWA + connexion Supabase.

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000. `.env.local` est déjà rempli avec l'URL et la clé
publique du projet Supabase "Suivi" — rien à configurer pour développer.

## Ce qui est en place (Phase 0)

- Next.js 15 (App Router, TypeScript, Tailwind v4)
- Manifest PWA (`public/manifest.json`) + icônes + service worker minimal
  (cache du shell uniquement — la vraie logique offline arrive en Phase 6)
- Thème clair/sombre : bascule dans `src/components/theme-provider.tsx`,
  préférence sauvegardée en `localStorage` (branchement sur la table
  `settings` prévu en Phase 1)
- Bottom tab bar mobile-native (`src/components/bottom-nav.tsx`) avec bouton
  "Ajouter" surélevé
- Client Supabase (`src/lib/supabase/client.ts`)
- Identité visuelle : encre profonde / or CFA / teal — polices Fraunces
  (titres), Space Grotesk (montants), Work Sans (interface)

## Important : pooling Supavisor

Le mode "transaction" (port 6543) ne concerne que les connexions **Postgres
directes** (Prisma, Drizzle, `pg`...). `@supabase/supabase-js` passe par
PostgREST en HTTPS, donc le pooling n'entre pas en jeu ici — rien à
configurer côté client pour l'instant. Si un ORM avec connexion SQL directe
est ajouté plus tard, utiliser la chaîne commentée dans `.env.local`.

## Prochaine étape (Phase 1)

CRUD dépenses + catégories + solde/cumul du mois en cours.
