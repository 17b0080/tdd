import RunTestsBeforeStartPlugin from './RunTestsBeforeStartPlugin';
import CleanWebpackPlugin from './CleanWebpackPlugin';
import StyleLintPlugin from './StyleLintPlugin';
import MiniCssExtractPlugin from './MiniCssExtractPlugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FriendlyErrorsWebpackPlugin from './FriendlyErrorsWebpackPlugin';
import { pagesReg, pagesDir } from '../settings';
import { join, basename, extname } from 'path';
import { sync } from 'glob';


const pages = sync(pagesReg);
const htmlPlugins = pages.map(pagePath => {
  const pageName = basename(pagePath); // page.html
  const page = basename(pagePath, extname(pagePath)); // page
  return new HtmlWebpackPlugin({
    template: join(pagesDir, pageName),
    filename: pageName,
    chunks: [page]
  })
})

export default [
  FriendlyErrorsWebpackPlugin,
  RunTestsBeforeStartPlugin,
  CleanWebpackPlugin,
  StyleLintPlugin,
  MiniCssExtractPlugin,
  ...htmlPlugins
]