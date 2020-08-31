import React, { Component } from 'react'
import { format } from 'date-fns'
import classnames from 'classnames'
import './index.scss'
/**
 * NOTE:
 * [满减券】:    DiscountPromoCode
 *【折扣券】:    PercentPromoCode
 *【会员券】:    MemberPromoCode
 */
const DISCOUNT_PROMO_CODE = 'DiscountPromoCode'
// const PERCENT_PROMO_CODE = 'PercentPromoCode'
const MEMBER_PROMO_CODE = 'MemberPromoCode'

class PromoCodeItem extends Component {
  static productScope = {
    Accessory: '配饰',
    Clothing: '衣服',
    All: '商品'
  }

  handleImmediateUse = () => {
    this.props.handleImmediateUse(this.props.data)
  }

  handleUsePromoCode = () => {
    this.props.handleUsePromoCode(this.props.data)
  }

  render() {
    const {
        status,
        data,
        pre_page,
        promoCode,
        inValid,
        isPaymentPending
      } = this.props,
      classname_money = classnames('money', {
        'not-valid': status !== 'Valid'
      }),
      classname_discount = classnames('discount', {
        'not-valid': status !== 'Valid'
      }),
      classname_express_discount = classnames({
        'not-valid': status !== 'Valid',
        title: true
      }),
      classname_expiration = classnames({
        'not-valid': status !== 'Valid',
        'express-date': true
      }),
      classname_not_valid = classnames({
        expired: status === 'Expired'
      }),
      classname_select = classnames('select-icon', {
        selected: promoCode && promoCode.code === data.code
      })
    const isClothingCoupon = data.type === 'ClothingCoupon'
    const expiredDate = isClothingCoupon
      ? data.expired_at
      : data.expiration_date

    const usedDate = isClothingCoupon ? data.applied_at : data.used_at

    return (
      <div className="promo-code-box">
        {inValid && <div className="isinValid-promo" />}
        <div className="promo-code-item">
          <div className="discount-amount">
            <div className="content">
              <span className={classname_money}>
                {isClothingCoupon ? '+' : '¥'}
              </span>
              <div className={classname_discount}>
                {isClothingCoupon ? 1 : data.discount_amount}
              </div>
              {data.type === DISCOUNT_PROMO_CODE && (
                <div
                  className={classnames('condition-display', {
                    'not-valid': status !== 'Valid'
                  })}
                >
                  {data.condition_display}
                </div>
              )}
            </div>
          </div>
          <div className="mid-express">
            <span className={classname_express_discount}>
              {data.title}
              {isClothingCoupon && data.sub_title && (
                <span className="sub-title">{data.sub_title}</span>
              )}
            </span>
            <div className={classname_expiration}>
              {usedDate
                ? '使用日期：' + format(usedDate, 'YYYY年MM月DD日')
                : '有效期至' + format(expiredDate, 'YYYY年MM月DD日')}
            </div>
          </div>
          {inValid ? null : status === 'Valid' ? (
            pre_page === 'plans' ? (
              <div
                className={classname_select}
                onClick={this.handleUsePromoCode}
              />
            ) : (
              data.type === MEMBER_PROMO_CODE && (
                <button onClick={this.handleImmediateUse}>去使用</button>
              )
            )
          ) : (
            <i className={classname_not_valid} />
          )}
        </div>
        {(!_.isEmpty(data.rules) || (inValid && !isPaymentPending)) && (
          <div className="promo-code-des">
            {inValid && !isPaymentPending && (
              <div className="invalid-content">
                再买<span className="active-text">{data.diff_amount}元</span>
                {PromoCodeItem.productScope[data.product_scope]}
                可用该券
              </div>
            )}
            {!_.isEmpty(data.rules) && (
              <div className="rules-box">
                <div className="des-title">使用须知：</div>
                <div className="des-content">
                  {_.map(data.rules, (v, k) => {
                    return (
                      <p className="text" key={k}>
                        {v}
                      </p>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default PromoCodeItem
