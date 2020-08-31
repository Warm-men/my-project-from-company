import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionButton from 'src/app/components/shared/action_button/index'
import Actions from 'src/app/actions/actions.js'
import { browserHistory } from 'react-router'
import { formatSpaceTel } from 'src/app/lib/format_telephone'
import Sesamecredit from 'src/app/containers/sesamecredit'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

function mapStateToProps(state) {
  const { customer } = state
  return {
    customer
  }
}

@connect(mapStateToProps)
export default class UpdateTelephone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showTelephoneTip: props.customer.telephone
    }
    //NOTE: 从微信公众号菜单访问
    this.pre_wechat_menu = !!props.location.query.pre_wechat_menu
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  successCallback = () => {
    this.timer && clearTimeout(this.timer)
    this.props.dispatch(
      Actions.tips.changeTips({
        isShow: true,
        content: '绑定成功'
      })
    )
    this.timer = setTimeout(() => {
      browserHistory.replace('/account')
    }, 2000)
  }

  changeTelephone = () => {
    this.setState({
      showTelephoneTip: false
    })
  }

  renderTelephoneTip = () => {
    const { customer } = this.props
    return (
      <div className="change-telephone-container">
        <h5 className="change-telephone-title">
          <span className="change-telephone-icon" />
          <span>当前绑定的手机号</span>
        </h5>
        <h4 className="change-telephone-tel">
          {formatSpaceTel(customer.telephone)}
        </h4>
        <p className="change-telephone-tip">
          更换手机号码不影响你的会员卡等账户信息
        </p>
        <button className="change-telephone-btn" onClick={this.changeTelephone}>
          更换手机号码
        </button>
      </div>
    )
  }

  render() {
    if (this.pre_wechat_menu) {
      return this.state.showTelephoneTip ? (
        <BindTelephon telephone={this.props.customer.telephone} />
      ) : (
        <Sesamecredit
          {...this.props}
          title={'绑定手机号'}
          submitButtonText={'立即绑定'}
          updateSuccess={this.successCallback}
          pre_wechat_menu={this.pre_wechat_menu}
        />
      )
    } else {
      return this.state.showTelephoneTip ? (
        this.renderTelephoneTip()
      ) : (
        <Sesamecredit
          {...this.props}
          title={'更换手机号码'}
          submitButtonText={'更换手机号码'}
          updateSuccess={this.successCallback}
          pre_wechat_menu={this.pre_wechat_menu}
        />
      )
    }
  }
}

const BindTelephon = ({ telephone }) => {
  const tel = telephone.replace('+86', '')
  return (
    <div className="bind-tel">
      <PageHelmet
        title={'绑定手机号码'}
        link={`/update_tel?pre_wechat_menu=true`}
      />
      {/* <div className="logo" /> */}
      <span>你已绑定手机号码</span>
      <div className="tel">
        {`${tel.substr(0, 3)} ${tel.substr(3, 4)} ${tel.substr(7)}`}
      </div>
      <ActionButton to="/">去首页看看</ActionButton>
    </div>
  )
}
