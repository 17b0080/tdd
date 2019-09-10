/**
 * TODO:
 * + 1. Разделить по папкам webpack/{config, plugins, rules ...}
 * + 2. Завести import/export
 * + 3. Выполнить проверку наличия входных (*) и страниц
 * 4. ...
 */
import path from 'path';
import glob from 'glob-promise';
import { entriesReg, pagesReg } from './settings';
import { to, compare } from './tools';


(async () => {
  const [entries] = await to(glob(entriesReg));
  const [pages] = await to(glob(pagesReg));

  const result = compare(
    entries.map((entry) => {
      return path.basename(entry, path.extname(entry));
    }),
    pages.map((page) => {
      return path.basename(page, path.extname(page))
    })
  );

  if (!result) throw new Error("Страницы и входные (*) отличаются.");
})()