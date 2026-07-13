create schema if not exists private;

create or replace function private.can_manage_recipe(target_recipe_id bigint)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.recipes
    where recipes.id = target_recipe_id
      and (
        recipes.author_id = (select auth.uid())
        or exists (
          select 1
          from public.user_roles
          where user_roles.user_id = (select auth.uid())
            and user_roles.role = 'admin'
        )
      )
  );
$$;

revoke all on function private.can_manage_recipe(bigint) from public;
grant usage on schema private to authenticated;
grant execute on function private.can_manage_recipe(bigint) to authenticated;

drop policy if exists "Owners and admins can create recipe category links" on public.recipe_categories;
drop policy if exists "Owners and admins can update recipe category links" on public.recipe_categories;
drop policy if exists "Owners and admins can delete recipe category links" on public.recipe_categories;

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
