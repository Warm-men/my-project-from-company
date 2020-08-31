import queryReferral from 'src/app/actions/independent/referral_code_action.js'
import { useState, useEffect } from 'react'
import authentication from 'src/app/lib/authentication'

export default function(WrappedComponent) {
  return function(props) {
    if (authentication(props.customer).isSubscriber) return null

    const { query } = props.location
    const { dispatch } = props
    const url = query.referral_url || query.referrral_url
    const code = query.referral_code || query.referrral_code

    const [isShow, setIshow] = useState(false)
    const [avatar, setAvatar] = useState(null)
    const [nickname, setNickname] = useState(null)

    useEffect(() => {
      code && dispatch(queryReferral(code, queryReferralSuccess))
    }, [])

    const queryReferralSuccess = (dispatch, res) => {
      const { referrer_avatar, referrer_nickname } = res.data.referrer
      setAvatar(referrer_avatar)
      setNickname(referrer_nickname)
      setIshow(true)
    }

    const handleClick = e => {
      e.stopPropagation()
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

    if (!isShow) return null

    return (
      <WrappedComponent
        {...props}
        avatar={
          avatar || require('src/assets/images/account/mine_headportrait.svg')
        }
        nickname={nickname}
        handleClick={handleClick}
      />
    )
  }
}
