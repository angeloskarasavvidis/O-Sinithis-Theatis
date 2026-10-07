-- Drafts and scheduling for posts. Run once in the Supabase SQL editor.
-- Safe to run again: every step checks whether it has already been done.

-- 1. Every post gets a status. Existing posts stay published.
alter table public.posts add column if not exists status text not null default 'published';

alter table public.posts drop constraint if exists posts_status_check;
alter table public.posts add constraint posts_status_check check (status in ('draft', 'published'));

-- 2. Replace the rules for who may READ posts. Rules for writing are not touched.
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'posts' and cmd = 'SELECT'
  loop
    execute format('drop policy %I on public.posts', p.policyname);
  end loop;
end $$;

-- Visitors see a post only if it is published and its date has arrived.
create policy "Visitors read live posts" on public.posts
  for select
  using (status = 'published' and date::timestamptz <= now());

-- A logged-in admin sees everything, drafts and scheduled posts included.
create policy "Logged-in admin reads every post" on public.posts
  for select to authenticated
  using (true);

-- 3. Show the result: the rules now on the table, and whether row security is on (must be true).
select policyname, cmd, roles::text, qual from pg_policies where schemaname = 'public' and tablename = 'posts'
union all
select 'row security enabled', '', '', relrowsecurity::text from pg_class where oid = 'public.posts'::regclass;
