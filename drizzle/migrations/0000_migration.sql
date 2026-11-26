create or replace function public.is_editor() returns boolean language sql stable as $$
  select coalesce(lower((select auth.jwt()) ->> 'email') = 'alumnas.uah@educadoras.cl', false)
$$;

create table public.capsules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Prevención de Drogas',
  video_url text,
  summary text not null default '',
  description text not null default '',
  created_at timestamptz not null default now()
);
grant select on public.capsules to anon, authenticated;
grant insert, update, delete on public.capsules to authenticated;
grant all on public.capsules to service_role;
alter table public.capsules enable row level security;
create policy "Public read capsules" on public.capsules for select to anon, authenticated using (true);
create policy "Editor insert capsules" on public.capsules for insert to authenticated with check ((select public.is_editor()));
create policy "Editor update capsules" on public.capsules for update to authenticated using ((select public.is_editor())) with check ((select public.is_editor()));
create policy "Editor delete capsules" on public.capsules for delete to authenticated using ((select public.is_editor()));

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  team_names text not null default 'Nombre Integrante 1, Nombre Integrante 2, Nombre Integrante 3, Nombre Integrante 4',
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Editor update settings" on public.site_settings for update to authenticated using ((select public.is_editor())) with check ((select public.is_editor()));
insert into public.site_settings (id) values (1);

insert into public.capsules (title, category, video_url, summary, description, created_at) values
('Prevención desde la primera infancia','Prevención de Drogas','https://www.youtube.com/watch?v=Gg1Wc3h1Y3w','Cómo los vínculos seguros y las rutinas protegen a niñas y niños desde los primeros años.','La prevención del consumo de drogas comienza mucho antes de la adolescencia. Un vínculo afectivo seguro, rutinas predecibles y adultos disponibles son factores protectores clave.\n\nConsejos para la familia:\n• Compartan al menos una comida diaria sin pantallas.\n• Nombren y validen las emociones de sus hijos.\n• Sean modelo: los niños aprenden de lo que ven en casa.\n• Ante dudas, llamen a SENDA Previene: 1412.', now() - interval '6 days'),
('Educación emocional en casa','Educación Emocional','https://www.youtube.com/watch?v=dOkyKyVFnSs','Herramientas simples para acompañar el enojo, la tristeza y el miedo de los más pequeños.','Las emociones no son buenas ni malas: son información. Acompañarlas con calma enseña a los niños a regularse.\n\nConsejos para la familia:\n• Agáchense a su altura y hablen con voz tranquila.\n• Usen frases como "veo que estás muy enojado".\n• Creen un "rincón de la calma" con cojines y cuentos.\n• Cuiden también sus propias emociones como cuidadores.', now() - interval '3 days'),
('Redes de apoyo: CESFAM y vecinos','Redes de Apoyo','https://www.youtube.com/watch?v=3eF3WqR5KGs','Conoce a quién acudir en Maipú y cómo la comunidad puede sostener a las familias.','Ninguna familia cría sola. En la comuna existen redes que pueden orientar y acompañar.\n\n• CESFAM: control sano, salud mental y derivación a psicólogos.\n• Jardín infantil: educadoras atentas a señales de alerta.\n• Juntas de vecinos: actividades solidarias, como bingos de apoyo a familias.\n• Fono Infancia: 800 200 818, gratuito y confidencial.', now() - interval '1 day');