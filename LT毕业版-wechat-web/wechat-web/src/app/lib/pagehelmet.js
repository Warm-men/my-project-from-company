import { useEffect, useCallback } from 'react'
import { parseQueryString } from 'src/app/lib/parseQueryString.js'
import deviceEnv from 'src/app/lib/device_env.js'

export default function PageHelmet(props) {
  const postMiniApp = useCallback(newProps => {
    const props = newProps
    if (props.isNotPostMsg) {
      return null
    }
    // NOTE:小程序环境postMessage处理ios分享
    if (deviceEnv(window.navigator.userAgent) === 'mini_app') {
      const { shareUrl, shareImg, shareTitle } = props
      // NOTE：因helmet影响，title不是进入界面就是正确的title，需要在页面更换标题后进行postMessage处理
      const data = {
        url: handleUrlopenid(shareUrl) || window.location.origin,
        title: shareTitle || '一件衣服价格，穿遍全球服饰',
        imageUrl: handleImage(shareImg)
      }
      wx.miniProgram.postMessage({ data })
    }
  }, [])

  const handleImage = useCallback(img => {
    return _.isEmpty(img)
      ? 'https://static.letote.cn/share/general.png'
      : `${img}?imageView2/1/w/500/h/400`
  }, [])

  const handleUrlopenid = useCallback(share_url => {
    const params = parseQueryString(share_url)
    if (params && params.wechat_mini_app_openid) {
      delete params['wechat_mini_app_openid']
      let url = share_url.split('?')[0]
      for (let key in params) {
        url += `${url.indexOf('?') > -1 ? '&' : '?'}${key}=${params[key]}`
      }
      return url
    } else {
      return share_url
    }
  }, [])

  useEffect(() => {
    postMiniApp(props)
  }, [props.shareUrl, props.shareImg, props.shareTitle])

  useEffect(() => {
    document.title = props.title || 'LE TOTE 托特衣箱'
    const link = props.link || window.location.pathname
    const linkRel = 'canonical'
    const node = document.getElementsByTagName('link')
    let isHadLink = false
    for (let i = 0; i < node.length; i++) {
      // NOTE:有link直接修改即可
      if (node[i].rel === linkRel) {
        isHadLink = true
        node[i].href = link
        break
      }
    }
    if (!isHadLink) {
      const newLink = document.createElement('link')
      newLink.rel = linkRel
      newLink.href = link
      document.head.appendChild(newLink)
    }
  }, [props.title, props.link])

  return null
}
