'use strict';

const through = require('through2');
const gutil = require('gulp-util');
const path = require('path');
const PluginError = gutil.PluginError;
const staticI18n = require('static-i18n');

const PLUGIN_NAME = 'gulp-static-i18n-html';

function gulpStaticI18nHtml(options) {

  // need `this` for file pushing, DO NOT use arrow function.
  let transform = function(file, encoding, cb) {

    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    let rawHtml = file.contents.toString(encoding);
    let self = this;

    staticI18n.process(rawHtml, options, (err, results) => {

      if (err) {
        cb(new PluginError(PLUGIN_NAME, err));
      } else {
        Object.keys(results).forEach((locale) => {
          let translatedFile = file.clone();
          translatedFile.path = path.join(file.base, locale, file.relative);
          translatedFile.contents = new Buffer(results[locale]);

          self.push(translatedFile);
        });

        cb();
      }

    });
  };

  return through.obj(transform);
}

module.exports = gulpStaticI18nHtml;
