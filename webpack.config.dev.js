const path = require('path');

module.exports = {
    mode: "development",
    // entry: {index: './src/index.js'},
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist_dev'),
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