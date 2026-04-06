-- ============================================================
-- TiendaBici – Supabase Schema
-- Ejecutar en orden en el SQL Editor de Supabase
-- ============================================================

-- ── 1. Extensiones ──────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── 2. Tabla: products ──────────────────────────────────────
create table if not exists public.products (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name        text not null,
  brand       text not null,
  price       integer not null,           -- en pesos CLP (sin decimales)
  category    text not null,
  stock       integer not null default 0,
  image       text not null default '/images/placeholder-tool.jpg',
  description text not null default '',
  features    text[] default '{}',
  specs       jsonb default '{}',
  created_at  timestamptz default now()
);

-- ── 3. Tabla: orders ────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default uuid_generate_v4(),
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text,
  status          text not null default 'pendiente'
                  check (status in ('pendiente','pagado','enviado','entregado','cancelado')),
  total           integer not null default 0,
  created_at      timestamptz default now()
);

-- ── 4. Tabla: order_items ────────────────────────────────────
create table if not exists public.order_items (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity     integer not null default 1,
  unit_price   integer not null
);

-- ── 5. Índices ──────────────────────────────────────────────
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_slug     on public.products(slug);
create index if not exists idx_orders_status     on public.orders(status);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- ── 6. Row Level Security ────────────────────────────────────
-- Productos: lectura pública, escritura solo autenticados
alter table public.products enable row level security;

create policy "products_public_read"
  on public.products for select using (true);

create policy "products_auth_write"
  on public.products for all
  using (auth.role() = 'authenticated');

-- Órdenes: solo autenticados
alter table public.orders enable row level security;

create policy "orders_auth_all"
  on public.orders for all
  using (auth.role() = 'authenticated');

-- Order items: solo autenticados
alter table public.order_items enable row level security;

create policy "order_items_auth_all"
  on public.order_items for all
  using (auth.role() = 'authenticated');

-- ── 7. Datos de ejemplo ──────────────────────────────────────
insert into public.products (slug, name, brand, price, category, stock, image, description, features, specs)
values
  (
    'multiherramienta-negro-one-up',
    'Multiherramienta 9 funciones One Up',
    'One Up',
    54990,
    'herramientas',
    15,
    '/images/placeholder-tool.jpg',
    'La multiherramienta compacta definitiva para tus rutas. Llaves Allen 2-8mm, Torx T25, destornillador plano. Solo 75g para llevar en cualquier bolsillo.',
    array['Llaves Allen 2mm, 2.5mm, 3mm, 4mm, 5mm, 6mm, 8mm','Llave Torx T25','Destornillador plano','Peso: solo 75g','Cuerpo de aluminio anodizado'],
    '{"Peso":"75g","Material":"Aluminio 6061","Funciones":"9","Compatibilidad":"Universal"}'
  ),
  (
    'luz-delantera-led-500lm',
    'Luz Delantera LED 500lm',
    'Lezyne',
    39990,
    'luces',
    8,
    '/images/placeholder-light.jpg',
    'Ilumina cada curva con 500 lúmenes de potencia. Recargable USB-C, 3 modos de iluminación y resistente al agua IPX7.',
    array['500 lúmenes de potencia máxima','Carga rápida USB-C','Modos: Alto / Medio / Flash','Resistencia al agua IPX7','Batería: 2200mAh / hasta 8h'],
    '{"Lúmenes":"500lm","Autonomía":"Hasta 8 horas","Carga":"USB-C","Impermeabilidad":"IPX7"}'
  ),
  (
    'casco-mtb-enduro-negro',
    'Casco MTB Enduro',
    'Fox Racing',
    129990,
    'protecciones',
    3,
    '/images/placeholder-helmet.jpg',
    'Protección certificada MIPS para los riders más exigentes. Ventilación máxima con carcasa dura para enduro y DH.',
    array['Certificación MIPS anti-rotación','Carcasa In-Mold de alta densidad','18 canales de ventilación','Visera ajustable de 3 posiciones','Forro interior lavable'],
    '{"Certificación":"MIPS / CE EN1078","Talla":"M (55-59cm)","Peso":"480g","Ventilación":"18 canales"}'
  ),
  (
    'guantes-mtb-negro-naranjo',
    'Guantes MTB Full Finger',
    'Fox Racing',
    34990,
    'ropa',
    0,
    '/images/placeholder-gloves.jpg',
    'Agarre y protección para tus rides más técnicos. Palma de cuero sintético reforzado, cierre de velcro ajustable.',
    array['Palma de cuero sintético reforzado','Nudillos con gel protector','Cierre de velcro ergonómico','Compatible con pantallas táctiles'],
    '{"Material":"Cuero sintético / Licra","Talla":"M","Dedos":"Full Finger","Pantalla":"Compatible"}'
  ),
  (
    'bomba-co2-16g',
    'Bomba CO₂ 16g',
    'Topeak',
    18990,
    'herramientas',
    22,
    '/images/placeholder-pump.jpg',
    'Inflado ultrarrápido en segundos. Cabezal universal para válvulas Presta y Schrader. Indispensable para salidas largas.',
    array['Inflado en menos de 10 segundos','Compatible válvulas Presta y Schrader','Cartucho 16g incluido','Gatillo de control de flujo','Cabezal con aislante térmico'],
    '{"Cartucho":"16g CO₂","Válvulas":"Presta / Schrader","Peso":"52g","Presión":"Hasta 7.9 bar / 115 PSI"}'
  ),
  (
    'luz-trasera-led-rojo',
    'Luz Trasera LED Roja',
    'Lezyne',
    19990,
    'luces',
    2,
    '/images/placeholder-rearlight.jpg',
    'Sé visible desde lejos. 70 lúmenes LED rojo, recargable USB, resistente al agua. Montaje universal para tija o alforja.',
    array['70 lúmenes máximos','LED rojo de alta visibilidad','Recargable USB micro','Modos: Constante / Flash / DayFlash','Montaje 360° ajustable'],
    '{"Lúmenes":"70lm","Autonomía":"Hasta 12 horas (flash)","Carga":"USB Micro","Impermeabilidad":"IPX7"}'
  )
on conflict (slug) do nothing;
