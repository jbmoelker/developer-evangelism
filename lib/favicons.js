/**
 * Favicons: utility to generate favicons and device icons for practically every browser.
 */

create('src/icon.png', getConfig())
    .then(response => {
        const dir = 'dist/';
        saveFiles(response.files, dir);
        saveFiles(response.images, dir);
        console.log(`created favicons in ${dir}`)
    })
    .catch(error => console.error(error));

/**
 * Create favicons
 * @param source
 * @param options
 * @returns {Promise}
 */
function create(source, options) {
    const favicons = require('favicons'); // see https://github.com/haydenbleasel/favicons

    return new Promise(function(resolve, reject) {
        favicons(source, options, function(error, response) {
            if (error) {
               reject(error);
            }
            resolve(response);
        });
    });
}

function getConfig() {
    const pkg = require('./../package.json');
    const author = pkg.author[0];
    return {
        appName: pkg.name,              // Your application's name. `string`
        appDescription: pkg.description,// Your application's description. `string`
        developerName: author.name,     // Your (or your developer's) name. `string`
        developerURL: author.url,       // Your (or your developer's) URL. `string`
        background: "#F1DC3F",          // Background colour for flattened icons. `string`
        path: `./`,                     // Path for overriding default icons path. `string`
        url: pkg.homepage,              // Absolute URL for OpenGraph image. `string`
        display: "browser",             // Android display: "browser" or "standalone". `string`
        orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string`
        version: pkg.version,           // Your application's version number. `number`
        logging: false,                 // Print logs to console? `boolean`
        online: false,                  // Use RealFaviconGenerator to create favicons? `boolean`
        icons: {
            android: true,              // Create Android homescreen icon. `boolean`
            appleIcon: true,            // Create Apple touch icons. `boolean`
            appleStartup: false,        // Create Apple startup images. `boolean`
            coast: false,               // Create Opera Coast icon. `boolean`
            favicons: true,             // Create regular favicons. `boolean`
            firefox: true,              // Create Firefox OS icons. `boolean`
            opengraph: false,           // Create Facebook OpenGraph image. `boolean`
            twitter: false,             // Create Twitter Summary Card image. `boolean`
            windows: true,              // Create Windows 8 tile icons. `boolean`
            yandex: false               // Create Yandex browser icon. `boolean`
        }
    };
}

function saveFiles(files, dir) {
    const fs = require('fs');
    const path = require('path');

    files.forEach(file => {
        fs.writeFileSync(path.join(dir, file.name), file.contents);
    });
}