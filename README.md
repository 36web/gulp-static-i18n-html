# gulp-static-i18n-html
A gulp plugin helps generating i18n HTML.



## Installation

```sh
$ npm install --save-dev gulp-static-i18n-html
```



## Usage

```javascript
var staticI18nHtml = require('gulp-static-i18n-html');

gulp.task('i18n', function() {
  return gulp.src('**/*.html')
    .pipe(staticI18nHtml({
      locales: ['en-us', 'zh-tw']
    }))

    .pipe(gulp.dest('./dist'));
});
```

See [node-static-i18n](https://github.com/claudetech/node-static-i18n) documentation for more information.

