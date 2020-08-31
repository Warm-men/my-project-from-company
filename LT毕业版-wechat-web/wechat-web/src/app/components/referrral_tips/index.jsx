import { useState, useEffect } from 'react'
import './index.scss'

export default function ReferrralTips(props) {
  const [isShow, setIsShow] = useState(false)

  const { query } = props.location
  const url = query.referral_url || query.referrral_url
  const code = query.referral_code || query.referrral_code

  let timer = null

  useEffect(() => {
    const setTime = () => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        setIsShow(true)
      }, 5000)
    }

    // NOTE:防止用户location跳走返回
    if (
      props.customer.id &&
      !props.authentication.isSubscriber &&
      !_.isEmpty(url)
    ) {
      setTime()
    }
  }, [props.customer.id, props.authentication.isSubscriber])

  const handleClick = () => {
    window.adhoc('track', 'click_referral_img', 1)
    window.location.href = handleJudge(url, code)
  }

  const handleJudge = (referralUrl, referralCode) => {
    if (_.includes(referralUrl, 'referral_code')) {
      return referralUrl
    } else if (_.includes(referralUrl, 'referrral_code')) {
      return referralUrl
    }
    return _.includes(referralUrl, '?')
      ? `${referralUrl}&referral_code=${referralCode}`
      : `${referralUrl}?referral_code=${referralCode}`
  }

  const cancelTips = () => {
    window.adhoc('track', 'close_referral_img', 1)
    setIsShow(false)
  }

  return (
    <div className={isShow ? 'referral-tips' : 'hidden'}>
      <div className="referral-tips-box">
        <span onClick={cancelTips} className="referral-tips-close" />
        <img onClick={handleClick} src={require('./img/other_bg.png')} alt="" />
      </div>
    </div>
  )
}
