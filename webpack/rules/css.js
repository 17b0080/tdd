import { loader } from 'mini-css-extract-plugin';
import { configDir } from '../settings';

export default {
  test: /\.(sa|sc|c)ss$/,
  use: [
    { loader },
    {
      loader: 'css-loader',    // css @import/url() -> js import/require()
      options: { importLoaders: 1 },
    },
    {
      loader: 'postcss-loader', // sass, minimizations, full paths
      options: {
        config: {
          path: configDir
        }
      }
    },
  ],
};