import merge from 'webpack-merge';
import common from './webpack.common.babel';
import BabelMinifyPlugin from 'babel-minify-webpack-plugin';

export default merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new BabelMinifyPlugin()],
  },
});