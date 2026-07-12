grant select, insert on public.profiles to authenticated;
grant select, insert on public.user_roles to authenticated;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can read their own role"
on public.user_roles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own user role"
on public.user_roles
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and role = 'user'
);
