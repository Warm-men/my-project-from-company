import React, { Component } from 'react'
import { connect } from 'react-redux'
import { format, addDays, isSameDay } from 'date-fns'
import { Link, browserHistory } from 'react-router'
import classnames from 'classnames'
import authentication from 'src/app/lib/authentication'
import Actions from 'src/app/actions/actions'
import SelectBox from './select_box'
import Config from './utils/account_select_config'
import PageHelmet from 'src/app/lib/pagehelmet'
import PopupsHOC from 'src/app/components/HOC/Popups'
import Hint from 'src/app/components/hint'
import WithWechatShare from 'src/app/components/HOC/with_wechat_share'
import initScrollTop from 'src/app/lib/init_scroll_to_top.js'
import { HoldDate } from 'src/app/lib/hold_date.js'
import * as CARD_TYPE from 'src/app/lib/card_type.js'
import 'src/assets/stylesheets/components/desktop/account/account.scss'
import * as storage from 'src/app/lib/storage.js'
import VipIcon from 'src/app/containers/customer_photos/images/vip_icon.png'

function mapStateToProps(state) {
  const { customer, orders, app, promoCode } = state
  const { isFreeUser, isFreeTote79 } = customer
  return {
    customer,
    orders,
    authentication: authentication(customer),
    isSpecialVip: isFreeUser || isFreeTote79,
    app,
    promoCode,
    isMiniApp: app.platform === 'mini_app'
  }
}

@connect(mapStateToProps)
@WithWechatShare
@PopupsHOC
export default class AccountContainer extends Component {
  state = {
    isUnbind: false,
    hasFetchAllPromoCode: false,
    abTestReferral: 1,
    copywritingAdjustments: null
  }

  componentDidMount() {
    const { customer, authentication, dispatch } = this.props
    dispatch(Actions.allproducts.resetFilters())
    if (!_.isEmpty(customer) && !_.isEmpty(customer.id)) {
      dispatch(Actions.orders.fetchOrders(() => {}, this.fetchOrdersError))
    }
    initScrollTop(100)

    dispatch(
      Actions.promoCode.getFlattenPromoCode({
        type: 'All',
        success: () => this.setState({ hasFetchAllPromoCode: true })
      })
    )
    dispatch(Actions.promoCode.reset())
    if (!authentication.isSubscriber) {
      window.adhoc('getFlags', flag => {
        this.setState({
          abTestReferral: flag.get('D181219_WECHAT_REFERRAL_BANNER')
        })
      })
    }
    storage.set('isMultipleQuiz', false)
    this.fetchCopywritingAdjustments()
  }

  fetchCopywritingAdjustments = () => {
    const { dispatch } = this.props
    dispatch(
      Actions.copywritingAdjustments.fetchCopywritingAdjustments(
        {},
        (_, res) => {
          const { first_customer_photo_hint } = res.data.copywriting_adjustments
          if (!!first_customer_photo_hint) {
            this.setState({ copywritingAdjustments: first_customer_photo_hint })
          }
        }
      )
    )
  }

  fetchOrdersError = () => {
    this.props.dispatch(
      Actions.tips.changeTips({ isShow: false, content: '', timer: 0 })
    )
  }

  handleUser = e => {
    e.stopPropagation()
    const {
      authentication,
      customer: { jd_credit_score },
      app: { platform },
      dispatch
    } = this.props
    dispatch(Actions.promoCode.reset())

    if (!authentication.isSubscriber) {
      if (
        platform === 'jd' &&
        jd_credit_score &&
        Number(jd_credit_score.score) < 70
      ) {
        dispatch(
          Actions.app.showGlobalAlert({
            content: '你的小白信用低于70分，暂时还不能享受免押金权益',
            handleClick: () => dispatch(Actions.app.resetGlobalAlert()),
            btnText: '好的'
          })
        )
        return null
      }
      browserHistory.push('/plans')
    } else {
      //NOTE: 续费用户不走活动页
      browserHistory.push('/plans')
    }
  }

  // FIXME：测试清理Cookie，退出登录,后面需要清理
  testClearCookie = () => {
    if (!this.signoutClicks) this.signoutClicks = 0
    this.signoutClicks++
    if (this.signoutClicks < 15) return
    sessionStorage.clear()
    localStorage.clear()
    this.props.dispatch(
      Actions.customer.gqsignout({
        clientMutationId: this.props.customer.id
      })
    )
  }

  showVipState = () => {
    const { subscription } = this.props.customer
    if (subscription && subscription.on_hold) {
      return subscription.status === 'pending_hold'
        ? '已申请暂停'
        : '会员暂停中'
    } else {
      return null
    }
  }

  handleGoToBindTel = e => {
    e.preventDefault()
    browserHistory.push('/update_tel?pre_wechat_menu=true')
  }

  handleGoToReferral = () => {
    //FIXME: find problem to fix weixin share
    if (this.props.isMiniApp) {
      // NOTE：小程序获取环境变量是异步，location方式不便处理
      browserHistory.push('/referral')
    } else {
      window.location.href = `https://${window.location.host}/referral`
    }
  }

  gotoUpdateUser = e => {
    e.stopPropagation()
    browserHistory.push('/update_userinfo')
  }

  showMembership = () => {
    const { isSubscriber, isVacation } = this.props.authentication
    const { isSpecialVip } = this.props
    return !isSpecialVip && isSubscriber && !isVacation
  }

  gotoPromocode = () => {
    browserHistory.push('/promo_code/Valid')
  }

  gotoCreditAccount = () => {
    browserHistory.push('/credit_account')
  }

  isPendingHold = () => {
    const { customer } = this.props
    return (
      customer.subscription &&
      customer.subscription.on_hold &&
      customer.subscription.status === 'pending_hold'
    )
  }

  showVipState = () => {
    const { subscription } = this.props.customer
    if (subscription && subscription.on_hold) {
      return subscription.status === 'pending_hold'
        ? '已申请暂停'
        : '会员暂停中'
    } else {
      return null
    }
  }

  showFreePassowrd = () => {
    // NOTE:非微信环境不需要免密
    const { isWechat } = this.props.app
    if (!isWechat) {
      return false
    }
    const {
      authentication: { isVacation, isValidSubscriber },
      customer: {
        subscription,
        isFreeUser,
        isFreeTote79,
        enable_payment_contract
      }
    } = this.props
    const isNotSpecialUser = !isFreeUser && !isFreeTote79
    if (!isVacation && isValidSubscriber && isNotSpecialUser) {
      const { contract_display } = subscription
      if (
        subscription.subscription_type.interval !== CARD_TYPE.ANNUAL_CARD_TYPE
      ) {
        return (
          enable_payment_contract.length > 0 || contract_display.menu_display
        )
      } else {
        return false
      }
    }
    return false
  }
  showFreeService = () => {
    const {
      customer: { free_service },
      app: { platform }
    } = this.props
    let showFreeService
    if (free_service) {
      const { state } = free_service
      if (
        state === 'active' ||
        state === 'apply_refund' ||
        state === 'approved'
      ) {
        showFreeService = true
      }
    }
    return (
      free_service &&
      free_service.account_entrance &&
      (showFreeService || platform !== 'jd')
    )
  }

  handleCancelUnbind = () =>
    this.setState({
      isUnbind: false
    })

  handleConfirmUnbind = () => {
    this.setState({
      isUnbind: false
    })
    this.props.dispatch(Actions.customer.unbindJDCredit(this.handleUnbindJdSuc))
  }

  handleUnbindJdSuc = (dispatch, data) => {
    const { success, errors } = data.data.UnbindJdCredit
    if (success === 'true') {
      dispatch(Actions.currentCustomer.fetchMe(this.fetchMeSuccess))
    } else {
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: errors[0],
          timer: 2
        })
      )
    }
  }

  fetchMeSuccess = () => browserHistory.replace('/unbind_jd_credit')

  showUnbindHint = () =>
    this.setState({
      isUnbind: true
    })

  render() {
    if (!this.state.hasFetchAllPromoCode) return null

    const {
      customer,
      authentication,
      orders,
      app: { isWechat, platform },
      promoCode: { valid_promo_codes },
      isMiniApp
    } = this.props
    const {
      subscription,
      valid_coupons,
      enable_payment_contract,
      referral_banner,
      credit_account,
      roles
    } = customer
    const btnclassname = classnames({
      'vip-RenewBtn':
        authentication.isSubscriber && authentication.isValidSubscriber,
      'notvip-RenewBtn': !(
        authentication.isSubscriber && authentication.isValidSubscriber
      )
    })
    let couponLength = 0
    if (valid_promo_codes || valid_coupons) {
      const promoCodesNum = valid_promo_codes ? valid_promo_codes.length : 0
      const couponsNum = valid_coupons ? valid_coupons.length : 0
      couponLength = promoCodesNum + couponsNum
    }
    const isSameday =
      !!subscription &&
      isSameDay(new Date(), subscription.hold_date || subscription.hold_until)
    const isExtending = subscription && subscription.billing_date_extending
    const isShowMyService = isWechat || platform === 'jd'
    const isStylelist = _.find(roles, { type: 'stylist' })

    return (
      <div className="AccountContainerBox fixHeight">
        <PageHelmet title="我的" link="/account" />
        {this.state.isUnbind && (
          <Hint
            title="解绑京东授权"
            textAlign="center"
            content="是否确定解绑京东小白信用？"
            leftBtnText="取消"
            rightBtnText="确认"
            leftButton={this.handleCancelUnbind}
            rightButton={this.handleConfirmUnbind}
          />
        )}
        {subscription && subscription.on_hold && (
          <div className="pending-hold-box">
            <div className="pending-hold-warn">
              {this.isPendingHold()
                ? '已申请暂停会员，归还所有商品后将会延长你的会员期'
                : isSameday || HoldDate(subscription.hold_date) === '今天'
                ? `会员即将恢复， 新的衣箱将在${HoldDate(
                    subscription.hold_date
                  )}上午8:00重新打开`
                : `会员服务暂停中，将在${format(
                    addDays(subscription.hold_date, 1),
                    'YYYY年MM月DD日'
                  )}恢复`}
            </div>
          </div>
        )}
        <div
          className={`AccountContainer ${
            authentication.isSubscriber ? '' : 'border-none'
          }`}
        >
          <Link className="AccountBox" onClick={this.gotoUpdateUser}>
            <div className="AvatorBox">
              <img
                src={
                  customer.avatar_url ||
                  require('src/assets/images/account/mine_headportrait.svg')
                }
                className="avator"
                alt="avator"
              />
              {isStylelist && <img src={VipIcon} alt="" className="vip-icon" />}
            </div>
            <div className="UserInfoBox">
              <span className={isStylelist ? 'UserName gold' : 'UserName'}>
                {customer.nickname || customer.first_name || '未登入'}
              </span>
              {authentication.isSubscriber ? (
                <div className="new-user-info">
                  <div className="sub-type">
                    {subscription.display_name} {subscription.display_interval}
                  </div>
                  {subscription.totes_left !== null && (
                    <div className="totes-left">
                      当前剩余{subscription.totes_left}个衣箱
                    </div>
                  )}
                </div>
              ) : (
                <span className="UserTime">你还不是会员</span>
              )}
            </div>
            {authentication.isSubscriber ? (
              <div className="BtnBox">
                <img
                  alt=""
                  src={require('src/assets/images/account/next.png')}
                />
              </div>
            ) : (
              <span className="join-btn" onClick={this.handleUser}>
                加入会员
              </span>
            )}
          </Link>
        </div>
        {authentication.isSubscriber && (
          <>
            <div className="border-box">
              <div className="account-border" />
            </div>
            <JoinLetote
              handleUser={this.handleUser}
              btnclassname={btnclassname}
              customer={customer}
              isExtending={isExtending}
              tipText={getStatusMessage(customer)}
            />
          </>
        )}
        <div className="referral-entry-box">
          <div className="referral-des">
            <div className="des" onClick={this.gotoCreditAccount}>
              {credit_account && credit_account.balance < 0 && (
                <div className="overdraft-container">
                  <span className="overdraft-text">有欠款</span>
                </div>
              )}
              <span className="number">
                {credit_account ? credit_account.balance : 0}
              </span>
              <span className="text">信用账户(元)</span>
            </div>
            <div className="des" onClick={this.gotoPromocode}>
              <span className="number">{couponLength}</span>
              <span className="text">优惠券(张)</span>
            </div>
          </div>
          {isWechat && referral_banner && this.state.abTestReferral === 1 && (
            <img
              src={referral_banner.referred_program_entry_banner_url}
              alt="...referral"
              className="referral-entry"
              onClick={this.handleGoToReferral}
            />
          )}
        </div>
        <SelectBox
          isMiniApp={isMiniApp}
          title="风格档案"
          standby="YOUR STYLE"
          selectList={Config.profile}
        />
        <SelectBox
          title="常用功能"
          standby="COMMON"
          isMiniApp={isMiniApp}
          selectList={Config.common}
          dispatch={this.props.dispatch}
          showMembership={this.showMembership()}
          showIcon={orders.orders.length > 0 ? '待付款' : ''}
        />
        {isShowMyService && (
          <SelectBox
            title="我的服务"
            isMiniApp={isMiniApp}
            isJd={platform === 'jd'}
            standby="MY SERVICE"
            showFreePassowrd={this.showFreePassowrd()}
            showFreeService={this.showFreeService()}
            selectList={Config.service}
            dispatch={this.props.dispatch}
            hasContract={!_.isEmpty(enable_payment_contract)}
          />
        )}
        <div className="service-phone">
          {isWechat && (
            <p className="text-list" onClick={this.testClearCookie}>
              {this.props.isMiniApp
                ? '如有任何问题请联系我们，托特衣箱竭诚为你服务'
                : '微信公众号内回复任意消息与客服进行沟通'}
            </p>
          )}
          <p className="text-list" onClick={this.testClearCookie}>
            客服电话：
            <a href="tel:4008070088" className="phone">
              400-807-0088
            </a>
          </p>
        </div>
      </div>
    )
  }
}

export const getStatusMessage = customer => {
  if (_.isEmpty(customer) || _.isEmpty(customer.subscription)) {
    return ''
  }
  const {
    subscription: {
      billing_date_extending,
      remain_additional_days,
      status,
      billing_date,
      promo_code,
      subscription_type,
      display_name
    }
  } = customer
  let text = ''
  if (billing_date_extending) {
    return status !== 'on_hold'
      ? `会员期从首个衣箱寄出或${remain_additional_days}天后开始计算`
      : ''
  }
  if (status !== 'cancelled') {
    text = `会员有效期至${format(billing_date, 'YYYY年MM月DD日')}`
  } else {
    if (promo_code === 'LTCN_FREE_TOTE' || promo_code === 'LTCN_FREE_TOTE_79') {
      text = '7天体验会员已结束'
    } else if (subscription_type && subscription_type.occasion) {
      text = display_name + '已结束'
    } else {
      text = '会员已过期'
    }
  }
  return text
}

const JoinLetote = ({ btnclassname, handleUser, isExtending, tipText }) => {
  if (_.isEmpty(tipText) && isExtending) {
    return null
  }
  return (
    <div className={'user-subscriber'}>
      <div className="user-subscriber-left">{tipText}</div>
      {!isExtending && (
        <div className="user-subscriber-right">
          <span className={btnclassname} onClick={handleUser}>
            立即续费
          </span>
        </div>
      )}
    </div>
  )
}
