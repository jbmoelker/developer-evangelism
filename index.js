const fs = require('fs');
const mkdirp = require('mkdirp');
const Renderer = require('./lib/renderer');
const scraper = require('./lib/scraper');


const paths = {
    dist: './dist/',
    src: './src/'
};
const renderer = Renderer({ searchPaths: [paths.src] });


createApp()
    .catch(err => console.log('error', err));


function createApp() {
    return scraper.fetchIndex()
        .then(items => {
            return Promise.all([
                createIndex(items),
                items.forEach(item => createPage(item))
            ]);
        });
}

function createIndex(items) {
    return renderer.render('index.html', { items, root: '' })
        .then(html => {
            mkdirp(paths.dist, function(err) {
                fs.writeFile(`${paths.dist}index.html`, html);
                fs.writeFile(`${paths.dist}index.json`, JSON.stringify(items, null, '\t'));
                console.log('created toc index');
            });
        });
}

function createPage(item) {
    return scraper.fetchPage(item)
        .then(page => {
            renderer.render('views/page.html', { page, root: '../' })
                .then(html => {
                    const outputDir = `${paths.dist}${item.slug}/`;
                    mkdirp(outputDir, function(err) {
                        fs.writeFile(`${outputDir}/index.html`, html);
                        fs.writeFile(`${outputDir}/index.json`, JSON.stringify(page, null, '\t'));
                        console.log('created page', item.title);
                    });
                });
        });
}