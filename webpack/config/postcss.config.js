module.exports = {
  ident: 'postcss',
  plugins: {
    'postcss-import': {}, // Ищет путь импорта @import 'foo' -> @import 'node_modules/foo/index.css', @import 'baz.css' -> @import 'node_modules/**/baz.css'
    'precss': {},         // Разметка как у sass
    'cssnano': {},        // Модульный минимизатор
  },
};
