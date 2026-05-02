
-- Lock search_path on functions
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict do nothing;
  return new;
end; $$;

-- Revoke broad execute on security definer helpers
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Restrict storage listing: drop overly broad SELECT, replace with object-level read only
drop policy if exists "media public read" on storage.objects;
create policy "media public object read" on storage.objects for select using (
  bucket_id = 'media' and (storage.foldername(name))[1] is not null
);

-- Replace overly permissive lead inserts with rate-friendly checks
drop policy if exists "contact insert any" on public.contact_leads;
create policy "contact insert validated" on public.contact_leads for insert with check (
  length(name) between 1 and 200 and length(email) between 3 and 320 and length(message) between 1 and 5000
);

drop policy if exists "chatbot insert any" on public.chatbot_leads;
create policy "chatbot insert validated" on public.chatbot_leads for insert with check (
  jsonb_typeof(transcript) = 'array'
);
