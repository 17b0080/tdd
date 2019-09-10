export default { // image minification
  test: /\.(jpg|png|gif|svg)$/,
  loader: 'image-webpack-loader',
  enforce: 'pre',
  options: {
    bypassOnDebug: true,
  }
};