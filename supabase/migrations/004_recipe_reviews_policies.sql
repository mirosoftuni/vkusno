grant select on public.profiles to anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant insert, update on public.reviews to authenticated;
grant usage, select on sequence public.reviews_id_seq to authenticated;

create policy "Public profiles are readable"
on public.profiles
for select
to anon, authenticated
using (true);

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
