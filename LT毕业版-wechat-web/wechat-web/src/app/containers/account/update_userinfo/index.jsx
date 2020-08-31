import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'
import { splitAreaCode } from 'src/app/lib/format_telephone'
import Actions from 'src/app/actions/actions.js'
import PageHelmet from 'src/app/lib/pagehelmet'
import GeneralWxShareHOC from 'src/app/components/HOC/GeneralWxShare'
import { formatSpaceTel } from 'src/app/lib/format_telephone'
import {
  MARRIAGE,
  INDUSTRY
} from 'src/app/containers/onboarding/basic_data/utils.js'
import BirthdayInput from './birthday_input'
import UpdateSelectInput from './update_select'
import { format } from 'date-fns'
import Headportrait from 'src/assets/images/account/mine_headportrait.svg'
import 'src/assets/stylesheets/components/desktop/account/account.scss'

const dataList = [
  {
    type: 'nickname',
    title: `昵称`,
    href: '/update_nickname'
  },
  {
    type: 'occupation',
    title: `行业`,
    isStyle: true
  },
  {
    type: 'nickname',
    title: `婚育`,
    isStyle: true
  }
]

function mapStateToProps(state) {
  const { customer } = state
  return {
    customer
  }
}

@connect(mapStateToProps)
@GeneralWxShareHOC
export default class UpdateNickName extends Component {
  constructor(props) {
    super(props)
    const { occupation, birthday, mom, marital_status } = props.customer.style
    this.state = {
      style: {
        birthday,
        occupation: occupation || '',
        mom,
        marital_status
      },
      isSubmit: false,
      isShowPicker: false
    }
  }

  componentWillMount() {
    this.props.dispatch(Actions.currentCustomer.fetchMe())
  }

  componentDidMount() {
    this.unlisten = browserHistory.listen(() => {
      const { style } = this.state
      this.props.dispatch(
        Actions.customerStyleInfo.updateUserDataAction({
          data: { style }
        })
      )
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  handleSubmit = () => {
    this.setState(
      {
        isSubmit: true
      },
      this.updateCustomer
    )
  }

  updateCustomer = () => {
    const { style } = this.state
    // NOTE:日期提交自动格式转换
    let birthday = style['birthday']
    if (birthday) {
      birthday = format(new Date(birthday), 'YYYY-MM-DD')
    }
    style['birthday'] = birthday
    this.props.dispatch(
      Actions.customerStyleInfo.updateUserDataAction({
        data: {
          style
        },
        success: browserHistory.goBack
      })
    )
  }

  handleMaritalStatus = () => {
    const { style } = this.state
    let status = ''
    _.findIndex(MARRIAGE, v => {
      const { mom, marital_status } = v.value
      if (mom === style.mom && marital_status === style.marital_status) {
        status = v.display
      }
    })
    return status
  }

  updateUserInfo = (info, activekey) => {
    let { style } = this.state
    if (info !== '未填写') {
      style[activekey] = format(info, 'YYYY-MM-DD')
    }
    style[activekey] = info
    this.setState({
      submitData: style
    })
  }

  changeMarriage = marriage => {
    let { style } = this.state
    const newData = _.find(MARRIAGE, o => marriage === o.display)
    if (newData) {
      this.setState({
        style: {
          ...style,
          ...newData.value
        }
      })
    }
  }

  togglePicker = state => {
    this.setState({
      isShowPicker: state
    })
  }

  render() {
    const { customer } = this.props
    // { credit_scores } = customer
    // const isCredit = credit_scores && credit_scores.length > 0
    const isValid = splitAreaCode(customer['telephone'])
    const telUrl = !isValid ? '/update_tel?pre_wechat_menu=true' : '/update_tel'
    const { style, isSubmit, isShowPicker } = this.state
    return (
      <div className="AccountContainerBox">
        <PageHelmet title="个人信息" link={`/update_userinfo`} />
        <div className="NavListBox">
          <div className="SelectList avatar">
            <img
              className="avatar-img"
              src={customer['avatar_url'] || Headportrait}
              alt=""
            />
          </div>
          <div className="SelectList">
            {dataList.map((v, k) => {
              const param = v.href
                ? {
                    to: v.href
                  }
                : {}
              return (
                <Link {...param} className="SelectBox" key={k}>
                  <div className="SelectLeft">
                    {v.icon && <img alt="" src={v.icon} />}
                    {v.title}
                  </div>
                  {v.type === 'avatar_url' ? (
                    <div className="SelectRight text-left">
                      <img className="avatar" src={customer[v.type]} alt="" />
                    </div>
                  ) : (
                    <div className="SelectRight text-left">
                      {v.isStyle ? (
                        v.type === 'occupation' ? (
                          <UpdateSelectInput
                            activeKey="occupation"
                            defaultValue={style[v.type]}
                            onChange={this.updateUserInfo}
                            options={INDUSTRY}
                          />
                        ) : (
                          <UpdateSelectInput
                            defaultValue={this.handleMaritalStatus()}
                            onChange={this.changeMarriage}
                            options={_.map(MARRIAGE, v => v.display)}
                          />
                        )
                      ) : (
                        <span key="text" className="right-text">
                          {v.isStyle ? style[v.type] : customer[v.type]}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
            <div className="SelectBox">
              <div className="SelectLeft">生日</div>
              <div className="SelectRight text-left">
                <BirthdayInput
                  activeKey="birthday"
                  placeholder="未填写"
                  defalutValue={style['birthday']}
                  onChange={this.updateUserInfo}
                  togglePicker={this.togglePicker}
                />
              </div>
            </div>
          </div>
          <div className="SelectList">
            <Link to={telUrl} className="SelectBox">
              <div className="SelectLeft">手机号</div>
              <div className="SelectRight text-left">
                <span className="right-text">
                  {isValid ? formatSpaceTel(customer['telephone']) : '未绑定'}
                </span>
              </div>
            </Link>
          </div>
          {!isShowPicker && (
            <StickyButtonContainer>
              <ActionButton
                disabled={isSubmit}
                className="left-btn"
                onClick={this.updateCustomer}
                size="stretch"
              >
                保存
              </ActionButton>
            </StickyButtonContainer>
          )}
        </div>
      </div>
    )
  }
}
