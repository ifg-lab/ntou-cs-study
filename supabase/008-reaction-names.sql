begin;

create function public.study_reaction_names(target_thread uuid, target_message uuid, chosen_emoji text)
returns table(nicknames text[], total bigint)
language sql stable security definer set search_path = '' as $$
  select coalesce((array_agg(coalesce(p.nickname, '同學') order by lower(p.nickname), e.user_id))[1:4], '{}'::text[]), count(*)
  from public.study_reactions e
  join public.study_threads t on t.id = e.thread_id and t.hidden_at is null
  left join public.study_replies r on r.id = e.reply_id
  left join public.study_profiles p on p.id = e.user_id
  where e.thread_id = target_thread and e.message_id = target_message and e.emoji = chosen_emoji
    and ((e.reply_id is null and t.deleted_at is null) or (r.id is not null and r.hidden_at is null and r.deleted_at is null));
$$;

revoke execute on function public.study_reaction_names(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.study_reaction_names(uuid, uuid, text) to anon, authenticated;

notify pgrst, 'reload schema';
commit;
