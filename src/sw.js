var CACHE_PREFIX = 'developer-evangelism-';
var CACHE_VERSION = 'v1';
var CACHE_CORE = CACHE_PREFIX + 'core-' + CACHE_VERSION;
var CACHE_HTML = CACHE_PREFIX + 'html-' + CACHE_VERSION;

self.addEventListener('install', function(event){
   event.waitUntil(
       caches.open(CACHE_CORE).then(function(cache){
           return cache.addAll([
               './',
               './404/',
               './index.js',
               new Request('https://i.creativecommons.org/l/by-nc-nd/2.0/uk/88x31.png', {mode: 'no-cors'})
           ]);
       })
   )
});

self.addEventListener('activate', function(event){
   event.waitUntil(
       caches.keys().then(function(cacheNames) {
           return Promise.all(
               cacheNames
                   .filter(function(cacheName){
                       return cacheName.startsWith(CACHE_PREFIX);
                   })
                   .filter(function(cacheName){
                       return !cacheName.endsWith(CACHE_VERSION);
                   })
                   .map(function(cacheName) {
                       return caches.delete(cacheName)
                   })
           );
       })
   )
});

self.addEventListener('message', function(event){
    var actions = ['cache.put', 'cache.delete', 'cache.find'];
    if (event.data && actions.indexOf(event.data.action) > -1) {
        handleActionEvent(event);
    }
});

self.addEventListener('fetch', function(event) {
    // serve HTML files from cache when available
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
        .catch(function() {
            if (isHtmlRequest(event.request)) {
                return caches.match('./404/');
            } else {
                console.log('couldn\'t get response for', event.request.url);
            }
        })
    );
});

function isHtmlRequest(request) {
    return (request.headers.get('Accept').indexOf('text/html') !== -1);
}

function handleActionEvent(event) {

    var request;

    return caches.open(CACHE_HTML).then(function(cache) {

        switch (event.data.action) {
            case 'cache.find':
                request = new Request(event.data.url);
                return cache.match(request).then(function (response) {
                    event.ports[0].postMessage({
                        error: null,
                        dateUpdated: response ? response.headers.get('Date') : null
                    });
                    return response;
                });
                break;

            case 'cache.put':
                request = new Request(event.data.url, {mode: 'no-cors'});
                return fetch(request).then(function (response) {
                    cache.put(request, response.clone());
                    event.ports[0].postMessage({
                        error: null,
                        dateUpdated: response.headers.get('Date')
                    });
                    return response;
                });
                break;

            case 'cache.delete':
                request = new Request(event.data.url);
                return cache.delete(request).then(function (success) {
                    event.ports[0].postMessage({
                        error: success ? null : 'Item not in cache.'
                    });
                });
                break;

            default:
                throw Error('Unknown action: ' + event.data.action);
                break;
        }

    }).catch(function(error) {
        console.error('Message handling failed:', error);
        event.ports[0].postMessage({
            error: error.toString()
        });
    });
}