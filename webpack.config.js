const path = require('path');
const fs = require('fs');
const webpack = require('webpack')

const pages = fs.readdirSync('./src/pages')
                .reduce((acc, v) => ({ ...acc, [v.replace('.js', '')]: { 
                    import: `./src/pages/${v}`,  
                    library: {
                        name: ['Favia', 'pageModule'],
                        type: 'var'
                    }
                }}), {});

module.exports = {
    devtool: false,
    plugins: [new webpack.SourceMapDevToolPlugin({
        exclude: ['alpine.js', 'runtime.js']
    })],  
    entry: {...pages, index: { 
        import: './src/index.js',
        library: {
            // all options under `output.library` can be used here
            name: 'Favia',
            type: 'var'
          },

    }},
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        // chunkLoading: 'import', 
        chunkFormat: 'array-push'
    },
    optimization: {
        runtimeChunk: "single",
        removeEmptyChunks: false,
        minimize: false,
        splitChunks: {
            cacheGroups: {
                alpinejs: {
                    minSize: 0,
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]alpinejs/,
                    
                    name() {
                        return 'alpine'
                    }
                  },

                //   commons: {
                //     name: 'commons',
                //     minSize: 0,
                //     chunks: 'all',
                //     test: /[\\/]node_modules[\\/]/,
                //     priority: -10,
                //     reuseExistingChunk: true,
                //   },
            }
        },

        
    },
};