import './index.scss'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import React, { Component } from 'react'

export const COUPON_UI_STATUS_CODE = {
  used: 1, // 已使用
  staling: 2, // 即将过期
  valid: 3 // 正常有效
}

/**
 * 通用券Banner组件
 *
 * @export
 * @class CouponBanner
 * @extends {Component}
 */
export default class CouponBanner extends Component {
  static propTypes = {
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    coupons: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        expired_at: PropTypes.string,
        status: PropTypes.oneOf(['Valid', 'Expired', 'Used'])
      })
    ),
    usedCoupons: PropTypes.arrayOf(PropTypes.number)
  }

  constructor(props) {
    super(props)
    this.state = {
      coupons: null,
      statusCode: null,
      text: ''
    }
  }
  /**
   * 静态配置
   * 有效天数 | 按钮文字 | tips文字
   * @static
   * @memberof CouponBanner
   */
  static STALING_DAY = 15
  static STATUS_CODE_BTN_TEXT_MAP = {
    [COUPON_UI_STATUS_CODE.used]: '取消使用',
    [COUPON_UI_STATUS_CODE.staling]: '立即使用',
    [COUPON_UI_STATUS_CODE.valid]: '立即使用'
  }
  static getStatusText(statusCode, couponsLength) {
    switch (statusCode) {
      case COUPON_UI_STATUS_CODE.used: {
        return '已使用加衣券，增加1个衣位'
      }
      case COUPON_UI_STATUS_CODE.valid: {
        return `你有${couponsLength}张加衣券可使用`
      }
      case COUPON_UI_STATUS_CODE.staling: {
        return `你有${couponsLength}张加衣券即将过期`
      }
      default: {
      }
    }
  }
  /**
   *
   * 组件更新逻辑
   * @static
   * @param {*} props
   * @param {*} state
   * @returns
   * @memberof CouponBanner
   */
  static getDerivedStateFromProps(props, state) {
    if (props.usedCoupons && props.usedCoupons.length) {
      return {
        statusCode: COUPON_UI_STATUS_CODE.used,
        text: CouponBanner.getStatusText(COUPON_UI_STATUS_CODE.used)
      }
    }
    if (state.coupons !== props.coupons) {
      return {
        coupons: props.coupons,
        ...CouponBanner.getCouponState(props.coupons)
      }
    }
    return null
  }
  /**
   *加衣券状态逻辑
   *
   * @static
   * @memberof ClothingCoupon
   */
  static getCouponState = (coupons = []) => {
    const clothingCoupon = coupons.filter(c => c.type === 'ClothingCoupon')
    const usedClothingCoupons = clothingCoupon.filter(c => c.status === 'Used')
    // 已使用加衣券
    if (usedClothingCoupons.length) {
      return {
        statusCode: COUPON_UI_STATUS_CODE.used,
        text: CouponBanner.getStatusText(COUPON_UI_STATUS_CODE.used)
      }
    }
    // 即将过期加衣券
    const validClothingCoupon = clothingCoupon.filter(c => c.status === 'Valid')
    const stalingClothingCoupons = validClothingCoupon.filter(c => {
      const delta = new Date(c.expired_at).getTime() - new Date().getTime()
      const deltaDays = delta / 1000 / 60 / 60 / 24
      return deltaDays >= 0 && deltaDays <= CouponBanner.STALING_DAY
    })
    if (stalingClothingCoupons.length) {
      return {
        statusCode: COUPON_UI_STATUS_CODE.staling,
        text: CouponBanner.getStatusText(
          COUPON_UI_STATUS_CODE.staling,
          stalingClothingCoupons.length
        )
      }
    } else {
      // 正常有效加衣券
      if (validClothingCoupon.length) {
        return {
          statusCode: COUPON_UI_STATUS_CODE.valid,
          text: CouponBanner.getStatusText(
            COUPON_UI_STATUS_CODE.valid,
            validClothingCoupon.length
          )
        }
      }
    }
    return {
      text: '',
      statusCode: null
    }
  }

  getStatusIcon = () => {
    switch (this.state.statusCode) {
      case COUPON_UI_STATUS_CODE.used: {
        return (
          <img
            alt=""
            src={require('../images/next_black.svg')}
            className={'handler-icon -next-black'}
          />
        )
      }
      case COUPON_UI_STATUS_CODE.valid:
      case COUPON_UI_STATUS_CODE.staling: {
        return (
          <img
            alt=""
            src={require('../images/next.svg')}
            className={'handler-icon -next-black'}
          />
        )
      }
      default: {
        return null
      }
    }
  }

  handleClick = () => {
    switch (this.state.statusCode) {
      case COUPON_UI_STATUS_CODE.used: {
        this.props.onCancel()
        break
      }
      case COUPON_UI_STATUS_CODE.valid:
      case COUPON_UI_STATUS_CODE.staling: {
        this.props.onOk()
        break
      }
      default: {
      }
    }
  }

  render() {
    const { text, statusCode } = this.state
    if (statusCode === null) return null
    return (
      <div className="clothing-promo">
        <span className="promo-info">{text}</span>
        <span className="promo-btn-area" onClick={this.handleClick}>
          <span
            onClick={this.handleClick}
            className={classnames({
              'promo-btn': true,
              [`-status-${statusCode}`]: statusCode !== null
            })}
          >
            {CouponBanner.STATUS_CODE_BTN_TEXT_MAP[statusCode]}
          </span>
          {this.getStatusIcon()}
        </span>
        <img
          alt=""
          src={require('../images/background.png')}
          className={'clothing-promo-background'}
        />
      </div>
    )
  }
}
