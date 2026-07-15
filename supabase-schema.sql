-- Run this whole file in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run

create table if not exists products (
  id text primary key default gen_random_uuid()::text,
  brand text,
  name text,
  price numeric,
  img text,
  cat text,
  sizes text,
  rating numeric,
  source_url text,
  created_at timestamp default now()
);

create table if not exists orders (
  id text primary key default gen_random_uuid()::text,
  customer_email text,
  items jsonb,
  subtotal numeric,
  total numeric,
  status text default 'pending_payment',
  payment_method text,
  created_at timestamp default now()
);

alter table products enable row level security;
alter table orders enable row level security;

-- anyone (including logged-out shoppers) can read the product catalog
create policy "public read products" on products for select using (true);

-- only your admin account (change the email below) can add/edit/delete products
create policy "admin write products" on products for all
  using (auth.jwt() ->> 'email' = 'YOUR_ADMIN_EMAIL@example.com');

-- anyone can place an order (checkout doesn't require being "admin")
create policy "anyone can create order" on orders for insert with check (true);

-- only admin can view the list of orders
create policy "admin read orders" on orders for select
  using (auth.jwt() ->> 'email' = 'YOUR_ADMIN_EMAIL@example.com');
