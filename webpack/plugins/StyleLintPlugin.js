import StyleLintPlugin from 'stylelint-webpack-plugin';
import { configDir } from '../settings';
import { join } from 'path';
export default new StyleLintPlugin({
  fix: true,
  configFile: join(configDir, 'stylelint.config.js')
})