import { join } from 'path';

export const baseDir = process.env.PWD;
export const webpackDir = join(baseDir, 'webpack');
export const configDir = join(webpackDir, 'config');
export const srcDir = join(baseDir, 'src');
export const entriesDir = join(srcDir, 'entries');
export const pagesDir = join(srcDir, 'pages');
export const entriesReg = join(entriesDir, '*.jsx');
export const pagesReg = join(pagesDir, '*.html');
