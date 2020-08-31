const ShouldI = require('./shouldI')
const { getStyleLoaders } = require('./loaders')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

/**
 * props: {
 *  paths: Object
 *  publicPath: string
 *  env: { isEnvDevelopment, isEnvProduction }
 * }
 *
 * @param {*} props
 * @returns
 */
function getWebpackModule(props) {
  const {
    paths,
    publicPath,
    env,
    env: { isEnvProduction, isEnvDevelopment }
  } = props
  return {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },

      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { transpileOnly: true }
      },

      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        enforce: 'pre',
        include: paths.appSrc,
        use: [
          {
            options: {
              formatter: require.resolve('react-dev-utils/eslintFormatter'),
              eslintPath: require.resolve('eslint')
            },
            loader: require.resolve('eslint-loader')
          }
        ]
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: [
              /\.bmp$/,
              /\.gif$/,
              /\.jpe?g$/,
              /\.png$/,
              /\.svg$/,
              /\.(eot|ttf|woff|woff2|otf)$/
            ],
            loader: require.resolve('url-loader'),
            options: {
              limit: 100,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          // Process application JS with Babel.
          // The preset includes JSX, Flow, TypeScript, and some ESnext features.
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),
              plugins: [
                [require.resolve('babel-plugin-date-fns')],
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-prettier,-svgo![path]'
                      }
                    }
                  }
                ]
              ],
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              cacheCompression: isEnvProduction,
              compact: isEnvProduction
            }
          },

          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  require.resolve('babel-preset-react-app/dependencies'),
                  { helpers: true }
                ]
              ],
              cacheDirectory: true,
              cacheCompression: isEnvProduction,
              sourceMaps: false
            }
          },
          {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            use: getStyleLoaders({
              env,
              publicPath,
              cssOptions: {
                importLoaders: 1,
                sourceMap: isEnvProduction && ShouldI.shouldUseSourceMap()
              }
            }),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true
          },
          // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
          // using the extension .module.css
          {
            test: /\.module\.css$/,
            use: getStyleLoaders({
              env,
              publicPath,
              cssOptions: {
                modules: true,
                importLoaders: 1,
                getLocalIdent: getCSSModuleLocalIdent,
                sourceMap: isEnvProduction && ShouldI.shouldUseSourceMap()
              }
            })
          },
          // Opt-in support for SASS (using .scss or .sass extensions).
          // By default we support SASS Modules with the
          // extensions .module.scss or .module.sass
          {
            test: /\.(scss|sass)$/,
            exclude: /\.module\.(scss|sass)$/,
            use: getStyleLoaders({
              env,
              publicPath: publicPath,
              preProcessor: 'sass-loader',
              cssOptions: {
                importLoaders: 2,
                sourceMap: isEnvProduction && ShouldI.shouldUseSourceMap()
              }
            }),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true
          },
          // Adds support for CSS Modules, but using SASS
          // using the extension .module.scss or .module.sass
          {
            test: /\.module\.(scss|sass)$/,
            use: getStyleLoaders({
              publicPath,
              preProcessor: 'sass-loader',
              env: { isEnvDevelopment, isEnvProduction },
              cssOptions: {
                modules: true,
                importLoaders: 2,
                getLocalIdent: getCSSModuleLocalIdent,
                sourceMap: isEnvProduction && ShouldI.shouldUseSourceMap()
              }
            })
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [
              /\.(js|mjs|jsx|ts|tsx)$/,
              /\.html$/,
              /\.(js|jsx)$/,
              /\.css$/,
              /\.scss$/,
              /\.json$/,
              /\.bmp$/,
              /\.gif$/,
              /\.jpe?g$/,
              /\.png$/,
              /\.svg$/
            ],
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ]
      }
    ]
  }
}

module.exports = getWebpackModule
