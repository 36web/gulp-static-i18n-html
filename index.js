'use strict';

const through = require('through2');
const path = require('path');
const PluginError = require('plugin-error');
const staticI18n = require('static-i18n');

const PLUGIN_NAME = 'gulp-static-i18n-html';

/**
 * Some standard options taken
 * from 'static-i18n'
 */
const DEFAULT_OPTIONS = {
  locale: 'en',
  locales: ['en']
};

function gulpStaticI18nHtml(options) {

  // need `this` for file pushing, DO NOT use arrow function.
  let transform = async function(file, encoding, cb) {

    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    let self = this;
    options = Object.assign(DEFAULT_OPTIONS, options);

    /**
     * Set 'baseDir' to base of file.
     * This is typically where a glob starts.
     */
    options.baseDir = file.base;

    /**
     * Needs to be 'null' otherwise translated
     * files are generated automatically
     */
    options.outputDir = null;

    const results = await staticI18n.processFile(file.path, options).catch((err) => cb(new PluginError(PLUGIN_NAME, err)));

    Object.keys(results).forEach((locale) => {
      let translatedFile = file.clone();

      if (options.locale && options.locale === locale) {
        translatedFile.path = file.path;
      } else {
        translatedFile.path = path.join(file.base, locale, file.relative);
      }

      translatedFile.contents = new Buffer.from(results[locale]);

      self.push(translatedFile);
    });
    cb();
  };

  return through.obj(transform);
}

module.exports = gulpStaticI18nHtml;
