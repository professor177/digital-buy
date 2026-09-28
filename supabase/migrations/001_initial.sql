-- Digital Buy production schema
create extension if not exists pgcrypto;

create type public.account_type as enum ('shared', 'personal');
create type public.product_kind as enum ('rental', 'permanent', 'subscription');
create type public.duration_unit as enum ('day', 'week', 'month', 'year', 'permanent');
create type public.product_status as enum ('draft', 'active', 'archived');
create type public.order_status as enum ('pending', 'payment_submitted', 'confirmed', 'processing', 'completed', 'failed', 'cancelled');
create type public.payment_method as enum ('bkash', 'nagad');
create type public.payment_status as enum ('submitted', 'verified', 'rejected');
create type public.admin_role as enum ('admin', 'super_admin');

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_users (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  role public.admin_role not null default 'admin',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.platforms (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description text,
  accent text check (accent is null or accent ~ '^#[0-9A-Fa-f]{6}$'),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(category_id, name),
  unique(id, category_id)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  platform_id uuid not null references public.platforms(id) on delete restrict,
  name text not null check (char_length(name) between 2 and 150),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  account_type public.account_type not null,
  kind public.product_kind not null,
  description text not null check (char_length(description) between 10 and 5000),
  genre text[],
  image_url text,
  trailer_url text,
  price_bdt integer not null check (price_bdt > 0),
  duration_value integer check (duration_value is null or duration_value > 0),
  duration_unit public.duration_unit not null,
  stock integer check (stock is null or stock >= 0),
  available boolean not null default true,
  status public.product_status not null default 'draft',
  customer_instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_platform_category_fk foreign key (platform_id, category_id) references public.platforms(id, category_id) on delete restrict,
  constraint duration_shape check (
    (duration_unit = 'permanent' and duration_value is null)
    or (duration_unit <> 'permanent' and duration_value is not null)
  )
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('DB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  user_id uuid not null references auth.users(id) on delete restrict,
  status public.order_status not null default 'pending',
  total_bdt integer not null check (total_bdt > 0),
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  platform_name text not null,
  account_type public.account_type not null,
  kind public.product_kind not null,
  unit_price_bdt integer not null check (unit_price_bdt > 0),
  duration_value integer,
  duration_unit public.duration_unit not null,
  duration_label text not null,
  quantity integer not null default 1 check (quantity = 1),
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete restrict,
  method public.payment_method not null,
  payer_number text not null check (payer_number ~ '^01[3-9][0-9]{8}$'),
  reference text not null check (char_length(reference) between 4 and 100),
  amount_bdt integer not null check (amount_bdt > 0),
  status public.payment_status not null default 'submitted',
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(method, reference)
);

create table public.delivered_credentials (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null unique references public.order_items(id) on delete cascade,
  username_encrypted text,
  password_encrypted text,
  instructions_encrypted text,
  delivered_by uuid references auth.users(id) on delete set null,
  delivered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (username_encrypted is not null or password_encrypted is not null or instructions_encrypted is not null)
);

create table public.rate_limit_buckets (
  key text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now()
);

create index idx_platforms_category on public.platforms(category_id, active, sort_order);
create index idx_products_browse on public.products(category_id, platform_id, account_type, status, available);
create index idx_products_name_search on public.products using gin (to_tsvector('simple', name || ' ' || coalesce(description, '')));
create index idx_orders_user_created on public.orders(user_id, created_at desc);
create index idx_orders_status_created on public.orders(status, created_at desc);
create index idx_payments_user_created on public.payments(user_id, created_at desc);
create index idx_order_items_order on public.order_items(order_id);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_user_profiles before update on public.user_profiles for each row execute function public.touch_updated_at();
create trigger touch_categories before update on public.categories for each row execute function public.touch_updated_at();
create trigger touch_platforms before update on public.platforms for each row execute function public.touch_updated_at();
create trigger touch_products before update on public.products for each row execute function public.touch_updated_at();
create trigger touch_orders before update on public.orders for each row execute function public.touch_updated_at();
create trigger touch_payments before update on public.payments for each row execute function public.touch_updated_at();
create trigger touch_delivered_credentials before update on public.delivered_credentials for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, name)
  values (new.id, left(coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(coalesce(new.email, 'Customer'), '@', 1)), 100));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  bucket public.rate_limit_buckets;
begin
  if p_limit < 1 or p_window_seconds < 1 then
    return false;
  end if;

  insert into public.rate_limit_buckets(key, window_started_at, request_count)
  values (p_key, now(), 1)
  on conflict (key) do update set
    window_started_at = case
      when public.rate_limit_buckets.window_started_at <= now() - make_interval(secs => p_window_seconds)
      then now() else public.rate_limit_buckets.window_started_at end,
    request_count = case
      when public.rate_limit_buckets.window_started_at <= now() - make_interval(secs => p_window_seconds)
      then 1 else public.rate_limit_buckets.request_count + 1 end,
    updated_at = now()
  returning * into bucket;

  return bucket.request_count <= p_limit;
end;
$$;

create or replace function public.create_order_with_payment(
  p_product_id uuid,
  p_payment_method public.payment_method,
  p_payer_number text,
  p_reference text
)
returns table(order_id uuid, order_number text)
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_product public.products;
  v_platform public.platforms;
  v_order public.orders;
  v_duration_label text;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from auth.users where id = v_user and email_confirmed_at is not null) then
    raise exception 'Email verification required';
  end if;
  if p_payer_number !~ '^01[3-9][0-9]{8}$' then raise exception 'Invalid Bangladesh mobile number'; end if;
  if char_length(trim(p_reference)) < 4 then raise exception 'Payment reference is required'; end if;

  select * into v_product from public.products where id = p_product_id for update;
  if not found or v_product.status <> 'active' or not v_product.available then raise exception 'Product is unavailable'; end if;
  if v_product.stock is not null and v_product.stock <= 0 then raise exception 'Product is out of stock'; end if;

  select * into v_platform from public.platforms where id = v_product.platform_id and active = true;
  if not found then raise exception 'Platform is unavailable'; end if;

  v_duration_label := case
    when v_product.duration_unit = 'permanent' then 'Permanent'
    else v_product.duration_value::text || ' ' || v_product.duration_unit::text || case when v_product.duration_value = 1 then '' else 's' end
  end;

  insert into public.orders(user_id, status, total_bdt)
  values (v_user, 'payment_submitted', v_product.price_bdt)
  returning * into v_order;

  insert into public.order_items(
    order_id, product_id, product_name, platform_name, account_type, kind,
    unit_price_bdt, duration_value, duration_unit, duration_label
  ) values (
    v_order.id, v_product.id, v_product.name, v_platform.name, v_product.account_type, v_product.kind,
    v_product.price_bdt, v_product.duration_value, v_product.duration_unit, v_duration_label
  );

  insert into public.payments(order_id, user_id, method, payer_number, reference, amount_bdt, status)
  values (v_order.id, v_user, p_payment_method, p_payer_number, upper(trim(p_reference)), v_product.price_bdt, 'submitted');

  if v_product.stock is not null then
    update public.products set stock = stock - 1 where id = v_product.id;
  end if;

  return query select v_order.id, v_order.order_number;
exception
  when unique_violation then
    raise exception 'That payment reference has already been submitted';
end;
$$;

alter table public.user_profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.platforms enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.delivered_credentials enable row level security;
alter table public.rate_limit_buckets enable row level security;

revoke all on table public.user_profiles, public.admin_users, public.categories, public.platforms, public.products, public.orders, public.order_items, public.payments, public.delivered_credentials, public.rate_limit_buckets from anon, authenticated;

grant select on public.categories, public.platforms, public.products to anon, authenticated;
grant select on public.user_profiles, public.orders, public.order_items, public.payments to authenticated;
revoke all on function public.create_order_with_payment(uuid, public.payment_method, text, text) from public, anon;
grant execute on function public.create_order_with_payment(uuid, public.payment_method, text, text) to authenticated;
revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

create policy categories_public_read on public.categories for select to anon, authenticated using (active = true);
create policy platforms_public_read on public.platforms for select to anon, authenticated using (active = true);
create policy products_public_read on public.products for select to anon, authenticated using (status = 'active');
create policy profiles_owner_read on public.user_profiles for select to authenticated using (id = auth.uid());
create policy orders_owner_read on public.orders for select to authenticated using (user_id = auth.uid());
create policy order_items_owner_read on public.order_items for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy payments_owner_read on public.payments for select to authenticated using (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-media', 'product-media', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;

create policy product_media_public_read on storage.objects for select to anon, authenticated
using (bucket_id = 'product-media');

insert into public.categories(name, slug, description, sort_order) values
  ('Gaming', 'gaming', 'Digital gaming account access for supported platforms.', 10),
  ('OTT', 'ott', 'Duration-based digital subscription access.', 20)
on conflict (slug) do nothing;

insert into public.platforms(category_id, name, slug, description, accent, sort_order)
select c.id, x.name, x.slug, x.description, x.accent, x.sort_order
from public.categories c
join (values
  ('gaming','Steam','steam','PC game accounts and access.','#66C0F4',10),
  ('gaming','Xbox','xbox','Xbox game accounts and access.','#107C10',20),
  ('gaming','Ubisoft','ubisoft','Ubisoft account and library access.','#0070FF',30),
  ('ott','Netflix','netflix','Streaming subscription access.','#E50914',10),
  ('ott','Spotify','spotify','Music subscription access.','#1DB954',20),
  ('ott','HBO','hbo','Entertainment subscription access.','#0F0F18',30),
  ('ott','YouTube Premium','youtube-premium','Premium video subscription access.','#FF0033',40),
  ('ott','ChatGPT','chatgpt','AI subscription access products.','#10A37F',50)
) as x(category_slug,name,slug,description,accent,sort_order) on x.category_slug = c.slug
on conflict (slug) do nothing;

insert into public.products(
  category_id, platform_id, name, slug, account_type, kind, description,
  price_bdt, duration_value, duration_unit, stock, available, status, customer_instructions
)
select c.id, p.id, 'Ubisoft Full Library', 'ubisoft-full-library-shared', 'shared', 'rental',
  'Shared rental access to an Ubisoft account/library. Access details and usage instructions are delivered after manual payment verification.',
  150, 1, 'month', null, true, 'active',
  'Follow the delivered account instructions. Do not change account security or recovery settings.'
from public.categories c join public.platforms p on p.category_id = c.id
where c.slug = 'gaming' and p.slug = 'ubisoft'
on conflict (slug) do nothing;
