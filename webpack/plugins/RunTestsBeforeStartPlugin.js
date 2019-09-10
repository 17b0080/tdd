import WebpackShellPlugin from 'webpack-shell-plugin';
import { webpackDir } from '../settings';
import path from 'path';

export default new WebpackShellPlugin({ onBuildStart: ['babel-node ' + path.join(webpackDir, 'prepare.babel.js')] })