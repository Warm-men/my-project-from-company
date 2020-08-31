const isDevelop =
  _.includes(window.location.origin, 'wechat-staging1-letote.cn') ||
  _.includes(window.location.origin, 'wechat-dev.letote.cn') ||
  _.includes(window.location.origin, 'localhost')

export default isDevelop
