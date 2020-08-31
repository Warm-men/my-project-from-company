import { Link } from 'react-router'
import { format } from 'src/app/lib/time_format'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import { isSameDay, addDays } from 'date-fns'
import Actions from 'src/app/actions/actions'
import { HoldDate, HOLDDATE_TODAY } from 'src/app/lib/hold_date.js'

const HoleTip = subscription => {
  let title = '',
    tipText = ''
  if (subscription.status === 'on_hold') {
    const holdDate = subscription.hold_date || subscription.hold_until
    const issameDay = isSameDay(new Date(), holdDate)
    title =
      issameDay || HoldDate(holdDate) === HOLDDATE_TODAY
        ? '会员即将恢复'
        : '会员已经暂停'
    tipText = issameDay
      ? '新的衣箱将在明天上午8:00重新打开'
      : `将在${format(
          addDays(
            (subscription && subscription.hold_date) || subscription.hold_until,
            1
          ),
          'YYYY年MM月DD日'
        )}恢复`
  } else if (subscription.status === 'pending_hold') {
    title = '已申请暂停会员'
    tipText = `你已申请暂停到${format(
      (subscription && subscription.hold_date) || subscription.hold_until,
      'YYYY年MM月DD日'
    )}，系统在确认你已归还所有商品后，将会正式开始暂停，并且相应地延长你的会员有效期`
  }
  return (
    <div className="profile-onhold-tip">
      <div className="hold-tip-container">
        <span className="hold-tip-icon" />
        <p className="onhold-tip-title">{title}</p>
        <p className="onhold-tip-text">{tipText}</p>
      </div>
    </div>
  )
}

export default class NewMembership extends React.PureComponent {
  handleClick = () => browserHistory.push('/hold')

  handleFreePassword = () => browserHistory.push('/free_password')

  handlePlans = () => {
    this.props.dispatch(Actions.promoCode.reset())
    browserHistory.push('/plans?next_page=authorize')
  }

  isShowFreePassword = () => {
    // NOTE：已签约就显示，未开通由后台控制，非微信不显示
    const { isWechat } = this.props
    if (!isWechat) {
      return false
    }
    const {
        customer: { subscription, enable_payment_contract }
      } = this.props,
      { contract_display } = subscription
    if (enable_payment_contract.length > 0) {
      return true
    } else {
      return contract_display.menu_display
    }
  }

  render() {
    const { subscription } = this.props.customer
    if (_.isEmpty(subscription)) {
      return null
    }
    const {
      customer: {
        avatar_url,
        nickname,
        subscription: {
          on_hold,
          billing_date,
          display_name,
          display_interval,
          remain_additional_days
        }
      }
    } = this.props

    const billingDate = format(billing_date, 'YYYY年MM月DD日')
    const subName = `${display_name} ${display_interval}`
    return (
      <div className="membership-container">
        <PageHelmet title="会员中心" link="/membership" />
        <div className="profile-card-container">
          <div className="profile-card">
            <div className="profile-user-avator">
              <div className="user-avator-box">
                <img className="avator" src={avatar_url} alt="" />
              </div>
              <span className="user-nickname">{nickname}</span>
              <div className="user-vip-title">
                <span className="user-vip-title-text">{subName}</span>
              </div>
            </div>
            <div className="profile-info-bottom">
              <span className="info-date">
                {subscription.billing_date_extending
                  ? `会员期从首个衣箱寄出或${remain_additional_days}天后开始计算`
                  : `会员有效期至${billingDate}`}
              </span>
              <Link onClick={this.handlePlans} className="profile-btn">
                立即续费
              </Link>
            </div>
          </div>
        </div>
        {on_hold && HoleTip(subscription)}
        {!on_hold && (
          <div className="profile-operate-list" onClick={this.handleClick}>
            <span>暂停会员服务</span>
            <span className="icon-img" />
          </div>
        )}
        {this.isShowFreePassword() && (
          <div
            className="profile-operate-list"
            onClick={this.handleFreePassword}
          >
            <span>{'免密管理'}</span>
            <span className="icon-img" />
          </div>
        )}
      </div>
    )
  }
}
