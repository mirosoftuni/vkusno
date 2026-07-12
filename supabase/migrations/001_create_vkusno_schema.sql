create schema if not exists private;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  bio text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin'))
);

create table public.categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0
);

create table public.recipes (
  id bigint generated always as identity primary key,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text,
  ingredients text[] not null default '{}',
  instructions text not null,
  prep_minutes integer not null default 0 check (prep_minutes >= 0),
  cook_minutes integer not null default 0 check (cook_minutes >= 0),
  servings integer not null default 1 check (servings > 0),
  difficulty text not null default 'easy' check (difficulty in ('easy', 'medium', 'hard')),
  cover_image_path text,
  external_image_url text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_categories (
  recipe_id bigint not null references public.recipes(id) on delete cascade,
  category_id bigint not null references public.categories(id) on delete cascade,
  primary key (recipe_id, category_id)
);

create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id bigint not null references public.recipes(id) on delete cascade,
  primary key (user_id, recipe_id)
);

create table public.reviews (
  id bigint generated always as identity primary key,
  recipe_id bigint not null references public.recipes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (recipe_id, user_id)
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function private.set_updated_at();

create trigger recipes_set_updated_at
before update on public.recipes
for each row
execute function private.set_updated_at();

create trigger reviews_set_updated_at
before update on public.reviews
for each row
execute function private.set_updated_at();

create index profiles_created_at_idx on public.profiles(created_at desc);

create index categories_sort_order_idx on public.categories(sort_order, name);

create index recipes_author_id_idx on public.recipes(author_id);
create index recipes_published_created_at_idx on public.recipes(created_at desc) where is_published = true;
create index recipes_featured_published_idx on public.recipes(is_featured, created_at desc) where is_published = true;
create index recipes_difficulty_idx on public.recipes(difficulty);

create index recipe_categories_category_id_idx on public.recipe_categories(category_id);

create index favorites_recipe_id_idx on public.favorites(recipe_id);

create index reviews_recipe_id_created_at_idx on public.reviews(recipe_id, created_at desc);
create index reviews_user_id_idx on public.reviews(user_id);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.categories enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_categories enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;

grant select on public.categories to anon, authenticated;
grant select on public.recipes to anon, authenticated;
grant select on public.recipe_categories to anon, authenticated;

create policy "Public categories are readable"
on public.categories
for select
to anon, authenticated
using (true);

create policy "Published recipes are readable"
on public.recipes
for select
to anon, authenticated
using (is_published = true);

create policy "Published recipe category links are readable"
on public.recipe_categories
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_categories.recipe_id
      and recipes.is_published = true
  )
);
