const fs = require('fs')

module.exports = {
  // Some apps do not use client-side routing with pushState.
  // For these, "homepage" can be set to "." to enable relative asset paths.
  shouldUseRelativeAssetPaths: publicPath => publicPath === './',
  shouldUseSourceMap: () => process.env.GENERATE_SOURCEMAP !== 'false',
  // Some apps do not need the benefits of saving a web request, so not inlining the chunk
  // makes for a smoother build process.
  shouldInlineRuntimeChunk: () => process.env.INLINE_RUNTIME_CHUNK !== 'false',

  shouldUseTypescirpt: (paths) => fs.existsSync(paths.appTsConfig)
}
