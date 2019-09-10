import merge from 'webpack-merge';
import common from './webpack.common.babel';

export default merge(common, {
  mode: 'development',
  devServer: {
    port: 4000,
    hot: true,
    liveReload: false,
    open: true,
    quiet: true
  },
});