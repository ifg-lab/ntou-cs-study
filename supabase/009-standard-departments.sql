begin;

-- Degree programs and departments from https://www.ntou.edu.tw/academics.
create table public.study_departments (
  name text primary key,
  aliases text[] not null default '{}',
  display_order integer generated always as identity unique
);

insert into public.study_departments(name, aliases) values
  ('資訊工程學系', array['資工','資工系','資訊工程','資訊工程系','CSE','CSIE']),
  ('電機工程學系', array['電機','電機系','電機工程系']),
  ('通訊與導航工程學系', array['通訊','通訊系','通訊與導航工程系','通航']),
  ('光電與材料科技學系', array['光電與材料','光電與材料科技學士學位學程','光電與材料科技學士學位學程(系)']),
  ('商船學系', array['商船','商船系']),
  ('航運管理學系', array['航管','航管系','航運管理系']),
  ('運輸科學系', array['運科','運科系']),
  ('輪機工程學系', array['輪機','輪機系','輪機工程系']),
  ('海洋觀光管理學士學位學程', array['海洋觀光管理學士學位學程(系)','海洋觀光管理學學士學位學程(系)']),
  ('海洋經營管理學士學位學程', array['海洋經營管理學士學位學程(系)','海洋經營管理學學士學位學程(系)']),
  ('永續發展碩士在職學位學程', '{}'),
  ('食品科學系', array['食科','食科系','食品系']),
  ('水產養殖學系', array['養殖','養殖系']),
  ('生命科學暨生物科技學系', array['生科','生科系']),
  ('海洋生物研究所', array['海生所']),
  ('食品安全與風險管理研究所', '{}'),
  ('海洋生物科技博士學位學程', '{}'),
  ('海洋生物科技學士學位學程', array['海洋生物科技學士學位學程(系)','海洋生物科技學學士學位學程(系)']),
  ('環境生物與漁業科學學系', array['環漁','環漁系']),
  ('海洋環境資訊系', array['環資','環資系','海洋環境資訊學系']),
  ('地球科學研究所', array['地科所','應用地球科學研究所']),
  ('海洋事務與資源管理研究所', '{}'),
  ('海洋環境與生態研究所', '{}'),
  ('海洋資源與環境變遷博士學位學程', '{}'),
  ('機械與機電工程學系', array['機械','機械系','機械與機電工程系']),
  ('系統工程暨造船學系', array['造船','造船系']),
  ('河海工程學系', array['河海','河海系','河海工程系']),
  ('海洋工程科技博士學位學程', '{}'),
  ('海洋工程科技學士學位學程', array['海洋工程科技學士學位學程(系)','海洋工程科技學學士學位學程(系)']),
  ('應用經濟研究所', array['應經所']),
  ('教育研究所', array['教育所']),
  ('海洋文化研究所', '{}'),
  ('應用英語研究所', array['應英所']),
  ('海洋文創設計產業學士學位學程', array['海洋文創設計產業學士學位學程(系)']),
  ('海洋法律研究所', array['海洋法律所','海法所']),
  ('海洋法政學士學位學程', array['海洋法政學士學位學程(系)']),
  ('海洋政策碩士學位學程', '{}'),
  ('海洋生物科技及環境生態永續國際碩士學位學程', '{}'),
  ('應用人工智慧國際碩士學位學程', '{}');

alter table public.study_departments enable row level security;
revoke all on public.study_departments from public, anon, authenticated;
grant select on public.study_departments to authenticated;
create policy study_departments_read on public.study_departments for select to authenticated using (true);

create function public.study_department_key(value text) returns text
language sql immutable set search_path = '' as $$
  select regexp_replace(regexp_replace(lower(normalize(coalesce(value, ''), NFKC)), '[[:space:]]+', '', 'g'),
    '^(國立)?(臺灣|台灣)?(海洋大學|海大)', '');
$$;

create function public.study_resolve_department(value text, year_level smallint, class_section text) returns text
language sql stable set search_path = '' as $$
  with input as (select public.study_department_key(value) as key)
  select case when count(distinct d.name) = 1 then min(d.name) end
  from public.study_departments d
  cross join input
  cross join lateral unnest(array_prepend(d.name, d.aliases)) label
  where public.study_department_key(label) in (input.key,
    case when year_level between 1 and 4 and class_section in ('A', 'B')
    then regexp_replace(input.key, '\(?' || year_level || lower(class_section) || '\)?班?$', '') end);
$$;

with mapped as (
  select user_id, department, public.study_resolve_department(department, grade, section) as standard
  from public.study_student_ids where department is not null
)
update public.study_student_ids as saved
  set department = mapped.standard
  from mapped
  where saved.user_id = mapped.user_id and saved.department = mapped.department
    and mapped.standard is not null and saved.department <> mapped.standard;

-- Legacy values with no clear match remain in the student's account for correction.
alter table public.study_student_ids add constraint study_student_department
  foreign key (department) references public.study_departments(name) not valid;

do $$
begin
  if not exists (select 1 from public.study_student_ids s left join public.study_departments d on d.name = s.department
    where s.department is not null and d.name is null) then
    alter table public.study_student_ids validate constraint study_student_department;
  end if;
end;
$$;

create or replace function public.study_save_student(value text, department_name text, year_level smallint, class_section text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  owner_id uuid := auth.uid();
  normalized text := btrim(value);
  department_value text := public.study_resolve_department(department_name, year_level, class_section);
begin
  if owner_id is null then raise insufficient_privilege; end if;
  if normalized is null or normalized !~ '^[0-9]{8}$' or department_value is null
    or year_level is null or year_level not between 1 and 4
    or class_section is null or class_section not in ('A', 'B') then
    raise exception 'Invalid student details' using errcode = '22023';
  end if;
  insert into public.study_student_ids(user_id, student_id, department, grade, section)
    values (owner_id, normalized, department_value, year_level, class_section)
    on conflict (user_id) do update set student_id = excluded.student_id, department = excluded.department,
      grade = excluded.grade, section = excluded.section;
end;
$$;

create or replace function public.study_discussion_people_full(people uuid[], with_profile boolean default false)
returns table(id uuid, is_admin boolean, student_id text, department text, grade smallint, section text, extras jsonb)
language sql stable security definer set search_path = '' as $$
  select profile.id, profile.is_admin, enrollment.student_id, department_option.name, enrollment.grade, enrollment.section,
    case when details.user_id is not null then jsonb_strip_nulls(to_jsonb(details) - 'user_id') end
  from public.study_discussion_people(people) profile
  left join public.study_student_ids viewer on viewer.user_id = (select auth.uid()) and viewer.department is not null
  left join public.study_student_ids enrollment on enrollment.user_id = profile.id and enrollment.department is not null
    and (profile.student_id is not null or (with_profile and profile.id = viewer.user_id))
  left join public.study_departments department_option on department_option.name = enrollment.department
  left join public.study_student_ids eligible on eligible.user_id = profile.id and eligible.department is not null
  left join public.study_profile_details details on details.user_id = eligible.user_id and with_profile
    and viewer.user_id is not null;
$$;

revoke execute on function public.study_department_key(text), public.study_resolve_department(text, smallint, text) from public, anon, authenticated;

notify pgrst, 'reload schema';
commit;
