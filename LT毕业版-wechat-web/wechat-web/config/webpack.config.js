
const path = require('path')

const paths = require('./paths')
const shouldI = require('./webpack/shouldI')
const getWebpackOutput = require('./webpack/output')
const getWebpackModule = require('./webpack/module')
const PnpWebpackPlugin = require('pnp-webpack-plugin')
const getWebpackPlugins = require('./webpack/plugins')
const getWebpackOptimization = require('./webpack/optimization')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')

const shouldUseSourceMap = shouldI.shouldUseSourceMap()


// Check if TypeScript is setup
const useTypeScript = shouldI.shouldUseTypescirpt(paths)
//vender three library
const polyfills = require.resolve('./polyfills')

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function(webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'
  const environment = { isEnvProduction, isEnvDevelopment }
  // Webpack uses `publicPath` to determine where the app is being served from.
  // It requires a trailing slash, or the file assets will get an incorrect path.
  // In development, we always serve from the root. This makes config easier.
  const publicPath = isEnvProduction
    ? paths.servedPath
    : isEnvDevelopment && '/'

  // `publicUrl` is just like `publicPath`, but we will provide it to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  const publicUrl = isEnvProduction
    ? publicPath.slice(0, -1)
    : isEnvDevelopment && ''
  // Get environment variables to inject into our app.

  return {
    performance: false,
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    // Stop compilation early in production
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    entry: {
      app: [
        polyfills,
        isEnvDevelopment &&
          require.resolve('react-dev-utils/webpackHotDevClient'),
        paths.appIndexJs
      ].filter(Boolean)
    },
    output: getWebpackOutput({ paths, publicPath, env: environment }),
    optimization: getWebpackOptimization({ env: environment }),
    module: getWebpackModule({
      paths,
      publicPath,
      env: environment
    }),
    plugins: getWebpackPlugins({
      paths,
      publicPath,
      publicUrl,
      env: environment
    }),
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      dgram: 'empty',
      child_process: 'empty'
    },
    resolve: {
      modules: ['node_modules'].concat(
        // It is guaranteed to exist because we tweak it in `env.js`
        process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
      ),
      extensions: paths.moduleFileExtensions
        .map(ext => `.${ext}`)
        .filter(ext => useTypeScript || !ext.includes('ts')),
      alias: {
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
        src: path.join(__dirname, '..', 'src'),
        styles: path.join(__dirname, '..', 'src/', 'assets', 'stylesheets')
      },
      plugins: [
        PnpWebpackPlugin,
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
      ]
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)]
    }
  }
}
