const addPlatformSelector = Store => {
  const isMobile = Store.getState().app.platform !== 'wechat_pc'
  const className = isMobile ? 'mobile' : 'desktop'
  const body = document.getElementsByTagName('body')[0]
  body.classList.add(className)
}

const addOldWebkitSelector = () => {
  // WEBKIT CHANGED THEIR RENDERING VIEWPORT IN VERSION 603 SO WE HAVE TO PUT OUT
  // A FIRE BY CHECKING FOR OLD VERSIONS AND CHANGING EVERYTHING
  if (!navigator.userAgent) return
  const isWebkit601 = navigator.userAgent.indexOf('AppleWebKit/601') > -1
  const isWebkit602 = navigator.userAgent.indexOf('AppleWebKit/602') > -1
  if (!(isWebkit601 || isWebkit602)) return

  const body = document.getElementsByTagName('body')[0]
  body.classList.add('old-webkit')
}

export { addPlatformSelector, addOldWebkitSelector }
