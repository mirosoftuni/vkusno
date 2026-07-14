# Copilot / Codex Instructions

This repository is a Bulgarian multi-page Vanilla JavaScript Vite app for recipes. Keep changes aligned with the existing architecture.

## Core Rules

- Use Vanilla JavaScript ES modules only.
- Do not add React, Vue, TypeScript, JSX or a frontend framework.
- Use Bootstrap and Bootstrap Icons for UI components and icons.
- Keep all visible UI text in Bulgarian.
- Preserve the multi-page structure: each page is a separate `.html` entry.
- Keep shared styling in `src/styles.css`.
- Prefer small, page-oriented functions over large abstractions.

## Supabase Architecture

- Use `src/config/supabase.js` for the Supabase client.
- Read Supabase config only from Vite env variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- Never use or expose a `service_role` key in frontend code.
- Do not hardcode project secrets, access tokens or database passwords.
- Put Supabase queries in service modules, not directly inside HTML files.
- Existing service modules:
  - `authService.js`
  - `recipeService.js`
  - `storageService.js`
  - `adminService.js`

## Database And RLS

- All schema changes must be added as SQL migrations in `supabase/migrations`.
- Use the next sequential migration number; do not create duplicate prefixes.
- Keep RLS enabled for public tables.
- Authorization must use database state such as `user_roles`, ownership columns and `auth.uid()`.
- Do not use `user_metadata` for authorization decisions.
- Do not use `auth.role()` in policies; use `TO anon` and `TO authenticated`.
- Keep privileged helper functions in `private` schema.
- SECURITY DEFINER functions must have a fixed `search_path`.
- Do not create publicly executable SECURITY DEFINER functions in `public` schema.
- Add indexes for foreign keys and common query filters.

## Storage

- Use `storageService.js` for uploads and public URL helpers.
- Supported buckets:
  - `avatars`
  - `recipe-images`
- Uploaded object paths must start with the current user's id.
- Storage policies should not allow broad object listing unless the product explicitly needs it.

## UI And UX

- The app is a culinary portal named `Вкусно.bg`.
- Use responsive Bootstrap layout.
- Use Bulgarian labels, alerts, buttons and validation messages.
- Use Bootstrap Icons for actions where appropriate.
- Keep forms accessible with labels and meaningful button text.
- Avoid adding marketing-style landing pages when the task is to build app functionality.

## Verification

- Run `npm run build` after code or documentation changes that may affect the app.
- For Supabase changes, also run security/performance advisors when available.
