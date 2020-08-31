import React, { Component } from 'react'
import { connect } from 'react-redux'
import TextInput from 'src/app/components/purchase_v2/text_input'
import Actions from 'src/app/actions/actions.js'
import { browserHistory } from 'react-router'
import ActionButton from 'src/app/components/shared/action_button/index'
import PageHelmet from 'src/app/lib/pagehelmet'

import './index.scss'

function mapStateToProps(state) {
  const { customer } = state
  return {
    customer
  }
}
@connect(mapStateToProps)
export default class UpdateNickName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nickName: props.customer.nickname,
      isSubmit: false
    }
  }

  changeNickName = name => {
    if (typeof name === 'string' && name.length <= 15) {
      this.setState({
        nickName: name
      })
    }
  }

  clearNickName = () => {
    this.setState({
      nickName: ''
    })
  }

  updateNickName = () => {
    const validNickname = this.updateInputValue(this.state.nickName)
    if (validNickname.length === 0) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: `请输入要修改的昵称！`
        })
      )
      return
    }
    this.setState({
      isSubmit: true
    })
    this.props.dispatch(
      Actions.customer.update(
        {
          nickname: validNickname
        },
        this.updateSuccess,
        this.uodateError
      )
    )
  }

  updateSuccess = () => {
    browserHistory.goBack()
  }

  uodateError = () => {
    this.setState({
      isSubmit: false
    })
  }

  updateInputValue = value => value.replace(/(^\s*)|(\s*$)/g, '')

  render() {
    const disabled = this.state.isSubmit || this.state.nickName.length === 0
    return (
      <div className="change-telephone-container">
        <PageHelmet title="修改昵称" link={`/update_nickname`} />
        <TextInput
          placeholder="请输入你的新昵称"
          value={this.state.nickName}
          onChange={this.changeNickName}
          clearInput={this.clearNickName}
        />
        <span className="input-tip-text">
          1-15个字符，仅支持中文、英文、数字、符号及其组合
        </span>
        <ActionButton
          className="change-telephone-btn nickname-btn"
          disabled={disabled}
          size="stretch"
          onClick={this.updateNickName}
        >
          {this.state.isSubmit ? '提交中...' : '提交'}
        </ActionButton>
      </div>
    )
  }
}
