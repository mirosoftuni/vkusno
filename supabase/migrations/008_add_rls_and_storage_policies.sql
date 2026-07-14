create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(
    exists (
      select 1
      from public.user_roles
      where user_id = (select auth.uid())
        and role = 'admin'
    ),
    false
  );
$$;

create or replace function private.can_manage_recipe(target_recipe_id bigint)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(
    exists (
      select 1
      from public.recipes
      where recipes.id = target_recipe_id
        and (
          recipes.author_id = (select auth.uid())
          or private.is_admin()
        )
    ),
    false
  );
$$;

revoke all on function private.is_admin() from public;
revoke all on function private.can_manage_recipe(bigint) from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.can_manage_recipe(bigint) to authenticated;

alter table public.categories enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_categories enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;
alter table public.user_roles enable row level security;

grant select on public.categories to anon, authenticated;
grant select on public.recipes to anon, authenticated;
grant select on public.recipe_categories to anon, authenticated;
grant select on public.reviews to anon, authenticated;

grant insert, update, delete on public.categories to authenticated;
grant insert, update, delete on public.recipes to authenticated;
grant insert, update, delete on public.recipe_categories to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant insert, update, delete on public.reviews to authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;

grant usage, select on sequence public.categories_id_seq to authenticated;
grant usage, select on sequence public.recipes_id_seq to authenticated;
grant usage, select on sequence public.reviews_id_seq to authenticated;

drop policy if exists "Public categories are readable" on public.categories;
drop policy if exists "Admins can create categories" on public.categories;
drop policy if exists "Admins can update categories" on public.categories;
drop policy if exists "Admins can delete categories" on public.categories;

create policy "Public categories are readable"
on public.categories
for select
to anon, authenticated
using (true);

create policy "Admins can create categories"
on public.categories
for insert
to authenticated
with check (private.is_admin());

create policy "Admins can update categories"
on public.categories
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Admins can delete categories"
on public.categories
for delete
to authenticated
using (private.is_admin());

drop policy if exists "Published recipes are readable" on public.recipes;
drop policy if exists "Users can read own recipes and admins all recipes" on public.recipes;
drop policy if exists "Users can create own recipes" on public.recipes;
drop policy if exists "Admins can create recipes" on public.recipes;
drop policy if exists "Owners and admins can update recipes" on public.recipes;
drop policy if exists "Owners and admins can delete recipes" on public.recipes;

create policy "Published recipes are readable"
on public.recipes
for select
to anon, authenticated
using (is_published = true);

create policy "Users can read own recipes and admins all recipes"
on public.recipes
for select
to authenticated
using (
  (select auth.uid()) = author_id
  or private.is_admin()
);

create policy "Users can create own recipes"
on public.recipes
for insert
to authenticated
with check ((select auth.uid()) = author_id);

create policy "Admins can create recipes"
on public.recipes
for insert
to authenticated
with check (private.is_admin());

create policy "Owners and admins can update recipes"
on public.recipes
for update
to authenticated
using (
  (select auth.uid()) = author_id
  or private.is_admin()
)
with check (
  (select auth.uid()) = author_id
  or private.is_admin()
);

create policy "Owners and admins can delete recipes"
on public.recipes
for delete
to authenticated
using (
  (select auth.uid()) = author_id
  or private.is_admin()
);

drop policy if exists "Published recipe category links are readable" on public.recipe_categories;
drop policy if exists "Owners and admins can create recipe category links" on public.recipe_categories;
drop policy if exists "Owners and admins can update recipe category links" on public.recipe_categories;
drop policy if exists "Owners and admins can delete recipe category links" on public.recipe_categories;

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

create policy "Owners and admins can create recipe category links"
on public.recipe_categories
for insert
to authenticated
with check (private.can_manage_recipe(recipe_id));

create policy "Owners and admins can update recipe category links"
on public.recipe_categories
for update
to authenticated
using (private.can_manage_recipe(recipe_id))
with check (private.can_manage_recipe(recipe_id));

create policy "Owners and admins can delete recipe category links"
on public.recipe_categories
for delete
to authenticated
using (private.can_manage_recipe(recipe_id));

drop policy if exists "Users can read their own favorites" on public.favorites;
drop policy if exists "Users can create their own favorites" on public.favorites;
drop policy if exists "Users can delete their own favorites" on public.favorites;

create policy "Users can read their own favorites"
on public.favorites
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own favorites"
on public.favorites
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.recipes
    where recipes.id = favorites.recipe_id
      and recipes.is_published = true
  )
);

create policy "Users can delete their own favorites"
on public.favorites
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Published recipe reviews are readable" on public.reviews;
drop policy if exists "Users can create their own reviews" on public.reviews;
drop policy if exists "Users can update their own reviews" on public.reviews;
drop policy if exists "Users can delete their own reviews" on public.reviews;

create policy "Published recipe reviews are readable"
on public.reviews
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.recipes
    where recipes.id = reviews.recipe_id
      and recipes.is_published = true
  )
);

create policy "Users can create their own reviews"
on public.reviews
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.recipes
    where recipes.id = reviews.recipe_id
      and recipes.is_published = true
  )
);

create policy "Users can update their own reviews"
on public.reviews
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own reviews"
on public.reviews
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their own role" on public.user_roles;
drop policy if exists "Users can create their own user role" on public.user_roles;
drop policy if exists "Admins can create user roles" on public.user_roles;
drop policy if exists "Admins can update user roles" on public.user_roles;
drop policy if exists "Admins can delete user roles" on public.user_roles;

create policy "Users can read their own role"
on public.user_roles
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or private.is_admin()
);

create policy "Users can create their own user role"
on public.user_roles
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and role = 'user'
);

create policy "Admins can create user roles"
on public.user_roles
for insert
to authenticated
with check (private.is_admin());

create policy "Admins can update user roles"
on public.user_roles
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Admins can delete user roles"
on public.user_roles
for delete
to authenticated
using (private.is_admin());

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('recipe-images', 'recipe-images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Avatars are publicly readable" on storage.objects;
drop policy if exists "Recipe images are publicly readable" on storage.objects;
drop policy if exists "Authenticated users can upload avatars" on storage.objects;
drop policy if exists "Authenticated users can upload recipe images" on storage.objects;

create policy "Authenticated users can upload avatars"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Authenticated users can upload recipe images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'recipe-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
