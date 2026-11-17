begin;

create table public.study_profiles (
  id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  nickname text not null check (char_length(btrim(nickname)) between 1 and 32),
  bio text not null default '' check (char_length(bio) <= 160),
  avatar text not null default 'initial' check (avatar in ('initial', 'blue', 'green', 'orange', 'purple', 'photo')),
  avatar_version uuid
);

create table public.study_course_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null check (course_id ~ '^lecture-[0-9]{2,3}$'),
  revision integer not null check (revision > 0),
  progress jsonb not null check (jsonb_typeof(progress) = 'object' and octet_length(progress::text) <= 1000000),
  primary key (user_id, course_id)
);

create table public.study_units (
  course_id text not null check (course_id ~ '^lecture-[0-9]{2,3}$'),
  unit_id text not null check (unit_id ~ '^[a-z0-9-]+$'),
  title text not null,
  first_page integer not null check (first_page > 0),
  last_page integer not null check (last_page >= first_page),
  primary key (course_id, unit_id)
);

create table public.study_threads (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references public.study_profiles(id) on delete cascade,
  course_id text not null,
  unit_id text not null,
  page integer,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  body text not null check (char_length(btrim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  solved boolean not null default false,
  hidden_at timestamptz,
  foreign key (course_id, unit_id) references public.study_units(course_id, unit_id)
);

create table public.study_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.study_threads(id) on delete cascade,
  author_id uuid not null default auth.uid() references public.study_profiles(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2500),
  created_at timestamptz not null default now(),
  hidden_at timestamptz
);

create table public.study_moderators (user_id uuid primary key references auth.users(id) on delete cascade);
create table public.study_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  thread_id uuid references public.study_threads(id) on delete cascade,
  reply_id uuid references public.study_replies(id) on delete cascade,
  reason text not null check (char_length(btrim(reason)) between 1 and 300),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  check ((thread_id is null) <> (reply_id is null)),
  unique (reporter_id, thread_id),
  unique (reporter_id, reply_id)
);

create index study_threads_recent on public.study_threads (created_at desc, id) where hidden_at is null;
create index study_threads_unit_recent on public.study_threads (course_id, unit_id, created_at desc, id) where hidden_at is null;
create index study_threads_author_recent on public.study_threads (author_id, created_at desc);
create index study_replies_thread_order on public.study_replies (thread_id, created_at, id) where hidden_at is null;
create index study_replies_author_recent on public.study_replies (author_id, created_at desc);
create index study_reports_recent on public.study_reports (created_at desc) where resolved_at is null;

alter table public.study_profiles enable row level security;
alter table public.study_course_progress enable row level security;
alter table public.study_units enable row level security;
alter table public.study_threads enable row level security;
alter table public.study_replies enable row level security;
alter table public.study_reports enable row level security;
alter table public.study_moderators enable row level security;

revoke all on table public.study_profiles, public.study_course_progress, public.study_units,
  public.study_threads, public.study_replies, public.study_moderators, public.study_reports from anon, authenticated;

grant select on public.study_profiles, public.study_units, public.study_threads, public.study_replies to anon, authenticated;
grant insert (id, nickname, bio, avatar, avatar_version), update (id, nickname, bio, avatar, avatar_version)
  on public.study_profiles to authenticated;
grant select on public.study_course_progress, public.study_reports to authenticated;
grant insert (course_id, unit_id, page, title, body), update (solved) on public.study_threads to authenticated;
grant insert (thread_id, body) on public.study_replies to authenticated;
grant insert (thread_id, reply_id, reason) on public.study_reports to authenticated;

create policy profiles_read on public.study_profiles for select to anon, authenticated using (true);
create policy profiles_insert on public.study_profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy profiles_update on public.study_profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy progress_read on public.study_course_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy units_read on public.study_units for select to anon, authenticated using (true);
create policy threads_read on public.study_threads for select to anon, authenticated using (hidden_at is null);
create policy threads_insert on public.study_threads for insert to authenticated
  with check ((select auth.uid()) = author_id);
create policy threads_solve on public.study_threads for update to authenticated
  using ((select auth.uid()) = author_id and hidden_at is null)
  with check ((select auth.uid()) = author_id and hidden_at is null);
create policy replies_read on public.study_replies for select to anon, authenticated
  using (hidden_at is null and exists (select 1 from public.study_threads t where t.id = thread_id));
create policy replies_insert on public.study_replies for insert to authenticated with check (
  (select auth.uid()) = author_id and exists (select 1 from public.study_threads t where t.id = thread_id)
);
create policy reports_insert on public.study_reports for insert to authenticated with check (
  (select auth.uid()) = reporter_id and
  (exists (select 1 from public.study_threads t where t.id = thread_id)
    or exists (select 1 from public.study_replies r where r.id = reply_id))
);

create function public.study_is_moderator() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.study_moderators where user_id = (select auth.uid()));
$$;
revoke execute on function public.study_is_moderator() from public, anon;
grant execute on function public.study_is_moderator() to authenticated;
create policy reports_read on public.study_reports for select to authenticated using ((select public.study_is_moderator()));

create function public.study_resolve_report(report_id uuid, hide_content boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare report public.study_reports;
begin
  if not public.study_is_moderator() then
    raise insufficient_privilege;
  end if;
  select * into report from public.study_reports where id = report_id and resolved_at is null for update;
  if not found then return; end if;
  if hide_content and report.thread_id is not null then
    update public.study_threads set hidden_at = now() where id = report.thread_id;
  elsif hide_content then
    update public.study_replies set hidden_at = now() where id = report.reply_id;
  end if;
  update public.study_reports set resolved_at = now()
    where thread_id = report.thread_id or reply_id = report.reply_id;
end;
$$;
revoke execute on function public.study_resolve_report(uuid, boolean) from public, anon;
grant execute on function public.study_resolve_report(uuid, boolean) to authenticated;

create function public.study_save_progress(account_id uuid, target_course text, expected integer, payload jsonb) returns boolean
language plpgsql security definer set search_path = '' as $$
declare owner_id uuid := auth.uid();
begin
  if owner_id is null or owner_id is distinct from account_id then raise insufficient_privilege; end if;
  if not exists (select 1 from public.study_units where course_id = target_course) then
    raise exception 'Unknown course' using errcode = '23514';
  end if;
  if expected = 0 then
    insert into public.study_course_progress (user_id, course_id, revision, progress)
      values (owner_id, target_course, 1, payload) on conflict do nothing;
  else
    update public.study_course_progress set progress = payload, revision = revision + 1
      where user_id = owner_id and course_id = target_course and revision = expected;
  end if;
  return found;
end;
$$;
revoke execute on function public.study_save_progress(uuid, text, integer, jsonb) from public, anon;
grant execute on function public.study_save_progress(uuid, text, integer, jsonb) to authenticated;

create function public.study_check_post() returns trigger
language plpgsql security definer set search_path = '' as $$
declare recent integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.author_id::text, 0));
  select (select count(*) from public.study_threads where author_id = new.author_id and created_at >= now() - interval '1 minute') +
         (select count(*) from public.study_replies where author_id = new.author_id and created_at >= now() - interval '1 minute')
    into recent;
  if recent >= 5 then raise exception 'Post rate limit' using errcode = 'P0001'; end if;
  if tg_table_name = 'study_threads' then
    if new.page is not null and not exists (
      select 1 from public.study_units u where u.course_id = new.course_id and u.unit_id = new.unit_id
        and new.page between u.first_page and u.last_page
    ) then raise exception 'Page outside unit' using errcode = '23514'; end if;
  end if;
  return new;
end;
$$;
revoke execute on function public.study_check_post() from public, anon, authenticated;
create trigger study_thread_checks before insert on public.study_threads for each row execute function public.study_check_post();
create trigger study_reply_checks before insert on public.study_replies for each row execute function public.study_check_post();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('study-avatars', 'study-avatars', true, 262144, array['image/webp']);

create policy study_avatar_read on storage.objects for select to anon, authenticated using (bucket_id = 'study-avatars');
create policy study_avatar_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'study-avatars' and name = (select auth.uid())::text || '/avatar.webp'
);
create policy study_avatar_update on storage.objects for update to authenticated using (
  bucket_id = 'study-avatars' and name = (select auth.uid())::text || '/avatar.webp'
) with check (
  bucket_id = 'study-avatars' and name = (select auth.uid())::text || '/avatar.webp'
);
create policy study_avatar_delete on storage.objects for delete to authenticated using (
  bucket_id = 'study-avatars' and name = (select auth.uid())::text || '/avatar.webp'
);

notify pgrst, 'reload schema';
commit;
