import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReasonItem from './reason_item/'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import './index.scss'
import PageHelmet from 'src/app/lib/pagehelmet'
const REASON = [
  '已有服务都很满意，不需要多选2件',
  '归还太麻烦',
  '多选2件衣服很困难',
  '暂时不想用托特衣箱',
  '其他'
]
@connect()
export default class CancelFreeServiceContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { selectIndex: null, comment: null, type: '' }
  }
  componentDidMount() {
    this.props.dispatch(
      Actions.freeService.getFreeService((dispatch, res) => {
        this.setState({ type: res.data.me.free_service.free_service_type.type })
      })
    )
  }
  selectReason = selectIndex => {
    this.setState({ selectIndex })
  }
  goBack = () => {
    browserHistory.goBack()
  }

  handleChange = e => {
    this.setState({ comment: e.currentTarget.value })
  }
  cancelFreeService = () => {
    if (!this.state.comment && this.state.selectIndex === null) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: '请先回答本题',
          timer: 2
        })
      )
      return
    }
    this.props.dispatch(
      Actions.freeService.cancelFreeService(
        {
          reason: this.state.comment || REASON[this.state.selectIndex]
        },
        (dispatch, response) => {
          if (!response.data.CancelFreeService.errors) {
            //取消成功
            browserHistory.replace(
              '/refunding_free_service?from_cancel_page=true'
            )
          } else {
            this.showErrorMessage(response.data.CancelFreeService.errors[0])
          }
        }
      )
    )
  }

  showErrorMessage = error => {
    this.props.dispatch(
      Actions.app.showGlobalHint({
        leftButton: () => this.props.dispatch(Actions.app.resetGlobalHint()),
        rightButton: () => {
          this.props.dispatch(Actions.app.resetGlobalAlert())
          this.handleErrorEvent(error.error_code)
        },
        content: error.message,
        leftBtnText: '取消',
        rightBtnText:
          error.error_code === 'errors_free_service_need_recharge_account'
            ? '去支付'
            : '查看'
      })
    )
  }
  handleErrorEvent = errorCode => {
    switch (errorCode) {
      case 'errors_free_service_need_recharge_account':
        //信用账户
        browserHistory.push('/credit_account')
        break
      case 'errors_free_service_has_locked_totes':
      case 'errors_free_service_has_incomplete_totes':
      case 'errors_exists_unreturn_free_service_product':
        //你当前有未归还的衣箱
        browserHistory.push('/totes')
        break
      case 'errors_free_service_in_cart':
        //请先空出已占用的自在选衣位
        browserHistory.push('/new_totes')
        break
      default:
        break
    }
    this.props.dispatch(Actions.app.resetGlobalHint())
  }

  render() {
    return (
      <div className="container">
        <PageHelmet title="自在选" link="/cancel_free_service" />
        <span className="title">为什么要关闭自在选呢？</span>
        {REASON.map((value, index) => {
          return (
            <ReasonItem
              onClick={this.selectReason}
              key={value}
              reason={value}
              index={index}
              isSelect={this.state.selectIndex === index}
            />
          )
        })}
        {this.state.selectIndex === 4 ? (
          <textarea
            className="textarea"
            placeholder="告诉我们关闭自在选的原因，我们会做得更好"
            onChange={this.handleChange}
          />
        ) : null}
        <div
          onClick={this.cancelFreeService}
          className={[
            this.state.selectIndex !== 4
              ? 'close-free-service-container'
              : 'close-free-service-inputshow-container'
          ]}
        >
          <span className="close-free-service">
            {this.state.type === ''
              ? ''
              : this.state.type === 'FreeServiceContractType'
              ? '确认关闭'
              : '确认关闭，并退还我的自在选押金'}
          </span>
        </div>
        <div className="cancel-container" onClick={this.goBack}>
          <span className="cancel">取消</span>
        </div>
      </div>
    )
  }
}
