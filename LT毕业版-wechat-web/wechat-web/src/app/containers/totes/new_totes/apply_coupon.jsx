import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { differenceInSeconds, format } from 'date-fns'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions'
import CounponToteCart from 'src/app/actions/tote_cart_coupon_actions.js'
import ActionButton from 'src/app/components/shared/action_button/index'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import 'src/app/containers/account/promo_code/index.scss'
import 'src/app/containers/account/promo_code/promo_code_item/index.scss'

const getSuitableCoupon = valid_coupons => {
  let id = null
  let time = null
  _.map(valid_coupons, v => {
    if ((time && differenceInSeconds(time, v.expired_at) > 0) || !time) {
      id = v.customer_coupon_id
      time = v.expired_at
    }
  })
  return id
}

const getState = state => {
  return { customer: state.customer }
}
export default connect(getState)(ToteClothesCoupon)
function ToteClothesCoupon(props) {
  const { dispatch } = props
  const { query } = props.location
  const { valid_coupons } = props.customer

  const [isSubmiting, setIsSubmiting] = useState(false)
  const [couponId, setCouponId] = useState(getSuitableCoupon(valid_coupons))

  useEffect(() => {
    dispatch(Actions.currentCustomer.fetchMe())
  }, [])

  const handleUsePromoCode = couponId => () => {
    setCouponId(id => (couponId !== id ? couponId : null))
  }

  const onSubmit = () => {
    setIsSubmiting(true)
    query.isToteCart ? applyCouponToToteCart() : applyCouponToTote()
  }

  const applyCouponToTote = () => {
    dispatch(
      Actions.totes.applyCouponToTote(
        {
          customer_coupon_id: couponId,
          tote_id: query.toteId
        },
        applyCouponSuccess
      )
    )
  }

  const applyCouponToToteCart = () => {
    dispatch(
      CounponToteCart.applyCouponToToteCart(
        { customer_coupon_id: couponId },
        browserHistory.goBack
      )
    )
  }

  const applyCouponSuccess = (dispatch, data) => {
    const { success, error } = data.data.ApplyCouponToTote
    if (!success) {
      dispatch(Actions.tips.changeTips({ isShow: true, content: error }))
    }
    dispatch(
      Actions.totes.fetchLatestRentalAndPurchaseTote(browserHistory.goBack)
    )
  }

  return (
    <div className="promo-code tote">
      <PageHelmet title="使用加衣券" link="/promo_code" />
      {!_.isEmpty(valid_coupons) &&
        _.map(valid_coupons, (item, index) => {
          if (item.status !== 'Valid') return null
          const isSelect = couponId === item.customer_coupon_id
          return (
            <div key={index} className="promo-code-box">
              <div className="promo-code-item">
                <div className="discount-amount">
                  <span className="money">+</span>
                  <div>1</div>
                </div>
                <div className="mid-express">
                  <span className="title">
                    {item.title}
                    <span className="sub-title">{item.sub_title}</span>
                  </span>
                  <div className="express-date">
                    {`有效期至${format(item.expired_at, 'YYYY年MM月DD日')}`}
                  </div>
                </div>
                <div
                  className={`select-icon ${isSelect ? 'selected' : ''}`}
                  onClick={handleUsePromoCode(item.customer_coupon_id)}
                />
              </div>
              {!_.isEmpty(item.rules) && (
                <div className="promo-code-des">
                  <div className="des-title">使用须知:</div>
                  <div className="des-content">
                    {_.map(item.rules, (v, k) => (
                      <p className="text" key={k}>
                        {v}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      <StickyButtonContainer>
        <ActionButton
          disabled={!couponId || isSubmiting}
          onClick={onSubmit}
          size="stretch"
        >
          确定使用
        </ActionButton>
      </StickyButtonContainer>
    </div>
  )
}
