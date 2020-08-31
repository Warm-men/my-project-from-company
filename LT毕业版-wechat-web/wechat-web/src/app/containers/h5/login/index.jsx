import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { hash_sha256 } from 'src/app/lib/hash'
import GetCodeBtn from '../../sesamecredit/getcodebtn'
import { isValidTelephoneNum } from 'src/app/lib/validators'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActionButton from 'src/app/components/shared/action_button/index'
import Actions from 'src/app/actions/actions'
import * as storage from 'src/app/lib/storage.js'
import './login.scss'
import {
  APPStatisticManager,
  ShenceStatisService
} from '../../../lib/statistics/app'

function mapStateToProps(state) {
  const { app } = state
  return {
    app
  }
}
@connect(mapStateToProps)
class H5Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      isShowDelete: false,
      code: ''
    }
    this.verificationCode = null
  }

  postCode = () => {
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

  hasValidTel = () => isValidTelephoneNum(this.state.value)

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
    if (!this.hasValidTel(this.state.value)) {
      this.sendWaring('你输入的手机号不正确!')
      return null
    }
    if (!this.hasValidCode(this.state.code)) {
      this.sendWaring('验证码有误')
      return null
    }
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
    if (_.includes(data.success_redirect_path, 'new_sign_up=true')) {
      APPStatisticManager.service(ShenceStatisService.id).track('new_sign_up', {
        mobile: this.state.value,
        wechat_id: data.id
      })
    }

    const action = Actions.currentCustomer.fetchMe(() => {
      const { query } = this.props.location,
        isPromoCodeActivity = !_.isEmpty(query.promo_code)

      // NOTE: fix h5 payment activity, payment goback
      if (isPromoCodeActivity) storage.set('promo_code', query.promo_code)
      let pathname = isPromoCodeActivity ? '/promo_plans' : '/plans'
      if (query.url) {
        pathname = query.url
      }
      browserHistory.replace({
        pathname,
        query: {
          next_page: 'h5_page',
          ...query
        }
      })
    })
    dispatch(action)
  }

  handleRegisterError = data => data && this.sendWaring(data.message)

  handleDeleteTel = () =>
    this.setState({
      isShowDelete: false,
      value: ''
    })

  render() {
    const { isShowDelete, value } = this.state
    return (
      <div className="h5-login">
        <PageHelmet title={'Le Tote 托特衣箱'} link={`/h5_login`} />
        <div className="banner" />
        <div className="login-box">
          <label className="label-tel">
            <input
              type="number"
              className="tel"
              value={value}
              onChange={this.handleTelChange}
              placeholder="请输入你的手机号码"
            />
            {isShowDelete && (
              <img
                src={require('./images/delete.png')}
                alt="delete-tel"
                className="delete-tel"
                onClick={this.handleDeleteTel}
              />
            )}
          </label>
          <label className="label-tel-code">
            <input
              type="number"
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
        </div>
      </div>
    )
  }
}

export default H5Login
