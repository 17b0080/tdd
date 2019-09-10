import plugins from './plugins';
import entry from './entry';
import rules from './rules';

export default {
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  entry,
  plugins,
  module: { rules },
}
