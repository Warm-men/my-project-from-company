let _global = undefined
if (typeof global !== 'undefined') _global = global
if (typeof window !== 'undefined') _global = window

export default class GlobalManager {
  /**
   * polyfill
   *
   * @static
   * @memberof AppGlobalManager
   */
  static polyfill() {
    if (!Date.now) {
      Date.now = function now() {
        return new Date().getTime()
      }
    }

    if (typeof window !== 'undefined') {
      if (!window.requestAnimationFrame) {
        _global.requestAnimationFrame = function(fn) {
          setTimeout(fn, 17)
        }
      }
    }
  }
  /**
   * 项目打包配置
   *
   * @static
   * @memberof AppGlobalManager
   */
  static BundleSetting() {
    // ##在 webpack config 中已经设置
    // __webpack_public_path__ =
    //   process.env.NODE_ENV === 'production'
    //     ? process.env.PUBLIC_URL || 'https://static.letote.cn/'
    //     : '/'
  }

  /**
   * App构建时运行
   *
   * @static
   * @memberof AppGlobalManager
   */
  static onAppConstructor() {
    const host = window.location.host
    _global.currentEnv = 'dev'
    if (host.indexOf('wechat-staging') !== -1) {
      _global.currentEnv = 'staging'
    } else if (host.indexOf('wechat') !== -1) {
      _global.currentEnv = 'prod'
    }
  }
  /**
   * APP加载完成后的全局操作
   *
   * @static
   * @memberof AppGlobalManager
   */
  static onAppDidMount() {
    _global.LeToteExperiments = {
      newOnboardingBundle: false,
      enableZhiMaCredit: false
    }
  }
}
