/**
 * Renderer:
 */
module.exports = renderer;

const nunjucks = require('nunjucks');

function renderer(options) {
    const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(options.searchPaths));

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