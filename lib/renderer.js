/**
 * Renderer: utility to render templates with data to HTML.
 * Uses (promisified version of) Nunjucks to render Django style templates.
 */
module.exports = renderer;

const nunjucks = require('nunjucks'); // https://mozilla.github.io/nunjucks/

/**
 * Renderer
 * @param {Object} options
 * @param {String[]} options.searchPaths    paths to look for templates
 * @returns {{render: render}}
 */
function renderer(options) {
    const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(options.searchPaths));

    /**
     * Render
     * @param {String} path     to template file
     * @param {Object} context  available as global data in template
     * @returns {Promise}       resolves with rendered HTML
     */
    function render(path, context) {
        return new Promise(function(resolve, reject) {
            env.render(path, context, function(err, html) {
                if (err) {
                    reject(err);
                }
                resolve(html);
            });
        });
    }

    return { render };
}