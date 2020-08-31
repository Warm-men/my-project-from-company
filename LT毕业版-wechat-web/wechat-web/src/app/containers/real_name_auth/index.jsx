import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions'
import { formatIdCard, formatTelephoneNum } from 'src/app/lib/card_input'
import {
  isValidIdCard,
  isValidChineseName,
  isValidTelephoneNum
} from 'src/app/lib/validators.js'
import delay from 'src/app/lib/delay.js'
import { browserHistory } from 'react-router'
import './index.scss'

@connect()
export default class RealNameAuthentication extends React.Component {
  state = { authNum: '', telNum: '', username: '' }

  componentWillUnmount() {
    this.props.dispatch(Actions.tips.changeTips({ isShow: false }))
  }

  handleRealName = e => this.setState({ username: e.target.value })

  handleAuthNum = e =>
    this.setState({
      authNum: formatIdCard(e.target.value).toUpperCase()
    })

  handleTelNum = e =>
    this.setState({ telNum: formatTelephoneNum(e.target.value) })

  handleSubmit = e => {
    e.preventDefault()
    if (this.hasValidState === 'pending') return null
    this.hasValidState = 'pending'
    const { authNum, telNum, username } = this.state
    const { dispatch } = this.props

    const formatIdCardNum = authNum.replace(/ /g, '').toUpperCase()
    const formatTelNum = telNum.replace(/ /g, '')

    if (!(username && authNum && telNum)) {
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: '请填写完全部信息'
        })
      )
      this.hasValidState = false
      return null
    }

    if (
      !(
        isValidIdCard(formatIdCardNum) &&
        isValidChineseName(username) &&
        isValidTelephoneNum(formatTelNum)
      )
    ) {
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: (
            <div>
              输入格式有误
              <br />
              请重新填写
            </div>
          )
        })
      )
      this.hasValidState = false
      return null
    }

    dispatch(
      Actions.tips.changeTips({
        isShow: true,
        content: '系统正在认证，请稍后',
        timer: 20,
        image: require('src/app/containers/profile/free_password/images/loading.gif')
      })
    )

    dispatch(
      Actions.authentication.identityAuth({
        name: username,
        telephone: formatTelNum,
        id_number: formatIdCardNum,
        success: this.handleAuthSuccess
      })
    )
  }

  handleAuthSuccess = async (dispatch, resData) => {
    const { verified, errors } = resData.data.IdentityAuthentication
    this.hasValidState = false
    if (verified) {
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: '认证成功',
          timer: 1.5,
          image: require('./images/success.svg')
        })
      )
      // dispatch(Actions.totes.fetchIdentityAuth(this.props.tote_id))
      await delay()
      browserHistory.replace('/confirm-totes')
    } else {
      dispatch(Actions.tips.changeTips({ isShow: false }))
      dispatch(
        Actions.app.showGlobalAlert({
          icon: require('./images/fail.svg'),
          title: '认证失败',
          content: _.isEmpty(errors)
            ? '手机号码，身份证姓名和身份证号码匹配不一致，请重新填写或在微信公众号内回复任意消息与客服进行沟通。'
            : errors[0],
          textAlign: 'center',
          handleClick: this.handleResetHint,
          btnText: '重新填写'
        })
      )
    }
  }

  handleResetHint = () => this.props.dispatch(Actions.app.resetGlobalAlert())

  render() {
    return (
      <div className="real-name-auth-container">
        <div className="real-name-auth">
          <PageHelmet title="实名认证" link="/real_name_auth" />
          <img src={require('./images/banner.png')} className="banner" alt="" />
          <form className="form-container" onSubmit={this.handleSubmit}>
            <label htmlFor="real-name">
              <span>身份证姓名</span>
              <input
                type="text"
                id="real-name"
                maxLength={6}
                placeholder="请输入真实姓名"
                value={this.state.username}
                onChange={this.handleRealName}
              />
            </label>
            <label htmlFor="auth-num">
              <span>身份证号码</span>
              <input
                type="text"
                id="auth-num"
                maxLength={21}
                placeholder="请输入身份证号码"
                value={this.state.authNum}
                onChange={this.handleAuthNum}
              />
            </label>
            <label htmlFor="tel-num">
              <span>手机号码</span>
              <input
                type="tel"
                id="tel-num"
                maxLength={13}
                placeholder="请输入与身份信息匹配的手机号码"
                value={this.state.telNum}
                onChange={this.handleTelNum}
              />
            </label>
            <button type="submit">立即认证</button>
          </form>
        </div>
        <div className="information-view">
          <span className="information">
            中国港澳台居民及海外人士
            <br />
            请直接联系客服进行实名认证
          </span>
        </div>
      </div>
    )
  }
}
