begin;

create function public.study_hide_deleted_reply(target_thread uuid, target_reply uuid) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if not public.study_is_owner() then raise insufficient_privilege; end if;
  update public.study_replies
    set hidden_at = now()
    where thread_id = target_thread and id = target_reply and deleted_at is not null and hidden_at is null;
  return found;
end;
$$;

revoke execute on function public.study_hide_deleted_reply(uuid, uuid) from public, anon, authenticated;
grant execute on function public.study_hide_deleted_reply(uuid, uuid) to authenticated;

notify pgrst, 'reload schema';
commit;
