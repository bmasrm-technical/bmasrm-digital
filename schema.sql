-- =====================================================================
-- BMASRM.digital  |  V1 schema + RLS   (run once in Supabase SQL Editor)
-- =====================================================================
create extension if not exists pgcrypto;

-- ---------- helper: updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ---------- admins ----------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- SHEET 1: customers ----------
create table if not exists public.customers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 2 and 80),
  phone      text not null unique check (char_length(phone) between 8 and 20),
  email      text check (email is null or char_length(email) <= 120),
  created_at timestamptz not null default now()
);

-- ---------- SHEET 2: website bookings ----------
create table if not exists public.website_bookings (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid not null references public.customers(id) on delete cascade,
  plan            text not null default 'not_sure'
                  check (plan in ('signature_build','managed_website','not_sure')),
  project_details text check (project_details is null or char_length(project_details) <= 1000),
  status          text not null default 'new' check (status in ('new','called','won','lost')),
  notes           text check (notes is null or char_length(notes) <= 4000),
  follow_up_date  date,
  source_page     text,
  pages_viewed    text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------- SHEET 3: video editing bookings ----------
create table if not exists public.editing_bookings (
  id                     uuid primary key default gen_random_uuid(),
  customer_id            uuid not null references public.customers(id) on delete cascade,
  video_duration_minutes integer not null check (video_duration_minutes >= 5),
  project_details        text check (project_details is null or char_length(project_details) <= 1000),
  status                 text not null default 'new' check (status in ('new','called','won','lost')),
  notes                  text check (notes is null or char_length(notes) <= 4000),
  follow_up_date         date,
  source_page            text,
  pages_viewed           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------- works (portfolio) ----------
create table if not exists public.works (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category      text not null check (category in ('website','video')),
  client_name   text,
  summary       text,
  challenge     text,
  solution      text,
  result        text,
  thumbnail_url text,
  video_url     text,
  live_url      text,
  featured      boolean not null default false,
  published     boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------- analytics (anonymous, no IP, no location) ----------
create table if not exists public.visitors (
  id         uuid primary key,
  first_seen timestamptz not null default now(),
  last_seen  timestamptz not null default now()
);

create table if not exists public.page_views (
  id         bigint generated always as identity primary key,
  visitor_id uuid not null references public.visitors(id) on delete cascade,
  path       text not null check (char_length(path) <= 200),
  created_at timestamptz not null default now()
);

create index if not exists idx_page_views_created on public.page_views (created_at desc);
create index if not exists idx_page_views_path    on public.page_views (path);
create index if not exists idx_wb_created on public.website_bookings (created_at desc);
create index if not exists idx_eb_created on public.editing_bookings (created_at desc);
create index if not exists idx_works_pub  on public.works (published, sort_order);

-- ---------- triggers ----------
drop trigger if exists trg_wb_updated on public.website_bookings;
create trigger trg_wb_updated before update on public.website_bookings
  for each row execute function public.set_updated_at();
drop trigger if exists trg_eb_updated on public.editing_bookings;
create trigger trg_eb_updated before update on public.editing_bookings
  for each row execute function public.set_updated_at();
drop trigger if exists trg_works_updated on public.works;
create trigger trg_works_updated before update on public.works
  for each row execute function public.set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- Public visitors can ONLY read published works.
-- All public writes (consultation form, tracking) go through server code
-- that uses the service-role key, which bypasses RLS.
-- =====================================================================
alter table public.admins           enable row level security;
alter table public.customers        enable row level security;
alter table public.website_bookings enable row level security;
alter table public.editing_bookings enable row level security;
alter table public.works            enable row level security;
alter table public.visitors         enable row level security;
alter table public.page_views       enable row level security;

drop policy if exists "admin reads own row" on public.admins;
create policy "admin reads own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "admin all customers" on public.customers;
create policy "admin all customers" on public.customers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all website_bookings" on public.website_bookings;
create policy "admin all website_bookings" on public.website_bookings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin all editing_bookings" on public.editing_bookings;
create policy "admin all editing_bookings" on public.editing_bookings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public reads published works" on public.works;
create policy "public reads published works" on public.works
  for select to anon, authenticated using (published = true);

drop policy if exists "admin all works" on public.works;
create policy "admin all works" on public.works
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin reads visitors" on public.visitors;
create policy "admin reads visitors" on public.visitors
  for select to authenticated using (public.is_admin());

drop policy if exists "admin reads page_views" on public.page_views;
create policy "admin reads page_views" on public.page_views
  for select to authenticated using (public.is_admin());

-- =====================================================================
-- ADMIN ANALYTICS FUNCTIONS (IST day boundaries)
-- =====================================================================
create or replace function public.admin_daily_stats(days integer default 14)
returns table (stat_date date, views bigint, unique_visitors bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
    select (pv.created_at at time zone 'Asia/Kolkata')::date,
           count(*)::bigint,
           count(distinct pv.visitor_id)::bigint
    from public.page_views pv
    where pv.created_at >= now() - make_interval(days => days)
    group by 1 order by 1;
end; $$;

create or replace function public.admin_top_pages(days integer default 30, lim integer default 8)
returns table (page_path text, views bigint, unique_visitors bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
    select pv.path, count(*)::bigint, count(distinct pv.visitor_id)::bigint
    from public.page_views pv
    where pv.created_at >= now() - make_interval(days => days)
    group by pv.path order by count(*) desc limit lim;
end; $$;

revoke all on function public.admin_daily_stats(integer)          from public, anon;
revoke all on function public.admin_top_pages(integer, integer)   from public, anon;
grant execute on function public.admin_daily_stats(integer)        to authenticated;
grant execute on function public.admin_top_pages(integer, integer) to authenticated;

-- =====================================================================
-- STORAGE: public-read bucket for portfolio images, admin-only writes
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('work-media', 'work-media', true)
on conflict (id) do nothing;

drop policy if exists "admin insert work-media" on storage.objects;
create policy "admin insert work-media" on storage.objects
  for insert to authenticated with check (bucket_id = 'work-media' and public.is_admin());
drop policy if exists "admin update work-media" on storage.objects;
create policy "admin update work-media" on storage.objects
  for update to authenticated using (bucket_id = 'work-media' and public.is_admin());
drop policy if exists "admin delete work-media" on storage.objects;
create policy "admin delete work-media" on storage.objects
  for delete to authenticated using (bucket_id = 'work-media' and public.is_admin());
