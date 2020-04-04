import BrowserSyncWebpackPlugin from 'browser-sync-webpack-plugin';
import { host } from '../tools';

export default new BrowserSyncWebpackPlugin({
  host,
  port: 8000,
  proxy: `http://${host}:4000/`,
  reload: false,
  notify: false,
  logLevel: 'silent',
});