import React, { Component } from 'react'
import './index.scss'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
const getState = state => {
  const {
    app: { platform },
    customer
  } = state
  return {
    customer,
    platform
  }
}
@connect(getState)
export default class FreeServiceActiveContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      price: null,
      type: '',
      isPlayingVideo: false
    }
    this.needUpdateFreeService = false
  }
  componentDidMount() {
    this.props.dispatch(
      Actions.freeService.getFreeService((dispatch, res) => {
        const { type, price } = res.data.me.free_service.free_service_type
        this.setState({ price, type })
      })
    )
  }

  cancelFreeService = async () => {
    this.props.dispatch(
      Actions.freeService.getFreeService((dispatch, response) => {
        const { can_apply_refund } = response.data.me.free_service
        if (can_apply_refund.success)
          browserHistory.push('/cancel_free_service')
        else {
          this.showErrorMessage(can_apply_refund.errors[0])
        }
      })
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
  playVideo = () => {
    this.setState({ isPlayingVideo: true }, () => {
      this.video.play()
    })
  }
  openHelp = () => {
    if (this.props.platform === 'mini_app') {
      window.location.href =
        'https://static.letote.cn/free_service/mini_app_free_service_help_390/index.html'
    } else {
      window.location.href =
        'https://static.letote.cn/free_service/wechat_free_service_help_390/index.html'
    }
  }
  handleEnd = () => {
    this.setState({ isPlayingVideo: false })
  }
  render() {
    return (
      <div className="free-service-active-container ">
        <PageHelmet title="自在选" link="/open_free_service" />
        {this.state.isPlayingVideo ? (
          <video
            className="active-video"
            ref={refs => (this.video = refs)}
            controls="controls"
            preload="true"
            src="https://static.letote.cn/free_service/vedio/free_service.mp4"
            onEnded={this.handleEnd}
          />
        ) : (
          <img
            className="active-video"
            onClick={this.playVideo}
            alt=""
            src={require('../../../../assets/images/free_service/free_service_banner.png')}
          />
        )}
        <img
          className="image"
          alt=""
          src={require('../../../../assets/images/free_service/free_service_active.png')}
        />
        <span className="opened-text">
          {this.state.type === ''
            ? ''
            : this.state.type === 'FreeServiceContractType'
            ? '已开通自在选'
            : '已开通自在选，已缴纳自在选押金'}
        </span>
        <span className="price">
          {this.state.price ? this.state.price : ''}
        </span>
        <img
          alt=""
          className="image-intro"
          src="https://static.letote.cn/free_service/close_intro.png"
        />
        <div className="active-help-container" onClick={this.openHelp}>
          <img
            className="active-image-help"
            alt=""
            src={require('../../../../assets/images/free_service/help.svg')}
          />
          <span className="active-text-help">使用帮助</span>
        </div>
        <div onClick={this.cancelFreeService} className="close-container">
          <span className="close-text">关闭自在选</span>
        </div>
      </div>
    )
  }
}
