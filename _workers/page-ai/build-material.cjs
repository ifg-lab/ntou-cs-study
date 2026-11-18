"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "../..");
const courses = Object.create(null);
const scope = vm.createContext({
  StudySite: {
    registerCourse(course) {
      courses[course.id] = Object.fromEntries(course.slides.map(slide => {
        const unit = course.units.find(item => item.start <= slide.page && slide.page <= item.end);
        const glossary = slide.terms.map(name => {
          const term = course.terms.get(name);
          return term ? `${term.english} · ${term.chinese} — ${term.explanation}` : name;
        });
        return [slide.page, {
          page: slide.page,
          title: slide.title,
          unit: unit?.id,
          notes: [...slide.paragraphs, slide.exam, ...glossary].filter(Boolean).join("\n").slice(0, 950)
        }];
      }));
    }
  }
});
const run = file => vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), scope, { filename: file });
run("assets/catalog.js");
const published = vm.runInContext("studyCatalog.filter(entry => !entry.pending)", scope);
for (const course of published) {
  run(`assets/${course.id}/data.js`);
  if (Object.keys(courses[course.id] ?? {}).length !== course.pages) throw Error(`Missing page material for ${course.id}`);
}

const destination = path.join(__dirname, ".generated");
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, "material.json"), JSON.stringify(courses));
console.log(`Prepared ${published.reduce((count, course) => count + course.pages, 0)} published pages for Workers AI.`);
