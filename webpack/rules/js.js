import { configDir } from '../settings';
import { join } from 'path';

export default {
  test: /\.js(x)?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "babel-loader",
      options: {
        configFile: join(configDir, 'babel.config.js')
      }
    },
    {
      loader: 'eslint-loader',
      options: {
        fix: true,
        configFile: join(configDir, 'eslint.config.js')
      }
    },
  ],
}