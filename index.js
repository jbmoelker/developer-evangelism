(function(){

    if('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        enhance();
    }

    function enhance() {
        var widgets = [].slice.call(document.querySelectorAll('[data-offline-widget]'));
        widgets.forEach(function(widget) {
            var input = widget.querySelector('[data-offline-switch]');
            var info = widget.querySelector('[data-offline-info]');

            sendMessage({ action: 'cache.find', url: input.value })
                .then(function(data){
                    setInfo(input, info, data);
                    input.checked = !!data.dateUpdated;
                    input.disabled = false;
                });

            input.addEventListener('change', function(){
                toggleOffline (input, info);
            }, false);
        });
    }

    function toggleOffline (input, info) {
        var url = input.value;
        var action = input.checked ? 'cache.put' : 'cache.delete';
        input.disabled = true;
        console.log('toggle', url);

        sendMessage({ action: action, url: url })
            .then(function(data){
                setInfo(input, info, data);
            })
            .catch(function(err){
                input.cheched = !input.checked;
                console.error(err);
            })
            .then(function(){
                input.disabled = false;
            });
    }

    function setInfo(input, info, data) {
        var text = data.dateUpdated ? 'Updated ' + data.dateUpdated : '(not cached)';
        if(info) {
            info.textContent = text;
        } else {
            input.title = text;
        }
    }

    /**
     * Send a message to the Service Worker controlling this page.
     * Borrowed from https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/post-message
     * @param {*} message
     * @returns {Promise}
     */
    function sendMessage(message) {
        return new Promise(function(resolve, reject) {
            var messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = function(event) {
                if (event.data.error) {
                    reject(event.data.error);
                } else {
                    resolve(event.data);
                }
            };
            navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
        });
    }

}());