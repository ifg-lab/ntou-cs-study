begin;

alter table public.study_student_ids
  add column department text,
  add column grade smallint,
  add column section text,
  add constraint study_student_class_check check (
    (department is null and grade is null and section is null)
    or (department is not null and grade is not null and section is not null
      and student_id ~ '^[0-9]{8}$' and char_length(btrim(department)) between 2 and 60
      and grade between 1 and 4 and section in ('A', 'B'))
  );

-- Older incomplete rows can be corrected in place.
create function public.study_save_student(value text, department_name text, year_level smallint, class_section text)
returns void language plpgsql security definer set search_path = '' as $$
declare owner_id uuid := auth.uid(); normalized text := btrim(value); department_value text := btrim(department_name);
begin
  if owner_id is null then raise insufficient_privilege; end if;
  if normalized is null or normalized !~ '^[0-9]{8}$' or department_value is null or
    char_length(department_value) not between 2 and 60 or year_level is null or year_level not between 1 and 4
    or class_section is null or class_section not in ('A', 'B') then
    raise exception 'Invalid student details' using errcode = '22023';
  end if;
  insert into public.study_student_ids(user_id, student_id, department, grade, section)
    values (owner_id, normalized, department_value, year_level, class_section)
    on conflict (user_id) do update set student_id = excluded.student_id, department = excluded.department,
      grade = excluded.grade, section = excluded.section;
end;
$$;

create or replace function public.study_require_student() returns uuid
language plpgsql stable security definer set search_path = '' as $$
declare owner_id uuid := auth.uid();
begin
  if not exists (select 1 from public.study_student_ids where user_id = owner_id and department is not null) then
    raise exception 'Student details required' using errcode = '42501';
  end if;
  return owner_id;
end;
$$;

alter policy threads_solve on public.study_threads
  using (author_id = (select auth.uid()) and hidden_at is null and deleted_at is null
    and exists (select 1 from public.study_student_ids s where s.user_id = (select auth.uid()) and s.department is not null));

create or replace function public.study_discussion_people(people uuid[]) returns table(id uuid, is_admin boolean, student_id text)
language sql stable security definer set search_path = '' as $$
  select p.id, m.user_id is not null, case when viewer.user_id is not null then s.student_id end
  from (select distinct unnest(people[1:50]) as id) requested
  join public.study_profiles p on p.id = requested.id
  left join public.study_moderators m on m.user_id = p.id
  left join public.study_student_ids s on s.user_id = p.id and s.department is not null and (
    exists (select 1 from public.study_threads t where t.author_id = p.id and t.hidden_at is null and t.deleted_at is null)
    or exists (select 1 from public.study_replies r join public.study_threads t on t.id = r.thread_id
      where r.author_id = p.id and r.hidden_at is null and r.deleted_at is null and t.hidden_at is null)
  )
  left join public.study_student_ids viewer on viewer.user_id = (select auth.uid()) and viewer.department is not null;
$$;

create table public.study_site_owner (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users(id) on delete cascade
);
alter table public.study_site_owner enable row level security;
revoke all on public.study_site_owner from public, anon, authenticated;

-- The live project binds its existing owner here once using a verified account UUID.
-- STUDY_OWNER_BOOTSTRAP

create function public.study_is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.study_site_owner where user_id = (select auth.uid()));
$$;

create function public.study_manage_members(search_term text default '', row_offset integer default 0)
returns table(id uuid, nickname text, avatar text, avatar_version uuid, student_suffix text, is_admin boolean, eligible boolean)
language plpgsql stable security definer set search_path = '' as $$
declare needle text := lower(left(btrim(coalesce(search_term, '')), 60));
begin
  if not public.study_is_owner() then raise insufficient_privilege; end if;
  return query select p.id, p.nickname, p.avatar, p.avatar_version,
    case when s.department is not null then right(s.student_id, 4) end, m.user_id is not null, s.department is not null
  from public.study_profiles p
  left join public.study_student_ids s on s.user_id = p.id
  left join public.study_moderators m on m.user_id = p.id
  where p.id <> (select owner.user_id from public.study_site_owner owner)
    and (p.nickname <> '' and (needle = '' or strpos(lower(p.nickname), needle) > 0
      or (needle ~ '^[0-9]{8}$' and s.student_id = needle)))
  order by (m.user_id is not null) desc, lower(p.nickname), p.id
  offset greatest(coalesce(row_offset, 0), 0) limit 21;
end;
$$;

create function public.study_set_moderator(member_id uuid, enabled boolean) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if not public.study_is_owner() or member_id is null or enabled is null or member_id = auth.uid() then
    raise insufficient_privilege;
  end if;
  if enabled then
    if not exists (select 1 from public.study_profiles p join public.study_student_ids s on s.user_id = p.id
      where p.id = member_id and s.department is not null) then
      raise exception 'Member details required' using errcode = '22023';
    end if;
    insert into public.study_moderators(user_id) values (member_id) on conflict do nothing;
  else
    delete from public.study_moderators where user_id = member_id;
  end if;
  return enabled;
end;
$$;

create table public.study_notifications (
  id bigint generated always as identity primary key,
  recipient_id uuid references auth.users(id) on delete cascade,
  kind text not null check (kind in ('reply', 'report', 'material')),
  reply_id uuid references public.study_replies(id) on delete cascade,
  report_id uuid references public.study_reports(id) on delete cascade,
  material_id uuid references public.study_material_reports(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (
    (kind = 'reply' and recipient_id is not null and reply_id is not null and report_id is null and material_id is null)
    or (kind = 'report' and recipient_id is null and reply_id is null and report_id is not null and material_id is null)
    or (kind = 'material' and recipient_id is null and reply_id is null and report_id is null and material_id is not null)
  ),
  unique (recipient_id, reply_id),
  unique (report_id),
  unique (material_id)
);

create index study_notifications_recipient on public.study_notifications(recipient_id, id desc);
create table public.study_notification_reads (
  user_id uuid references auth.users(id) on delete cascade,
  notification_id bigint references public.study_notifications(id) on delete cascade,
  primary key (user_id, notification_id)
);
alter table public.study_notifications enable row level security;
alter table public.study_notification_reads enable row level security;
revoke all on public.study_notifications, public.study_notification_reads from public, anon, authenticated;

create function public.study_record_notification() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  case tg_table_name
    when 'study_replies' then
      insert into public.study_notifications(kind, recipient_id, reply_id, created_at)
      select 'reply', recipients.user_id, new.id, new.created_at
      from (
        select t.author_id as user_id from public.study_threads t where t.id = new.thread_id and t.deleted_at is null
        union
        select r.author_id from public.study_replies r where r.id = new.reply_to and r.deleted_at is null
      ) recipients where recipients.user_id <> new.author_id on conflict do nothing;
    when 'study_reports' then
      insert into public.study_notifications(kind, report_id, created_at) values ('report', new.id, new.created_at);
    when 'study_material_reports' then
      insert into public.study_notifications(kind, material_id, created_at) values ('material', new.id, new.created_at);
  end case;
  return new;
end;
$$;

create trigger study_reply_notification after insert on public.study_replies
  for each row execute function public.study_record_notification();
create trigger study_report_notification after insert on public.study_reports
  for each row execute function public.study_record_notification();
create trigger study_material_notification after insert on public.study_material_reports
  for each row execute function public.study_record_notification();

insert into public.study_notifications(kind, report_id, created_at)
  select 'report', id, created_at from public.study_reports where resolved_at is null;
insert into public.study_notifications(kind, material_id, created_at)
  select 'material', id, created_at from public.study_material_reports where resolved_at is null;

create function public.study_inbox(page_size integer default 0, before_id bigint default null) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  viewer uuid := auth.uid(); admin boolean := public.study_is_moderator(); owns_site boolean := public.study_is_owner();
  unread bigint; entries jsonb;
begin
  if viewer is null then raise insufficient_privilege; end if;
  select count(*) into unread from public.study_notifications n
  where (n.recipient_id = viewer or (n.recipient_id is null and admin))
    and not exists (select 1 from public.study_notification_reads r where r.user_id = viewer and r.notification_id = n.id);
  if coalesce(page_size, 0) > 0 then
    select jsonb_agg(to_jsonb(items) order by items.created_at desc, items.id desc) into entries
    from (
      select n.id, n.kind, n.created_at, seen.user_id is not null as read,
        actor.nickname, case when t.hidden_at is null and t.deleted_at is null then t.title end as title,
        t.id as thread_id, n.reply_id, n.report_id, n.material_id, material.course_id, material.page,
        coalesce(flag.reason, material.reason) as reason,
        coalesce(flag.resolved_at, material.resolved_at) is not null as resolved,
        t.hidden_at is null and r.hidden_at is null as message_available
      from public.study_notifications n
      left join public.study_reports flag on flag.id = n.report_id
      left join public.study_replies r on r.id = coalesce(n.reply_id, flag.reply_id)
      left join public.study_threads t on t.id = coalesce(r.thread_id, flag.thread_id)
      left join public.study_material_reports material on material.id = n.material_id
      left join public.study_profiles actor on actor.id = coalesce(flag.reporter_id, material.reporter_id, r.author_id)
      left join public.study_notification_reads seen on seen.user_id = viewer and seen.notification_id = n.id
      where (n.recipient_id = viewer or (n.recipient_id is null and admin))
        and (before_id is null or (n.created_at, n.id) < (
          select cursor_notice.created_at, cursor_notice.id from public.study_notifications cursor_notice
          where cursor_notice.id = before_id and (cursor_notice.recipient_id = viewer or (cursor_notice.recipient_id is null and admin))
        ))
      order by n.created_at desc, n.id desc limit least(page_size, 21)
    ) items;
  end if;
  return jsonb_build_object('unread', unread, 'items', coalesce(entries, '[]'::jsonb), 'is_admin', admin, 'is_owner', owns_site);
end;
$$;

create function public.study_read_inbox(notice_id bigint default null) returns void
language plpgsql security definer set search_path = '' as $$
declare viewer uuid := auth.uid(); admin boolean := public.study_is_moderator();
begin
  if viewer is null then raise insufficient_privilege; end if;
  insert into public.study_notification_reads(user_id, notification_id)
    select viewer, n.id from public.study_notifications n
    where (notice_id is null or n.id = notice_id) and (n.recipient_id = viewer or (n.recipient_id is null and admin))
    on conflict do nothing;
end;
$$;

create function public.study_popular_emoji() returns table(emoji text, uses bigint, last_used timestamptz)
language sql stable security definer set search_path = '' as $$
  select u.emoji, sum(u.uses)::bigint, max(u.last_used)
  from public.study_emoji_usage u
  group by u.emoji order by 2 desc, 3 desc, u.emoji limit 5;
$$;

revoke execute on function public.study_set_student_id(text) from authenticated;
revoke execute on function public.study_record_notification() from public, anon, authenticated;
revoke execute on function public.study_popular_emoji() from public, anon, authenticated;
grant execute on function public.study_popular_emoji() to anon, authenticated;
revoke execute on function public.study_save_student(text, text, smallint, text), public.study_is_owner(),
  public.study_manage_members(text, integer), public.study_set_moderator(uuid, boolean),
  public.study_inbox(integer, bigint), public.study_read_inbox(bigint) from public, anon, authenticated;
grant execute on function public.study_save_student(text, text, smallint, text), public.study_is_owner(),
  public.study_manage_members(text, integer), public.study_set_moderator(uuid, boolean),
  public.study_inbox(integer, bigint), public.study_read_inbox(bigint) to authenticated;

notify pgrst, 'reload schema';
commit;
