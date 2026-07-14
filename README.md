# Вкусно.bg

Курсов проект за multi-page кулинарен портал на български език. Приложението позволява разглеждане на рецепти, търсене и филтриране по категории, регистрация и вход, добавяне и редакция на рецепти, профилна страница, оценки с коментари и базов admin panel.

Проектът е вдъхновен от структурата на български рецептурни сайтове, но използва оригинален UI, оригинални примерни данни и собствена архитектура.

## Technologies

- Vite
- Vanilla JavaScript ES modules
- HTML и CSS
- Bootstrap 5
- Bootstrap Icons
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Supabase Row Level Security

## Screens / Pages

- `index.html` - начална страница с категории, търсене, нови рецепти и популярни рецепти.
- `recipe.html` - детайлна страница за рецепта по `slug`, с продукти, инструкции, рейтинг и коментари.
- `recipe-form.html` - форма за добавяне, редакция и изтриване на рецепти.
- `login.html` - вход със Supabase Auth.
- `register.html` - регистрация със създаване на профил и user роля.
- `profile.html` - профил, avatar upload, bio и списък с мои рецепти.
- `admin.html` - admin panel за роли, рецепти и категории.

## Architecture

Приложението е без React, Vue и TypeScript. Всеки HTML файл е отделен Vite entry point, конфигуриран във `vite.config.js`.

Основната JavaScript логика е в `src/main.js`, а достъпът до Supabase е отделен в service слой:

- `src/config/supabase.js` - Supabase client, env проверка и helper за public storage URL.
- `src/services/authService.js` - login, register, logout, профили и navbar auth state.
- `src/services/recipeService.js` - категории, рецепти, reviews, slug generation и CRUD операции.
- `src/services/storageService.js` - upload към `avatars` и `recipe-images`.
- `src/services/adminService.js` - admin dashboard заявки и admin операции.
- `src/components/recipeCard.js` - reusable card renderer за рецепти.

## Database Schema Summary

Основните таблици са:

- `profiles` - публична профилна информация за потребители: име, bio, avatar path и timestamps.
- `user_roles` - роля на потребител: `user` или `admin`.
- `categories` - категории с име, slug, описание и ред на сортиране.
- `recipes` - рецепти с автор, title, slug, описание, продукти, инструкции, време, порции, трудност, снимка и publish/featured flags.
- `recipe_categories` - many-to-many връзка между рецепти и категории.
- `favorites` - любими рецепти по потребител.
- `reviews` - оценки и коментари, като един потребител има една оценка за една рецепта.

Има индекси за foreign keys и чести заявки, trigger за `updated_at`, както и helper функции в `private` schema.

## Supabase Migrations Workflow

Локалните миграции са в `supabase/migrations`.

Текущият ред е:

- `001_create_vkusno_schema.sql`
- `002_auth_registration_policies.sql`
- `003_create_auth_user_profile_trigger.sql`
- `004_recipe_reviews_policies.sql`
- `005_recipe_crud_policies.sql`
- `006_recipe_category_policy_helper.sql`
- `007_profile_storage_policies.sql`
- `008_add_rls_and_storage_policies.sql`
- `009_remove_public_storage_listing_policies.sql`
- `010_security_refinements.sql`

При нова промяна в базата:

1. Създай нов SQL файл със следващ номер в `supabase/migrations`.
2. Пиши само идемпотентни или ясно приложими DDL промени.
3. Приложи миграцията през Supabase MCP или Supabase CLI.
4. Пусни security и performance advisors.
5. Ако има реални warning-и, добави нова миграция за поправка.

Seed данните са в `supabase/seed.sql` и съдържат оригинални български категории, рецепти, reviews и favorites.

## Local Setup

Инсталиране на dependencies:

```bash
npm install
```

Създай `.env` файл по примера от `.env.example`:

```env
VITE_APP_NAME="Вкусно"
VITE_API_URL="http://localhost:3000"
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
```

Стартиране в development режим:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview на build:

```bash
npm run preview
```

## Demo Credentials

Seed файлът очаква тези Supabase Auth потребители да съществуват:

- `demo@example.com` - обикновен потребител.
- `admin@example.com` - admin потребител.
- `test@test.com` - обикновен тестов потребител.

Паролите не се съхраняват в проекта. Създай потребителите и паролите им през Supabase Dashboard -> Authentication -> Users, след което изпълни `supabase/seed.sql`.

## Deployment Instructions

1. Създай Supabase проект.
2. Приложи миграциите от `supabase/migrations` в правилния ред.
3. Създай Auth demo users, ако ще използваш seed данните.
4. Изпълни `supabase/seed.sql`.
5. Създай Storage buckets:
   - `avatars`
   - `recipe-images`
6. Настрой production env променливите:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
7. Изпълни `npm run build`.
8. Deploy-ни съдържанието на `dist` във Vercel, Netlify, GitHub Pages или друг static hosting.

## Admin Capabilities

Admin достъпът се определя от `public.user_roles`, не от user metadata.

Admin panel-ът позволява:

- преглед на потребители;
- смяна на роля `user` / `admin`;
- преглед на рецепти;
- toggle на `is_published`;
- toggle на `is_featured`;
- добавяне и редакция на категории;
- линк към редакция на рецепта.

Ако потребителят не е admin, `admin.html` показва warning съобщение на български.

## Storage Usage

Използват се два Supabase Storage bucket-а:

- `avatars` - профилни снимки.
- `recipe-images` - снимки на рецепти.

Upload path-овете започват с `auth.uid()` / текущия `user.id`, например:

```text
<user-id>/avatar-...
<user-id>/recipe-...
```

Frontend-ът използва само publishable key и public URL helper. `service_role` key не се използва и не трябва да се добавя във frontend код.

## Security / RLS

Всички public таблици са с включен Row Level Security.

Основни правила:

- Публичните потребители могат да четат категории и публикувани рецепти.
- Authenticated потребители могат да създават свои рецепти, reviews и favorites.
- Owner може да редактира и изтрива собствените си рецепти.
- Admin може да управлява рецепти, категории и роли.
- `user_roles` се използва за authorization.
- Не се използва `user_metadata` за authorization.
- Helper функциите са в `private` schema и имат фиксиран `search_path`.
- Няма публично изпълними `SECURITY DEFINER` функции в `public` schema.
- Storage upload policies ограничават upload-а до папка на текущия потребител.

## Project Notes

UI текстовете са на български. Визията използва Bootstrap компоненти, responsive layout, кулинарни категории, cards, icons и портал-ориентирана структура.
