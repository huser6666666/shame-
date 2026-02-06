-- Table des images du jour (une entrée par date)
create table if not exists public.daily_images (
  id uuid primary key default gen_random_uuid(),
  image_date date not null unique,
  image_path text not null,
  created_at timestamptz default now()
);

-- Politique : tout le monde peut lire les images
alter table public.daily_images enable row level security;

create policy "Images du jour en lecture publique"
  on public.daily_images for select
  using (true);

-- Optionnel : permettre l'upload seulement aux utilisateurs authentifiés ou via service role
-- create policy "Insert daily images" on public.daily_images for insert with check (auth.role() = 'service_role');

comment on table public.daily_images is 'Une image par jour, affichée et dévoilée au clic.';
