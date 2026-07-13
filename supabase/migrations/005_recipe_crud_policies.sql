grant select, insert, update, delete on public.recipes to authenticated;
grant usage, select on sequence public.recipes_id_seq to authenticated;
grant select, insert, update, delete on public.recipe_categories to authenticated;

create policy "Users can read own recipes and admins all recipes"
on public.recipes
for select
to authenticated
using (
  (select auth.uid()) = author_id
  or exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);

create policy "Users can create own recipes"
on public.recipes
for insert
to authenticated
with check ((select auth.uid()) = author_id);

create policy "Owners and admins can update recipes"
on public.recipes
for update
to authenticated
using (
  (select auth.uid()) = author_id
  or exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  )
)
with check (
  (select auth.uid()) = author_id
  or exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);

create policy "Owners and admins can delete recipes"
on public.recipes
for delete
to authenticated
using (
  (select auth.uid()) = author_id
  or exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);

create policy "Owners and admins can create recipe category links"
on public.recipe_categories
for insert
to authenticated
with check (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_categories.recipe_id
      and (
        recipes.author_id = (select auth.uid())
        or exists (
          select 1
          from public.user_roles
          where user_id = (select auth.uid())
            and role = 'admin'
        )
      )
  )
);

create policy "Owners and admins can update recipe category links"
on public.recipe_categories
for update
to authenticated
using (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_categories.recipe_id
      and (
        recipes.author_id = (select auth.uid())
        or exists (
          select 1
          from public.user_roles
          where user_id = (select auth.uid())
            and role = 'admin'
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_categories.recipe_id
      and (
        recipes.author_id = (select auth.uid())
        or exists (
          select 1
          from public.user_roles
          where user_id = (select auth.uid())
            and role = 'admin'
        )
      )
  )
);

create policy "Owners and admins can delete recipe category links"
on public.recipe_categories
for delete
to authenticated
using (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_categories.recipe_id
      and (
        recipes.author_id = (select auth.uid())
        or exists (
          select 1
          from public.user_roles
          where user_id = (select auth.uid())
            and role = 'admin'
        )
      )
  )
);

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do update
set public = excluded.public;

create policy "Recipe images are publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'recipe-images');

create policy "Authenticated users can upload recipe images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'recipe-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
