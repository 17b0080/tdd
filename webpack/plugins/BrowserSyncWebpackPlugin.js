import BrowserSyncWebpackPlugin from 'browser-sync-webpack-plugin';

export default new BrowserSyncWebpackPlugin({
  host: 'localhost',
  port: 8000,
  proxy: 'http://localhost:4000/',
  reload: false,
  notify: false,
  logLevel: 'silent',
});