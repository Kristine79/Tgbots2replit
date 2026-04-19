-- Telegram bot catalog schema
-- Creates the `categories` and `bots` tables that power the public catalog
-- and the authenticated admin panel. Any signed-in Supabase user is treated
-- as an admin (sign-ups can be disabled in the Supabase dashboard to lock
-- the panel down once the initial admin account is created).

create table if not exists public.categories (
  id           serial       primary key,
  name         text         not null,
  slug         text         not null unique,
  emoji        text         not null default '',
  created_at   timestamptz  not null default now()
);

create table if not exists public.bots (
  id             serial       primary key,
  username       text         not null unique,
  name           text         not null,
  description    text         not null default '',
  category_id    integer      not null references public.categories(id) on delete restrict,
  rating         numeric(3,1) not null default 0,
  review_count   integer      not null default 0,
  is_verified    boolean      not null default false,
  is_premium     boolean      not null default false,
  tags           text[]       not null default '{}',
  monthly_users  integer      not null default 0,
  icon_emoji     text         not null default '🤖',
  telegram_url   text         not null,
  created_at     timestamptz  not null default now(),
  updated_at     timestamptz  not null default now()
);

create index if not exists bots_category_id_idx on public.bots (category_id);
create index if not exists bots_rating_idx      on public.bots (rating desc);
create index if not exists bots_users_idx       on public.bots (monthly_users desc);

-- Keep updated_at in sync automatically
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_bots_updated_at on public.bots;
create trigger set_bots_updated_at
  before update on public.bots
  for each row execute function public.set_updated_at();

-- Row Level Security: public read, authenticated write
alter table public.categories enable row level security;
alter table public.bots       enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  using (true);

drop policy if exists "categories_auth_insert" on public.categories;
create policy "categories_auth_insert"
  on public.categories for insert
  to authenticated
  with check (true);

drop policy if exists "categories_auth_update" on public.categories;
create policy "categories_auth_update"
  on public.categories for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "categories_auth_delete" on public.categories;
create policy "categories_auth_delete"
  on public.categories for delete
  to authenticated
  using (true);

drop policy if exists "bots_public_read" on public.bots;
create policy "bots_public_read"
  on public.bots for select
  using (true);

drop policy if exists "bots_auth_insert" on public.bots;
create policy "bots_auth_insert"
  on public.bots for insert
  to authenticated
  with check (true);

drop policy if exists "bots_auth_update" on public.bots;
create policy "bots_auth_update"
  on public.bots for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "bots_auth_delete" on public.bots;
create policy "bots_auth_delete"
  on public.bots for delete
  to authenticated
  using (true);
