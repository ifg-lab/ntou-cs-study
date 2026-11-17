"use strict";

const StudyCommunitySync = (() => {
  const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
  const snapshot = value => ({
    done: [...(value?.done ?? [])].sort((a, b) => a - b),
    practice: Object.fromEntries(Object.entries(value?.practice ?? {}).sort()),
    lastPage: value?.lastPage ?? 1,
    lastReadAt: value?.lastReadAt ?? null,
    review: (value?.review ?? []).map(({ type, id, title, page, addedAt, mastered }) =>
      ({ type, id, title, page, addedAt, mastered })).sort((a, b) => reviewKey(a).localeCompare(reviewKey(b))),
    notes: Object.fromEntries(Object.entries(value?.notes ?? {}))
  });
  const reviewKey = item => `${item.type}:${item.id}`;
  const hasRecords = value => value && (value.lastReadAt || value.done.length || Object.keys(value.practice).length || value.review.length || Object.keys(value.notes ?? {}).length);

  function mergeEntries(before, local, remote) {
    const output = new Map(remote);
    for (const key of new Set([...before.keys(), ...local.keys()])) {
      if (same(before.get(key), local.get(key))) continue;
      if (local.has(key)) output.set(key, local.get(key));
      else output.delete(key);
    }
    return output;
  }

  function merge(before, local, remote) {
    const pages = data => new Map(data.done.map(page => [page, page]));
    const answers = data => new Map(Object.entries(data.practice));
    const favorites = data => new Map(data.review.map(item => [reviewKey(item), item]));
    const position = (local.lastReadAt ?? 0) > (remote.lastReadAt ?? 0) ? local : remote;
    return snapshot({
      done: [...mergeEntries(pages(before), pages(local), pages(remote)).values()],
      practice: Object.fromEntries(mergeEntries(answers(before), answers(local), answers(remote))),
      review: [...mergeEntries(favorites(before), favorites(local), favorites(remote)).values()],
      notes: Object.fromEntries(mergeEntries(new Map(Object.entries(before.notes)), new Map(Object.entries(local.notes)), new Map(Object.entries(remote.notes)))),
      lastPage: position.lastPage,
      lastReadAt: position.lastReadAt
    });
  }

  function create(client, site, id, report) {
    const baselineKey = `ntou-cs-study-sync:${id}`;
    let baseline = {};
    try { baseline = JSON.parse(localStorage.getItem(baselineKey) || "{}") ?? {}; } catch {}
    let active = true, running, unsaved = false, timer;

    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(() => sync().catch(() => {}), 650);
    }

    async function sync(guest = {}) {
      if (!active) return;
      if (running) {
        if (!Object.keys(guest).length) return running;
        await running;
      }
      if (!active) return;
      running = transfer(guest);
      try { await running; }
      finally { running = undefined; }
    }

    async function transfer(guest) {
      unsaved = false;
      report("正在同步學習紀錄…");
      try {
        const { data, error } = await client.from("study_course_progress")
          .select("course_id, revision, progress").eq("user_id", id);
        if (error) throw error;
        const rows = new Map(data.map(row => [row.course_id, row]));
        for (const entry of site.courses) {
          if (!active) return;
          const key = entry.id;
          const current = site.getCourses()[key];
          const incoming = guest[key];
          let row = rows.get(key);
          if (!row && !hasRecords(current) && !hasRecords(incoming)) continue;
          const before = snapshot(baseline[key]);
          const initial = snapshot(current);
          for (let attempt = 0; attempt < 4; attempt++) {
            if (!active) return;
            const remote = snapshot(row?.progress);
            let next = merge(before, initial, remote);
            if (hasRecords(incoming)) next = merge(snapshot(), snapshot(incoming), next);
            if (!same(next, remote)) {
              const { data: saved, error: saveError } = await client.rpc("study_save_progress", {
                account_id: id, target_course: key, expected: row?.revision ?? 0, payload: next
              });
              if (saveError) throw saveError;
              if (!saved) {
                const latest = await client.from("study_course_progress").select("revision, progress")
                  .eq("user_id", id).eq("course_id", key).maybeSingle();
                if (latest.error) throw latest.error;
                row = latest.data;
                if (attempt === 3) throw new Error("Concurrent updates");
                continue;
              }
            }
            if (!active) return;
            const live = snapshot(site.getCourses()[key]);
            const combined = merge(initial, live, next);
            baseline[key] = next;
            try { localStorage.setItem(baselineKey, JSON.stringify(baseline)); } catch {}
            if (!same(live, combined)) site.applySyncedCourse(key, entry, combined);
            if (!same(combined, next)) unsaved = true;
            break;
          }
        }
        if (active) report("學習紀錄已同步。");
      } catch (error) {
        if (active) report("同步暫時失敗，紀錄仍可在這台裝置使用。", true);
        throw error;
      } finally {
        if (active && unsaved) schedule();
      }
    }

    return {
      changed() { unsaved = true; schedule(); }, sync,
      stop() { active = false; clearTimeout(timer); }
    };
  }

  return { create, hasRecords, snapshot };
})();
