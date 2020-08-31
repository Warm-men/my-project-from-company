import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { hash_sha256 } from 'src/app/lib/hash'
import GetCodeBtn from '../../sesamecredit/getcodebtn'
import { isValidTelephoneNum } from 'src/app/lib/validators'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActionButton from 'src/app/components/shared/action_button/index'
import Actions from 'src/app/actions/actions'
import Decorate from './images/decorate.png'
import TipsModal from 'src/app/containers/schedule_return/tips_modal'
import './index.scss'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../../lib/statistics/app'

const getState = state => {
  const { customer } = state
  return {
    customer
  }
}
@connect(getState)
export default class KolActivity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      isShowDelete: false,
      code: '',
      isShowTips: false
    }
    this.verificationCode = null
    this.isWechat = /MicroMessenger/i.test(navigator.userAgent)
  }

  componentWillMount() {
    const { customer } = this.props
    if (!this.isWechat) {
      const isLogin = customer && customer.id
      if (isLogin) {
        const input = {
          clientMutationId: customer.id
        }
        this.props.dispatch(
          Actions.customer.gqsignout(input, () => {
            if (this.isOldUser()) {
              this.setState({
                isShowTips: true
              })
            }
          })
        )
        return
      }
    } else {
      if (customer && customer.telephone && !this.isOldUser()) {
        const {
          utm_source,
          utm_medium,
          utm_campaign
        } = this.props.location.query
        browserHistory.replace(
          `/plans?next_page=kol_activity&utm_source=${utm_source}&utm_medium=${utm_medium}&utm_campaign=${utm_campaign}`
        )
        return
      }
      if (this.isOldUser()) {
        this.setState({
          isShowTips: true
        })
        return
      }
    }
  }

  componentDidMount() {
    // NOTE：百度统计页面访问
    APPStatisticManager.service(BaiduStatisService.id).push([
      '_trackPageview',
      window.location.href
    ])
  }

  isOldUser = () => {
    const { subscription } = this.props.customer
    if (subscription && subscription.id) {
      return true
    }
    return false
  }

  postCode = () => {
    if (this.isOldUser()) {
      this.setState({
        isShowTips: true
      })
      return
    }
    this.props.dispatch(
      Actions.sesameCredit.getPhoneCode(
        this.state.value,
        this.getCodeSuccess,
        this.getCodeError
      )
    )
  }

  getCodeSuccess = (dispatch, data) => {
    const { SendVerificationCode } = data.data
    this.verificationCode = SendVerificationCode
  }

  getCodeError = (dispatch, data) => {
    if (data.errors && data.errors.length > 0) {
      this.sendWaring(data.errors[0].message)
    }
  }

  hasValidTel = () => {
    if (this.isOldUser()) {
      this.setState({
        isShowTips: true
      })
      return
    }
    const regExpPhone = isValidTelephoneNum(this.state.value)
    if (!regExpPhone) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: `你输入的手机号不正确！`
        })
      )
      return false
    }
    return regExpPhone
  }

  hasValidCode = code => {
    const hashcode = this.verificationCode && code + this.verificationCode.salt
    if (
      hashcode &&
      this.verificationCode &&
      hash_sha256(hashcode) === this.verificationCode.hashed_code
    ) {
      return true
    }
    return false
  }

  handleTelChange = e => {
    let val = e.target.value
    this.setState({
      value: val.length > 11 ? val.substr(0, 11) : val,
      isShowDelete: true
    })
  }

  handleCodeChange = e => {
    let code = e.target.value
    this.setState({
      code: code.substr(0, 4)
    })
  }

  sendWaring = text =>
    this.props.dispatch(
      Actions.tips.changeTips({
        isShow: true,
        content: text
      })
    )

  handleJoinMem = () => {
    if (this.isOldUser()) {
      this.setState({
        isShowTips: true
      })
      return
    }
    if (_.isEmpty(this.state.value)) {
      this.sendWaring('手机号为空')
      return null
    }
    if (!this.hasValidTel(this.state.value)) {
      this.sendWaring('你输入的手机号不正确')
      return null
    }
    if (_.isEmpty(this.state.code)) {
      this.sendWaring('验证码为空')
      return null
    }
    if (!this.hasValidCode(this.state.code)) {
      this.sendWaring('验证码有误')
      return null
    }
    if (this.isWechat) {
      this.wechatSubmit()
    } else {
      this.regularSubmit()
    }
  }

  wechatSubmit = () => {
    this.props.dispatch(
      Actions.customer.update(
        {
          telephone: this.state.value,
          verification_code: this.state.code
        },
        this.handleRegisterSuc,
        this.handleRegisterError
      )
    )
  }

  regularSubmit = () => {
    const data = {
      customer: {
        telephone: this.state.value,
        verification_code: this.state.code
      }
    }
    const utmUrl = this.handleUtmUrl()
    this.props.dispatch(
      Actions.browserCustomer.browserSignUp({
        data,
        success: this.handleRegisterSuc,
        error: this.handleRegisterError,
        utmUrl
      })
    )
  }

  handleUtmUrl = () => {
    const { utm_source, utm_medium, utm_campaign } = this.props.location.query
    let utmUrl = `/profile`
    if (utm_source) {
      utmUrl += `?utm_source=${utm_source}`
    }
    if (utm_medium) {
      utmUrl +=
        utmUrl.indexOf('?') > -1
          ? `&utm_medium=${utm_medium}`
          : `?utm_medium=${utm_medium}`
    }
    if (utm_campaign) {
      utmUrl +=
        utmUrl.indexOf('?') > -1
          ? `&utm_campaign=${utm_campaign}`
          : `?utm_campaign=${utm_campaign}`
    }
    return utmUrl
  }

  handleRegisterSuc = (dispatch, data) => {
    if (data.errors && data.errors.length > 0) {
      this.sendWaring(data.errors[0].message)
      return
    }
    const { subscription } = data
    const isOldUser = subscription && subscription.id
    if (isOldUser) {
      this.setState({
        isShowTips: true
      })
      return
    }
    const { utm_source, utm_medium, utm_campaign } = this.props.location.query
    const action = Actions.currentCustomer.fetchMe(() => {
      browserHistory.replace(
        `/plans?next_page=kol_activity&utm_source=${utm_source}&utm_medium=${utm_medium}&utm_campaign=${utm_campaign}`
      )
    })
    dispatch(action)
  }

  handleRegisterError = (dispatch, data) => {
    data && this.sendWaring(data.message)
  }

  handleDeleteTel = () =>
    this.setState({
      isShowDelete: false,
      value: ''
    })
  confirmTipsModal = () => {
    this.setState({
      isShowTips: false
    })
  }

  render() {
    const { isShowDelete, value } = this.state
    return (
      <div className="h5-login">
        <PageHelmet title={'托特衣箱'} link={`/activity/kol_activity`} />
        <img alt="banner" src={require('./images/banner.png')} />
        <h4 className="title-tips">开启你的托特衣箱</h4>
        <label className="label-tel">
          <input
            type="tel"
            className="tel"
            value={value}
            onChange={this.handleTelChange}
            placeholder="请输入你的手机号码"
          />
          {isShowDelete && (
            <img
              src={require('src/app/containers/h5/login/images/delete.png')}
              alt="delete-tel"
              className="delete-tel"
              onClick={this.handleDeleteTel}
            />
          )}
        </label>
        <label className="label-tel-code">
          <input
            type="tel"
            value={this.state.code}
            placeholder="请输入手机验证码"
            onChange={this.handleCodeChange}
          />
          <GetCodeBtn
            regExpPhone={this.hasValidTel}
            getTime={60}
            postCode={this.postCode}
            isH5
          />
        </label>
        <ActionButton onClick={this.handleJoinMem} className="login-join">
          加入会员
        </ActionButton>
        <div className="rule-container-box">
          <h4 className="rule-title">
            <img className="decorate" alt="" src={Decorate} />
            <span className="title-text">全球品牌随心穿</span>
            <img className="decorate right" alt="" src={Decorate} />
          </h4>
          <div>
            <img alt="" src={require('./images/products.png')} />
          </div>
        </div>
        <div className="rule-container-box last">
          <h4 className="rule-title">
            <img className="decorate" alt="" src={Decorate} />
            <span className="title-text">活动规则</span>
            <img className="decorate right" alt="" src={Decorate} />
          </h4>
          <div className="rule-container">
            <p className="rule-text">
              1、在4月25日-27日内注册成为 Le Tote
              托特衣箱会员，可免费试用第一个衣箱，有效期为前10天。在前10天内且预约归还第一个衣箱前，客户可致电客服随时终止会员，并获得全额退款。
            </p>
            <p className="rule-text">
              2、从4月28日起，延长10天的活动福利，将被添加到你的会员账户。
            </p>
            <p className="rule-text">3、预约归还第一个衣箱前，不可暂停服务。</p>
            <p className="rule-text clear-margin">
              4、本活动仅针对非会员的首次注册。
            </p>
          </div>
        </div>
        {this.state.isShowTips && (
          <TipsModal
            title={`你已经是我们的老朋友啦，本次活动仅限首次注册的非会员参加。`}
            singleBtn="确定"
            singleBtnClick={this.confirmTipsModal}
          />
        )}
      </div>
    )
  }
}
