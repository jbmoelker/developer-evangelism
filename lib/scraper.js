/**
 * Scraper: utility to fetch index (toc) and page content from developer-evangelism.com.
 */
module.exports = {
    fetchIndex,
    fetchPage,
    fetchPageBody
};

const promisify = require('bluebird').promisify;
const xray = require('x-ray')();
const origin = 'http://developer-evangelism.com/';

function fetchIndex() {
    return promisify(xray(origin + 'toc.php', '#menu a',
        [{
            title: '',
            url: '@href'
        }]
    ))()
        .then(items => {
            // filter down to unique pages (first with unique url without hash)
            items = items
                .map(item => {
                    item.url = item.url.split('#')[0];
                    item.slug = item.url.replace(/^.*\/|\.[^.]*$/g, '');
                    return item;
                })
                .filter(item => item.slug !== 'toc');

            var mainItems = [];
            var urls = [];

            items.forEach(item => {
                if(urls.indexOf(item.url) === -1) {
                    urls.push(item.url);
                    mainItems.push(item);
                }
            });

            return mainItems;
        });
}

function fetchPage(item) {
    return fetchPageBody(item.url)
        .then(body => {
            return {
                title: item.title,
                body: body
            }
        });
}

//fetchPageBody('http://developer-evangelism.com/handbook.php')
//    .then(page => console.log(JSON.stringify(page, null, '\t')) )
//    .catch(err => console.log('error', err));

function fetchPageBody(url) {
    return promisify(xray(url, ['.mainsection@html']))()
        .then(sections => sections.join(''));
}