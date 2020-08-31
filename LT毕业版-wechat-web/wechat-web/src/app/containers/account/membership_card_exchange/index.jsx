import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PersonalAuthenticationHOC from 'src/app/components/HOC/PersonalAuthentication'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import Actions from 'src/app/actions/actions'
import ActionButton from 'src/app/components/shared/action_button'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

const getState = state => ({
  app: state.app,
  customer: state.customer
})

@connect(getState)
@PersonalAuthenticationHOC
class MembershipCardExchange extends Component {
  state = {
    code: ''
  }
  componentWillUnmount() {
    this.resetButtonState()
  }

  resetButtonState = () => this.props.dispatch(Actions.app.resetButtonState())

  handleChange = e => this.setState({ code: e.target.value })

  handleValidPass = (dispatch, data) => {
    const { RedeemYouzanCode } = data.data
    this.props.dispatch(
      Actions.currentCustomer.fetchMe(() => {
        const { success, promo_code, exchange_name, errors } = RedeemYouzanCode
        if (success) {
          browserHistory.push({
            pathname: '/exchange_result',
            query: {
              exchange_name: RedeemYouzanCode.exchange_name,
              promoCodeName: !_.isEmpty(promo_code) ? promo_code.title : null,
              promoCodeDate: !_.isEmpty(promo_code)
                ? promo_code.expiration_date
                : null,
              result: true
            }
          })
        } else {
          if (exchange_name) {
            this.props.dispatch(
              Actions.tips.changeTips({
                isShow: true,
                content: errors[0]
              })
            )
            this.handleValidError()
          } else {
            browserHistory.push({
              pathname: '/exchange_result',
              query: {
                promo_code: promo_code,
                errors,
                result: false
              }
            })
          }
        }
      })
    )
  }

  handleValidError = () => {
    this.setState({
      code: ''
    })
    this.resetButtonState()
  }

  handleExchange = () => {
    const {
      app: { isWechat, hasButtonActivated },
      customer: { payment_methods },
      dispatch
    } = this.props

    if (hasButtonActivated === 'pending') return null

    dispatch(Actions.app.buttonState('pending'))
    const payment_method = _.find(payment_methods, {
      payment_gateway: isWechat ? 'wechat' : 'wechat_web'
    })
    const action = Actions.activities.redeemYZValidation({
      payment_method_id: !isWechat
        ? -2
        : !_.isEmpty(payment_method) && payment_method.id,
      code: this.state.code,
      success: this.handleValidPass,
      error: this.handleValidError
    })
    dispatch(action)
  }

  gotoAgreement = () => browserHistory.push('/agreement')

  render() {
    const {
      app: { hasButtonActivated }
    } = this.props
    return (
      <div className="membership-card">
        <PageHelmet title="会员卡兑换" link="/card_exchange" />
        <div className="title padding-left20">兑换码</div>
        <input
          type="text"
          className="card-text"
          placeholder="请输入券码"
          value={this.state.code}
          onChange={this.handleChange}
        />
        <div className="contents padding-left20">
          <p className="need-know">兑换须知</p>
          <div className="description">
            <span className="serial-num">1、</span>
            输入兑换码点击确认兑换，即完成激活;
          </div>
          <div className="description">
            <span className="serial-num">2、</span>
            请在有效期内激活使用，过期作废，不可退款；
          </div>
          <div className="description">
            <span className="serial-num">3、</span>请妥善保管兑换码,
            若发生盗用、遗失、泄露等问题不予调换与退款;
          </div>
          <div className="description">
            <span className="serial-num">4、</span>
            确认兑换即视为同意
            <span className="serial-blue" onClick={this.gotoAgreement}>
              《用户服务协议》
            </span>
            内容
          </div>
        </div>
        <StickyButtonContainer isSingle>
          <ActionButton
            disabled={!this.state.code || hasButtonActivated}
            className="exchange-btn"
            onClick={this.handleExchange}
          >
            {hasButtonActivated ? '兑换中' : '确认兑换'}
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}

export default MembershipCardExchange
