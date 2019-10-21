/* eslint no-console: "off" */

'use strict'

const chalk = require('chalk')
const path = require(`path`)
const PATHS = require('./config/paths')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const mainProcess = require(`./packages/main-process/webpack.config.ci`)
const rootProcess = require(`./packages/root-process/webpack.config.ci`)
const securityProcess = require(`./packages/security-process/webpack.config.ci`)

let envConfig = {}
let manifestCacheBust = new Date().getTime()

try {
  envConfig = require(PATHS.envConfig + `/${process.env.NODE_ENV}` + '.js')
} catch (e) {
  console.log(
    chalk.red('\u{1F6A8} WARNING \u{1F6A8} ') +
      chalk.yellow(
        `Failed to load ${
          process.env.NODE_ENV
        }.js config file! Using the production config instead.\n`
      )
  )
  envConfig = require(PATHS.envConfig + '/production.js')
} finally {
  console.log(chalk.blue('\u{1F6A7} CONFIGURATION \u{1F6A7}'))
  console.log(chalk.cyan('Root URL') + `: ${envConfig.ROOT_URL}`)
  console.log(chalk.cyan('API Domain') + `: ${envConfig.API_DOMAIN}`)
  console.log(
    chalk.cyan('Wallet Helper Domain') +
      ': ' +
      chalk.blue(envConfig.WALLET_HELPER_DOMAIN)
  )
  console.log(
    chalk.cyan('Web Socket URL') + ': ' + chalk.blue(envConfig.WEB_SOCKET_URL)
  )
}

const common = {
  mode: 'production',
  node: {
    fs: 'empty'
  },
  stats: 'verbose',
  optimization: {
    namedModules: true,
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            keep_fnames: true
          },
          mangle: {
            keep_fnames: true
          }
        },
        parallel: true,
        cache: false
      })
    ],
    concatenateModules: true,
    runtimeChunk: {
      name: `manifest.${manifestCacheBust}`
    }
  }
}

module.exports = [
  {
    ...common,
    ...rootProcess({
      envConfig,
      PATHS: {
        ...PATHS,
        ciBuild: path.join(PATHS.ciBuild, `root`)
      }
    })
  },
  {
    ...common,
    ...mainProcess({
      envConfig,
      PATHS: {
        ...PATHS,
        ciBuild: path.join(PATHS.ciBuild, `main`)
      }
    })
  },
  {
    ...common,
    ...securityProcess({
      envConfig,
      PATHS: {
        ...PATHS,
        ciBuild: path.join(PATHS.ciBuild, `security`)
      }
    })
  }
]
