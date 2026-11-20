"use strict";

const pendingChapter = (number, title, english, sourcePdf) => ({
  id: `lecture-${String(number).padStart(2, "0")}`,
  number: String(number).padStart(2, "0"),
  title, english, sourcePdf,
  pending: true
});

const studyCatalog = [
  {"id":"lecture-01","number":"01","title":"概論","english":"Introduction","pages":99,"questions":33,"activities":4,"study":true,"examPoints":100,"bonusPoints":10},
  {"id":"lecture-02","number":"02","title":"資料儲存","english":"Data storage","pages":101,"questions":54,"activities":8,"study":true,"reading":true,"examPoints":100,"bonusPoints":10},
  {"id":"lecture-03","number":"03","title":"資料操作","english":"Data manipulation","pages":63,"questions":36,"activities":6,"study":true,"reading":true,"examPoints":100,"bonusPoints":10},
  {"id":"lecture-04","number":"04","title":"作業系統","english":"Operating systems","pages":89,"questions":38,"activities":5,"study":true,"reading":true,"examPoints":100,"bonusPoints":10},
  {
    id: "lecture-05",
    number: "05",
    title: "網路與網際網路",
    english: "Computer networks",
    pages: 119,
    questions: 161,
    activities: 72,
    study: true,
    reading: true,
    examPoints: 100,
    bonusPoints: 10
  },
  {"id":"lecture-06","number":"06","title":"演算法","english":"Algorithms","pages":91,"questions":46,"activities":21,"study":true,"reading":true,"examPoints":0,"bonusPoints":0},
  pendingChapter(7, "程式語言", "Programming Languages",
    "http://www.deepsea9.taipei/wp-content/uploads/2021/12/Lecture-7-Programming-Languages-Distribute.pdf"),
  pendingChapter(8, "資料抽象", "Data Abstraction",
    "http://www.deepsea9.taipei/wp-content/uploads/2024/12/Lecture-9-Data-Abstratction-Distribute.pdf")
].map(entry => {
  const chapter = Number(entry.number) - 1;
  return { ...entry, chapter, slug: `chapter-${String(chapter).padStart(2, "0")}`, label: `Chapter ${chapter}` };
});
