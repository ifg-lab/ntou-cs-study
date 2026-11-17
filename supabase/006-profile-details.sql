begin;

create table public.study_profile_details (
  user_id uuid primary key references public.study_profiles(id) on delete cascade,
  discord text check (char_length(discord) between 2 and 37 and discord ~ '^[A-Za-z0-9_.-]+(#[0-9]{4})?$'),
  birth_month smallint,
  birth_day smallint,
  github text check (github ~ '^[A-Za-z0-9]([A-Za-z0-9-]{0,37}[A-Za-z0-9])?$'),
  interests text check (char_length(interests) between 1 and 100),
  check (
    (birth_month is null and birth_day is null) or
    (birth_month is not null and birth_day is not null and birth_month between 1 and 12 and
      birth_day between 1 and case when birth_month = 2 then 29 when birth_month in (4, 6, 9, 11) then 30 else 31 end)
  )
);

alter table public.study_profile_details enable row level security;
revoke all on public.study_profile_details from public, anon, authenticated;
grant select, insert, update on public.study_profile_details to authenticated;
create policy study_details_self on public.study_profile_details for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and
    exists (select 1 from public.study_student_ids where user_id = (select auth.uid()) and department is not null));

-- Keep discussion enrollment visibility tied to the existing roster rules.
create function public.study_discussion_people_full(people uuid[], with_profile boolean default false)
returns table(id uuid, is_admin boolean, student_id text, department text, grade smallint, section text, extras jsonb)
language sql stable security definer set search_path = '' as $$
  select profile.id, profile.is_admin, enrollment.student_id, enrollment.department, enrollment.grade, enrollment.section,
    case when details.user_id is not null then jsonb_strip_nulls(to_jsonb(details) - 'user_id') end
  from public.study_discussion_people(people) profile
  left join public.study_student_ids viewer on viewer.user_id = (select auth.uid()) and viewer.department is not null
  left join public.study_student_ids enrollment on enrollment.user_id = profile.id and enrollment.department is not null
    and (profile.student_id is not null or (with_profile and profile.id = viewer.user_id))
  left join public.study_student_ids eligible on eligible.user_id = profile.id and eligible.department is not null
  left join public.study_profile_details details on details.user_id = eligible.user_id and with_profile
    and viewer.user_id is not null;
$$;

revoke execute on function public.study_discussion_people_full(uuid[], boolean) from public, anon, authenticated;
grant execute on function public.study_discussion_people_full(uuid[], boolean) to anon, authenticated;

notify pgrst, 'reload schema';
commit;
