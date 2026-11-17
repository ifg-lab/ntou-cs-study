begin;

create table public.study_material_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  course_id text not null,
  unit_id text not null,
  page integer not null check (page > 0),
  question_id text not null default '' check (question_id = '' or question_id ~ '^practice-[1-9][0-9]{0,5}$'),
  reason text not null check (char_length(btrim(reason)) between 1 and 1200),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  foreign key (course_id, unit_id) references public.study_units(course_id, unit_id),
  constraint study_material_reports_once unique (reporter_id, course_id, page, question_id)
);

create index study_material_reports_pending on public.study_material_reports (created_at desc, id)
  where resolved_at is null;
alter table public.study_material_reports enable row level security;
revoke all on public.study_material_reports from public, anon, authenticated;
grant insert (course_id, unit_id, page, question_id, reason) on public.study_material_reports to authenticated;
grant select, update (resolved_at) on public.study_material_reports to authenticated;

create policy material_reports_insert on public.study_material_reports for insert to authenticated with check (
  reporter_id = (select auth.uid()) and exists (
    select 1 from public.study_units as unit
    where unit.course_id = study_material_reports.course_id and unit.unit_id = study_material_reports.unit_id
      and study_material_reports.page between unit.first_page and unit.last_page
  )
);
create policy material_reports_read on public.study_material_reports for select to authenticated
  using ((select public.study_is_moderator()));
create policy material_reports_resolve on public.study_material_reports for update to authenticated
  using ((select public.study_is_moderator())) with check ((select public.study_is_moderator()));

commit;
