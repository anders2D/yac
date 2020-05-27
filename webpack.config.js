const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');


function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

//=========================================================
//  ENVIRONMENT VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;

const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION = NODE_ENV === 'production';
const ENV_TEST = NODE_ENV === 'test';

const HOST = '0.0.0.0';
const PORT = 3005;



//=========================================================
//  LOADERS
//---------------------------------------------------------
const loaders = {
    js: {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-react","@babel/preset-env"]
          }
        }
      },
    scss: {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
          
        ]
      },
      css: {
        test:/\.css$/,
        use:[
            'style-loader',
            'css-loader',
            'postcss-loader',
        ]
      }
};


//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = {};
module.exports = config;


config.resolve = {
    extensions: ['.ts', '.js'],
    modules: ['node_modules',resolve('/src'),],
    // root: path.resolve('.')
};

config.plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    })
];



//=====================================
//  DEVELOPMENT or PRODUCTION
//-------------------------------------
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {
    config.entry = {
        main: [resolve('src/index.js')]
    };
    // config.context= __dirname + '/src/',
    config.output = {
        filename: '[name].js',
        path: path.resolve('./target'),
        publicPath: '/'
        // path: path.resolve(__dirname, "target"),
        // filename: '[name].bundle.js',
        // publicPath: resolve('/')
    };

    config.plugins.push(
        // new ExtractTextPlugin('styles.[contenthash].css'),
        new HtmlWebpackPlugin({
            // chunkSortMode: 'dependency',
            filename: 'index.html',
            // hash: false,
            // inject: 'body',
            template: resolve('src/index.html')
        })
    );
}


//=====================================
//  DEVELOPMENT
//-------------------------------------
if (ENV_DEVELOPMENT) {
    config.devtool = 'cheap-module-source-map';

    config.entry.main.unshift(
        `webpack-dev-server/client?http://${HOST}:${PORT}`,
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        '@babel/polyfill',
    );

    config.module = {
        rules: [
            loaders.js,
            loaders.scss,
            loaders.css
        ]
    };

    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),

    );

    config.devServer = {
        contentBase:  path.resolve(__dirname, "src"),
        writeToDisk: true,
        historyApiFallback: true,
        host: HOST,
        hot: true,
        port: PORT,
        publicPath: config.output.publicPath,
        stats: {
            cached: true,
            cachedAssets: true,
            chunks: true,
            chunkModules: false,
            colors: true,
            hash: false,
            reasons: true,
            timings: true,
            version: false
        }
    };
}


//=====================================
//  PRODUCTION
//-------------------------------------
if (ENV_PRODUCTION) {
    config.devtool = 'source-map';

    // config.entry.vendor = 'vendor.js';
    config.entry.vendor = resolve('src/vendor.js');
    config.context = resolve('src'),
    config.output.filename = '[name].[chunkhash].js';

    config.module = {
        rules: [
            loaders.js,
            loaders.scss,
            loaders.css
            // { test: /\.scss$/, loader: ExtractTextPlugin.extract('postcss!sass') }

        ]
    };

    config.plugins.push(
        new WebpackMd5Hash(),
        new ExtractTextPlugin('styles.[contenthash].css'),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: true,
        //     compress: {
        //         dead_code: true, // eslint-disable-line camelcase
        //         screw_ie8: true, // eslint-disable-line camelcase
        //         unused: true,
        //         warnings: false
        //     }
        // })
    );
}


//=====================================
//  TEST
//-------------------------------------
if (ENV_TEST) {
    config.devtool = 'inline-source-map';

    config.module = {
        rules: [
            loaders.js,
            loaders.scss,
            loaders.css
        ]
    };
}
