# gulp-static-i18n-html
A gulp plugin which helps generating i18n HTML.



## Installation

```sh
$ npm install --save-dev gulp-static-i18n-html
```



## Usage

Please make sure to provide a `__LANG__.json` file in your `locales` directory for each translation that you add to the `options.locales` list. In the following example we want any html file to be translated using the translation files for english (`en.json`), french (`fr.json`) and german (`de.json`).

```javascript
var staticI18nHtml = require('gulp-static-i18n-html');

gulp.task('i18n', function() {
  return gulp.src('**/*.html')
    .pipe(staticI18nHtml({
      locale: 'en',
      locales: ['en', 'fr', 'de']
    }))
    .pipe(gulp.dest('./dist'));
});
```

This results in the following directory structure:

```
dist/
|
+-- index.html (<-- the english version)
|
+-- fr/
|   |
|   +-- index.html (<-- the french version)
|
+-- de/
|   |
|   +-- index.html (<-- the german version)
+
```
By default, all relative links e.g. for stylesheets or images are edited automatically to fit to new folder structure. In the example above
```<link rel="stylesheet" href="./assets/styles.css">```
remains the same for the english version but becomes
```<link rel="stylesheet" href=".././assets/styles.css">```
for the french and german version. If you want to disabled this behaviour set `options.fixPaths: false`.

See [node-static-i18n](https://github.com/claudetech/node-static-i18n) documentation for more information.

