"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const read = name => fs.readFileSync(path.join(root, name), "utf8");
const catalog = vm.runInNewContext(`${read("assets/catalog.js")}\nstudyCatalog`);
const quote = value => "'" + value.replaceAll("'", "''") + "'";
const rows = [];

for (const entry of catalog.filter(course => !course.pending)) {
  vm.runInNewContext(read(`assets/${entry.id}/data.js`), {
    StudySite: { registerCourse: course => {
      for (const unit of course.units) rows.push(
        `  (${[course.id, unit.id, unit.title].map(quote).join(", ")}, ${unit.start}, ${unit.end})`
      );
    } }
  });
}

process.stdout.write(`insert into public.study_units (course_id, unit_id, title, first_page, last_page) values
${rows.join(",\n")}
on conflict (course_id, unit_id) do update set
  title = excluded.title, first_page = excluded.first_page, last_page = excluded.last_page;
`);
