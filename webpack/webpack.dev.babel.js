import merge from 'webpack-merge';
import common from './webpack.common.babel';
import BrowserSyncWebpackPlugin from './plugins/BrowserSyncWebpackPlugin';
import { host } from './tools';

export default merge(common, {
  mode: 'development',
  plugins: [BrowserSyncWebpackPlugin],
  devServer: {
    host,
    port: 4000,
    hot: true,
    liveReload: false,
    open: false,
    quiet: true
  },
});