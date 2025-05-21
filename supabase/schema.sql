-- Create products table
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  image_url_2 text,
  image_url_3 text,
  image_url_4 text,
  image_url_5 text
);

-- Create cart_items table
create table if not exists cart_items (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  product_id uuid references products not null,
  quantity integer not null default 1
);

-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users primary key,
  role text not null default 'user'
);

-- Set up Row Level Security (RLS)
alter table products enable row level security;
alter table cart_items enable row level security;
alter table profiles enable row level security;

-- Create policies
create policy "Products are viewable by everyone"
on products for select
using (true);

create policy "Users can manage their own cart"
on cart_items for all
using (auth.uid() = user_id);

create policy "Users can view own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id); 