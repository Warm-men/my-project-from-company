import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import classnames from 'classnames'
import PromoCodeItem from './promo_code_item'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions'
import Authentication from 'src/app/lib/authentication'
import * as storage from 'src/app/lib/storage.js'
import * as CARD_TYPE from 'src/app/lib/card_type.js'
import './index.scss'

const getState = state => {
  const { customer, promoCode } = state
  const authentication = Authentication(customer)

  //NOTE: if you has not a annual card membership, then select annual_subscription_type annual card. if you has annual card membership, annual_subscription_type === null
  return {
    promoCode,
    customer,
    authentication
  }
}
@connect(getState)
class PromoCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      promoCode: props.promoCode,
      subscriptionData: props.subscriptionData,
      hasFetchPromoCode: false
    }
    this.isAnnualCard = storage.get('ANNUAL_CARD_VALID')
  }

  componentWillMount() {
    const {
      params: { status },
      dispatch,
      location: {
        query: { pre_page }
      }
    } = this.props
    // NOTE: plans进来不需要拿所有的
    if (pre_page !== 'plans')
      dispatch(
        Actions.promoCode.getFlattenPromoCode({
          type: 'All',
          success: () =>
            this.setState({
              hasFetchPromoCode: true
            })
        })
      )

    this.setState({
      data: this.getCouponAndPromoCode(status)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.status !== this.props.params.status) {
      this.setState({
        data: this.getCouponAndPromoCode(nextProps.params.status)
      })
    }
    if (
      _.isEqual(
        nextProps.customer.valid_promo_codes,
        this.props.customer.valid_promo_codes
      )
    ) {
      this.setState({
        data: this.getCouponAndPromoCode(nextProps.params.status)
      })
    }
  }

  getCouponAndPromoCode = status => {
    const {
      location: {
        query: { pre_page }
      }
    } = this.props
    const {
      expired_promo_codes,
      used_promo_codes,
      valid_promo_codes
    } = this.props.customer
    const normalPromo =
      status === 'Used'
        ? used_promo_codes
        : status === 'Expired'
        ? expired_promo_codes
        : valid_promo_codes
    let newCoupon = []
    if (!pre_page) {
      const {
        used_coupons,
        valid_coupons,
        expired_coupons
      } = this.props.customer
      const coupons =
        status === 'Used'
          ? used_coupons
          : status === 'Expired'
          ? expired_coupons
          : valid_coupons
      newCoupon = _.filter(coupons, v => v.status === status)
    }
    return [...normalPromo, ...newCoupon]
  }

  handleImmediateUse = promoCode => {
    this.props.dispatch(
      Actions.plans.changeSubIds(promoCode.subscription_type_ids)
    )
    this.props.dispatch(Actions.promoCode.set(promoCode))

    this.onSubmit()
  }

  handleUsePromoCode = promoCode => {
    this.setState(state => ({
      promoCode:
        state.promoCode.code === promoCode.code ? { code: null } : promoCode
    }))
  }

  onSubmit = () => {
    this.hanldeApplyRentalSuc()
  }

  hanldeApplyRentalSuc = () => {
    //NOTE: from plans page will handle
    browserHistory.push('/plans')
  }

  getPromoceType = promo_code => {
    const {
      annual_subscription_type: annual_type,
      quarterly_subscription_type: quart_type,
      monthly_subscription_type: month_type,
      interval
    } = this.props.subscriptionType
    const promoCode = promo_code || this.state.promoCode
    const { subscription_type_ids: sub_type_ids } = promoCode
    if (interval === CARD_TYPE.ANNUAL_CARD_TYPE) {
      // NOTE：年卡没有选择
      return 'annual_card'
    }
    const includeAnnual =
      annual_type && _.includes(sub_type_ids, parseInt(annual_type.id, 10))
    const includeQuarter =
      quart_type && _.includes(sub_type_ids, parseInt(quart_type.id, 10))
    if (interval === CARD_TYPE.SEASON_CARD) {
      // NOTE：季卡在优惠券只适用年卡时去年卡
      return includeQuarter
        ? 'quarterly_card'
        : includeAnnual
        ? 'annual_card'
        : 'quarterly_card'
    } else {
      // NOTE：月卡在优惠券只适用年卡时去年卡，只适用季卡用季卡
      return _.includes(sub_type_ids, parseInt(month_type.id, 10))
        ? 'monthly_card'
        : includeQuarter
        ? 'quarterly_card'
        : includeAnnual
        ? 'annual_card'
        : 'monthly_card'
    }
  }

  render() {
    const {
        params: { status },
        location: {
          query: { pre_page }
        }
      } = this.props,
      classname = classnames({
        'pre-page-is-plans': pre_page === 'plans'
      })
    const { data, hasFetchPromoCode } = this.state
    if (pre_page !== 'plans' && !hasFetchPromoCode) return null
    return (
      <div className="promo-code">
        <PageHelmet title="优惠券" link="/promo_code" />
        {pre_page !== 'plans' && (
          <NavBar pre_page={pre_page} classname={classname} status={status} />
        )}
        {data.length !== 0 ? (
          data.map((item, index) => (
            <PromoCodeItem
              status={status}
              key={index}
              data={item}
              promoCode={this.state.promoCode}
              pre_page={pre_page}
              handleImmediateUse={this.handleImmediateUse}
              handleUsePromoCode={this.handleUsePromoCode}
            />
          ))
        ) : (
          <div
            className={`not-promo-code ${
              pre_page !== 'plans' ? 'mid' : 'unshow'
            }`}
          >
            <i className="warn-bg" />
            <p className="warn-text">暂无优惠券</p>
          </div>
        )}
      </div>
    )
  }
}

class NavBar extends Component {
  handleNavLink = type => () => {
    const pre_page = this.props.pre_page,
      url = pre_page
        ? `/promo_code/${type}?pre_page=${pre_page}`
        : `/promo_code/${type}`
    browserHistory.replace(url)
  }
  render() {
    const { pre_page, classname, status } = this.props
    return (
      <div className="nav-bar">
        <nav
          onClick={this.handleNavLink('Valid')}
          className={`${classname} ${status === 'Valid' && 'active'}`}
        >
          未使用
        </nav>
        {pre_page !== 'plans' && (
          <nav
            className={`${classname} ${status === 'Used' && 'active'}`}
            onClick={this.handleNavLink('Used')}
          >
            已使用
          </nav>
        )}
        <nav
          onClick={this.handleNavLink('Expired')}
          className={`${classname} ${status === 'Expired' && 'active'}`}
        >
          已失效
        </nav>
      </div>
    )
  }
}

export default PromoCode
