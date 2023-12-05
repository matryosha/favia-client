const path = require('path');
const fs = require('fs');

const pages = fs.readdirSync('./src/pages')
                .reduce((acc, v) => ({ ...acc, [v.replace('.js', '')]: `./src/pages/${v}` }), {});

module.exports = {
    // mode: "development",
    entry: {...pages, index: { 
        import: './src/index.js',
        library: {
            // all options under `output.library` can be used here
            name: 'Favia',
            type: 'var'
          },

    }},
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        // chunkLoading: 'import', 
        chunkFormat: 'array-push'
    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            name: 'commons'
        },
    },
};