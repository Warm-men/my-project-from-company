import { parseHashString } from 'src/app/lib/parseHashString.js'
import { browserHistory } from 'react-router'

export const wechatContractUrl = data => {
  if (_.isEmpty(data)) {
    return ''
  }
  let {
    appid,
    contract_code,
    contract_display_account,
    mch_id,
    notify_url,
    plan_id,
    request_serial,
    timestamp,
    version,
    sign,
    return_web
  } = data
  // NOTE：Api需要进行encodeUrl
  notify_url = encodeURIComponent(notify_url)
  return `https://api.mch.weixin.qq.com/papay/entrustweb?appid=${appid}&contract_code=${contract_code}&contract_display_account=${contract_display_account}&mch_id=${mch_id}&notify_url=${notify_url}&plan_id=${plan_id}&request_serial=${request_serial}&timestamp=${timestamp}&version=${version}&sign=${sign}&return_web=${return_web}`
}

export const isMiniAppGoback = (old_url, new_url) => {
  const oldData = parseHashString(old_url)
  const newData = parseHashString(new_url)
  // NOTE:旧路由的router大于新路由，以及旧路由有router而新路由没有，则用户再goback
  if (oldData.router > newData.router || (!newData.router && oldData.router)) {
    return true
  } else {
    return false
  }
}

export const miniAppChangeHash = (old_url, new_url, callback) => {
  if (!_.isEmpty(old_url) && !_.isEmpty(new_url)) {
    if (isMiniAppGoback(old_url, new_url)) {
      browserHistory.go(`-${parseHashString(old_url).router}`)
    } else {
      callback && callback()
    }
  }
}
