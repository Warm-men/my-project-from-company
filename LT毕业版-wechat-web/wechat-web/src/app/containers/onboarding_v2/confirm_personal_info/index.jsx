import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import BirthdayInputV2 from './birthday_input_v2'
import Actions from 'src/app/actions/actions'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActionButton from 'src/app/components/shared/action_button'
import './index.scss'

const getState = state => ({
  customer: state.customer
})

@connect(getState)
class ConfirmPersonalInfo extends Component {
  constructor(props) {
    super(props)
    const {
      nickname,
      style: { birthday }
    } = props.customer
    this.state = {
      nickname,
      birthday,
      isSubmit: false
    }
  }

  changeUserInfo = info => this.setState({ birthday: info })

  changeNickName = e => {
    const name = e.target.value
    if (typeof name === 'string' && name.length <= 15) {
      this.setState({
        nickname: name
      })
    }
  }

  handleSubmit = () => {
    if (this.state.isSubmit) return null
    const { dispatch } = this.props
    this.setState({
      isSubmit: true
    })
    dispatch(
      Actions.customer.update({
        nickname: this.state.nickname
      })
    )

    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({
        data: {
          style: {
            birthday: this.state.birthday
          }
        },
        success: () => {
          dispatch(Actions.currentCustomer.fetchMe())
          browserHistory.push('/new_totes')
        }
      })
    )
  }

  render() {
    return (
      <div className="birthday-v2">
        <PageHelmet title="我的衣箱" link="/confirm_personal_info" />
        <div className="personal-infomaiton">请确认你的基本资料</div>
        <div className="nickname">如何称呼你</div>
        <input
          type="text"
          className="nickname-input"
          placeholder="请输入你的昵称"
          maxLength={15}
          value={this.state.nickname}
          onChange={this.changeNickName}
        />
        <BirthdayInputV2
          activeKey="birthday"
          title="你的生日"
          placeholder="请选择"
          defaultValue={this.state.birthday}
          onChange={this.changeUserInfo}
        />
        <ActionButton
          disabled={!(this.state.nickname && this.state.birthday)}
          onClick={this.handleSubmit}
          className="btn-submits"
        >
          {this.state.isSubmit ? '提交中' : '提交'}
        </ActionButton>
      </div>
    )
  }
}

export default ConfirmPersonalInfo
