const gulpStaticI18nHtml = require('../index');
const path = require('path');
const fs = require('fs');
const expect = require('expect.js');
const File = require('vinyl');
const cheerio = require('cheerio');

describe('gulpStaticI18nHtml', () => {
    let options = {}
    let indexHtmlContent = new Buffer.from('');
    let fakeFile = new File();

    beforeEach(() => {
        options = { localesPath: path.join(__dirname, 'locales') };
        indexHtmlContent = fs.readFileSync('./test/src/index.html');
        fakeFile = new File({
            base: './test/src',
            path: './test/src/index.html',
            contents: indexHtmlContent
        });
    });

    it('should create english translation by default', (done) => {
        const plugin = gulpStaticI18nHtml(options);

        plugin.on('data', (file) => {
            expect(file.isBuffer()).to.be(true);
            const $ = cheerio.load(file.contents.toString())
            expect($('html').attr('lang')).to.be('en');

            const title = $('#title').text();
            const subtitle = $('#subtitle').text();
            expect(title).to.equal('Hello');
            expect(subtitle).to.equal('world');

            const cssLink = $('link[rel=stylesheet]').attr('href');
            const imageLink = $('#image').attr('src');
            expect(cssLink).to.equal('./assets/styles.css');
            expect(imageLink).to.equal('./assets/github.png');

        });

        plugin.on('end', () => {
            done();
        });

        plugin.write(fakeFile);
        plugin.end();
    });

    it('should create multiple translations in sub directories', (done) => {
        // setting more locales
        options.locales = ['en', 'de', 'fr'];

        const plugin = gulpStaticI18nHtml(options);

        plugin.on('data', (file) => {
            expect(file.isBuffer()).to.be(true);

            const $ = cheerio.load(file.contents.toString());
            const language = $('html').attr('lang');

            const title = $('#title').text();
            const subtitle = $('#subtitle').text();

            if (language === 'en') {
                expect(title).to.equal('Hello');
                expect(subtitle).to.equal('world');
            } else if (language === 'de') {
                expect(title).to.equal('Hallo');
                expect(subtitle).to.equal('Welt');

                // make sure locale is prepended to filepath
                expect(file.relative).to.match(/^de\//)
            } else if (language === 'fr') {
                expect(title).to.equal('Bonjour');
                expect(subtitle).to.equal('le monde');

                // make sure locale is prepended to filepath
                expect(file.relative).to.match(/^fr\//)
            }
        });

        plugin.on('end', () => {
            done();
        });

        plugin.write(fakeFile);
        plugin.end();
    });

    it('should fix paths for multiple translations', (done) => {
        // setting more locales
        options.locales = ['en', 'de', 'fr'];

        const plugin = gulpStaticI18nHtml(options);

        plugin.on('data', (file) => {
            expect(file.isBuffer()).to.be(true);

            const $ = cheerio.load(file.contents.toString());
            const language = $('html').attr('lang');

            const cssLink = $('link[rel=stylesheet]').attr('href');
            const imageLink = $('#image').attr('src');

            if (language === 'en') {
                // make sure paths are set correctly
                expect(cssLink).to.equal('./assets/styles.css');
                expect(imageLink).to.equal('./assets/github.png');
            } else if (language === 'de') {
                // make sure paths are set correctly
                expect(cssLink).to.equal('.././assets/styles.css');
                expect(imageLink).to.equal('.././assets/github.png');
            } else if (language === 'fr') {
                // make sure paths are set correctly
                expect(cssLink).to.equal('.././assets/styles.css');
                expect(imageLink).to.equal('.././assets/github.png');
            }
        });

        plugin.on('end', () => {
            done();
        });

        plugin.write(fakeFile);
        plugin.end();
    });

    it('should create translation for a different default locale', (done) => {
        // setting default locale to german
        options.locale = 'de';
        options.locales = ['en', 'de', 'fr'];

        const plugin = gulpStaticI18nHtml(options);

        plugin.on('data', (file) => {
            expect(file.isBuffer()).to.be(true);

            const $ = cheerio.load(file.contents.toString());
            const language = $('html').attr('lang');

            if (language === 'en') {
                // make sure locale is prepended to filepath
                expect(file.relative).to.match(/^en\//)
            } else if (language === 'de') {
                expect(file.relative).to.match(/index.html/)
            } else if (language === 'fr') {
                // make sure locale is prepended to filepath
                expect(file.relative).to.match(/^fr\//)
            }
        });

        plugin.on('end', () => {
            done();
        });

        plugin.write(fakeFile);
        plugin.end();
    });

    it('should not fix paths when disabled', (done) => {
        // setting a second language
        options.locales = ['en', 'de'];
        // disable 'fixPaths'
        options.fixPaths = false;

        const plugin = gulpStaticI18nHtml(options);

        plugin.on('data', (file) => {
            expect(file.isBuffer()).to.be(true);

            const $ = cheerio.load(file.contents.toString());

            const cssLink = $('link[rel=stylesheet]').attr('href');
            const imageLink = $('#image').attr('src');

            // make sure paths are set correctly
            expect(cssLink).to.equal('./assets/styles.css');
            expect(imageLink).to.equal('./assets/github.png');
        });

        plugin.on('end', () => {
            done();
        });

        plugin.write(fakeFile);
        plugin.end();
    })


});