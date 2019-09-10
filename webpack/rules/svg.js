export default { // svg -> BASE64
  test: /\.svg$/,
  loader: 'svg-url-loader',
  options: {
    limit: 10 * 1024,
    noquotes: true,
  }
};