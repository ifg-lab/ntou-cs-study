insert into public.study_units (course_id, unit_id, title, first_page, last_page) values
  ('lecture-06', 'foundations', '演算法的概念', 1, 11),
  ('lecture-06', 'pseudocode', '寫出演算法', 12, 17),
  ('lecture-06', 'discovery', '從問題找解法', 18, 23),
  ('lecture-06', 'iteration', '迭代與插入排序', 24, 32),
  ('lecture-06', 'recursion', '遞迴與二元搜尋', 33, 40),
  ('lecture-06', 'graphs', '生成樹與迷宮', 41, 51),
  ('lecture-06', 'efficiency', '如何比較效率', 52, 60),
  ('lecture-06', 'analysis', '操作計數與成長率', 61, 81),
  ('lecture-06', 'correctness', '正確性與迴圈不變量', 82, 91)
on conflict (course_id, unit_id) do update set
  title = excluded.title, first_page = excluded.first_page, last_page = excluded.last_page;
