const ShouldI = require('./shouldI')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/**
 * props: {
 *  publicPath,
 *  env: { isEnvDevelopment, isEnvProduction }
 * }
 * common function to get style loaders
 * @export
 * @param {*} props
 * @returns
 */
function getCommonStyleLoaders(props) {
  let loaders = []

  const {
    publicPath,
    cssOptions,
    env: { isEnvDevelopment, isEnvProduction }
  } = props

  if (isEnvDevelopment) {
    loaders.push(require.resolve('style-loader'))
  }

  if (isEnvProduction) {
    loaders.push({
      loader: MiniCssExtractPlugin.loader,
      options: Object.assign(
        {},
        // TODO CHECK
        ShouldI.shouldUseRelativeAssetPaths(publicPath)
          ? { publicPath: '../../' }
          : undefined
      )
    })
  }

  loaders.push({
    loader: require.resolve('css-loader'),
    options: cssOptions || {}
  })

  loaders.push({
    loader: require.resolve('postcss-loader'),
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        })
      ],
      sourceMap: isEnvProduction && ShouldI.shouldUseSourceMap()
    }
  })

  return loaders
}

/**
 *
 * props: {
 *  publicPath: string,
 *  cssOptions?: Object,
 *  preProcessor?: string
 *  env: { isEnvDevelopment: boolean, isEnvProduction: boolean }
 * }
 * @param {*} props
 * @returns
 */
function getStyleLoaders(props) {
  const {
    preProcessor,
    env: { isEnvProduction }
  } = props
  let loaders = getCommonStyleLoaders(props)
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: isEnvProduction && ShouldI.shouldUseSourceMap()
      }
    })
  }
  return loaders
}

module.exports = {
  getStyleLoaders
}
