drop policy if exists "Users can read their own profile" on public.profiles;

drop policy if exists "Published recipes are readable" on public.recipes;
drop policy if exists "Users can read own recipes and admins all recipes" on public.recipes;
create policy "Published recipes are readable by guests"
on public.recipes
for select
to anon
using (is_published = true);

create policy "Authenticated users can read visible recipes"
on public.recipes
for select
to authenticated
using (
  is_published = true
  or (select auth.uid()) = author_id
  or private.is_admin()
);

drop policy if exists "Admins can create recipes" on public.recipes;
drop policy if exists "Users can create own recipes" on public.recipes;
create policy "Authenticated users can create permitted recipes"
on public.recipes
for insert
to authenticated
with check (
  (select auth.uid()) = author_id
  or private.is_admin()
);

drop policy if exists "Published recipe category links are readable" on public.recipe_categories;
create policy "Published recipe category links are readable by guests"
on public.recipe_categories
for select
to anon
using (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_categories.recipe_id
      and recipes.is_published = true
  )
);

create policy "Authenticated users can read visible recipe category links"
on public.recipe_categories
for select
to authenticated
using (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_categories.recipe_id
      and (
        recipes.is_published = true
        or (select auth.uid()) = recipes.author_id
        or private.is_admin()
      )
  )
);

drop policy if exists "Admins can create user roles" on public.user_roles;
drop policy if exists "Users can create their own user role" on public.user_roles;
create policy "Authenticated users can create permitted user roles"
on public.user_roles
for insert
to authenticated
with check (
  ((select auth.uid()) = user_id and role = 'user')
  or private.is_admin()
);
