function canOpenURL(url, callback) {
  if (url === 'wechat') {
    const WeChat = require('react-native-letote-wechat')
    WeChat.isWXAppInstalled().then(isInstalled => {
      callback(isInstalled)
    })
  } else {
    throw new Error(`Not supported canOpenURL type ${url}`)
  }
}

export { canOpenURL }
