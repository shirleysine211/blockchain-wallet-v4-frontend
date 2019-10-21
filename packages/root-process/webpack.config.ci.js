'use strict'
const babelConfig = require(`./babel.config.js`)
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require(`path`)
const R = require(`ramda`)
const Webpack = require('webpack')

const src = path.join(__dirname, `src`)

module.exports = ({ envConfig, PATHS }) => ({
  name: `root`,
  entry: ['@babel/polyfill', path.join(src, 'index.js')],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'thread-loader', options: { workerParallelJobs: 50 } },
          { loader: 'babel-loader', options: babelConfig }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|ico|webmanifest|xml)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]'
          }
        }
      }
    ]
  },
  output: {
    filename: `index.js`,
    path: PATHS.ciBuild
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(src, 'index.html'),
      filename: 'index.html'
    }),
    new Webpack.DefinePlugin(
      R.map(
        JSON.stringify,
        R.pick([`MAIN_PROCESS_URL`, `SECURITY_PROCESS_URL`], envConfig)
      )
    )
  ]
})
