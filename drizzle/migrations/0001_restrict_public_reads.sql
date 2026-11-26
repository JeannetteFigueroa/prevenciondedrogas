alter table public.capsules add column published boolean not null default true;
drop policy "Public read capsules" on public.capsules;
create policy "Read published capsules or editor" on public.capsules for select to anon, authenticated
  using (published or (select public.is_editor()));
drop policy "Public read settings" on public.site_settings;
create policy "Read site settings row" on public.site_settings for select to anon, authenticated
  using (id = 1);