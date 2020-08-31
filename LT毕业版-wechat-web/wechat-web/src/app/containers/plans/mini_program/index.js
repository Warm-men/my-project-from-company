/**
 *
 * @param {*object} payParams payment params
 */
export const navigateToMiniProgram = param => {
  const url = handleUrl(param)
  wx.miniProgram.navigateTo({
    url
  })
}

const handleUrl = options => {
  let url = '/pages/wxPay/wxPay'
  _.map(options, (value, key) => {
    const val = key === 'payParams' ? encodeURIComponent(value) : value
    if (url.indexOf('?') > -1) {
      url += `&${key}=${val}`
    } else {
      url += `?${key}=${val}`
    }
  })
  return url
}

/**
 *
 * @param {*object} address
 */
export const navigateToAddress = url => {
  wx.miniProgram.navigateTo({
    url: `/pages/address/address?redirect_uri=${encodeURIComponent(url)}`
  })
}

/**
 *
 * @param {*object} freePassword
 */
const handleMiniAppUrl = (old_url, options) => {
  let url =
    old_url + `?redirect_uri=${encodeURIComponent(window.location.href)}`
  _.map(options, (value, key) => {
    if (url.indexOf('?') > -1 && value) {
      url += `&${key}=${value}`
    } else {
      url += `?${key}=${value}`
    }
  })
  return url
}
export const navigateToContract = options => {
  const url = handleMiniAppUrl('/pages/contract/contract', options)
  wx.miniProgram.navigateTo({ url })
}
