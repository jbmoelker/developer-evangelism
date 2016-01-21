const Renderer = require('./lib/renderer');
const saveFile = require('./lib/save-file');
const scraper = require('./lib/scraper');

const paths = {
    dist: './dist/',
    src: './src/'
};
const renderer = Renderer({ searchPaths: [paths.src] });


createApp()
    .catch(err => console.log('error', err));


function createApp() {
    return Promise.all([
        createAll(),
        createAboutPage(),
        createIntroPage()
    ]);
}

function createAll() {
    return scraper.fetchIndex()
        .then(items => Promise.all([
            createIndex(items),
            items.forEach(item => createPage(item))
        ]));
}

function createIndex(items) {
    return renderer.render('index.html', { items, root: '' })
        .then(html => Promise.all([
            saveFile(`${paths.dist}/index.html`, html),
            saveFile(`${paths.dist}/index.json`, JSON.stringify(items, null, '\t'))
        ]));
}

function createAboutPage() {
    return scraper.fetchAboutPage()
        .then(page => renderPage(page));
}

function createIntroPage() {
    return scraper.fetchIntroPage()
        .then(page => renderPage(page));
}

function createPage(item) {
    return scraper.fetchPage(item)
        .then(page => renderPage(page));
}

function renderPage(page) {
    return renderer.render('views/page.html', { page, root: '../' })
        .then(html => Promise.all([
            saveFile(`${paths.dist}${page.slug}/index.html`, html),
            saveFile(`${paths.dist}${page.slug}/index.json`, JSON.stringify(page, null, '\t'))
        ]));
}