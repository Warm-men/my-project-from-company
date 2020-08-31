import ReferralTipsHOC from 'src/app/components/referrral_tips/referral_tips_hoc.jsx'
import { useEffect, useState, useRef } from 'react'
import './index.scss'

export default ReferralTipsHOC(ProductDetailReferral)
function ProductDetailReferral(props) {
  const { avatar, nickname, customer, handleClick } = props
  const [isShow, setShow] = useState(true)
  const [isFrist, setIsFrist] = useState(true)
  const showRef = useRef()
  const scrollRef = useRef()

  scrollRef.current = 0
  showRef.current = isShow

  const debounceScroll = _.debounce(() => {
    const absValue = Math.abs(window.scrollY - scrollRef.current)
    if (absValue < 20) {
      !showRef.current && setShow(true)
    } else {
      debounceScroll()
    }
    scrollRef.current = window.scrollY
  }, 100)

  const handleScroll = () => {
    if (showRef.current) {
      setShow(false)
      isFrist && setIsFrist(false)
    }
    !showRef.current && debounceScroll()
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      onClick={handleClick}
      className={`customer-photo-referral-tips ${
        !isShow ? 'hide' : isFrist ? '' : 'fadein'
      }`}
    >
      <div className="tips-box">
        <img className="avatar" src={avatar} alt="" />
        <span className="text">{nickname || '小姐姐'}</span>
        送你
        <span className="price">
          {customer.active_referral_program &&
            customer.active_referral_program.sender_amount}
          元
        </span>
      </div>
      <img
        className="btn-img"
        alt=""
        src={require('src/app/containers/customer_photos/referral_tips/images/btn.png')}
      />
    </div>
  )
}
