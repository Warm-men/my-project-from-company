import React from 'react'
import * as storage from 'src/app/lib/storage.js'
import { connect } from 'react-redux'
import './index.scss'

const getState = state => ({
  customer: state.customer
})

@connect(getState)
class ReferrralTips extends React.Component {
  constructor() {
    super()
    this.state = {
      isShow: false
    }
    this.showShareList = [
      'products',
      // 'new_product',
      'brands',
      'occasion',
      'collections'
    ]
    this.specialList = [
      '/customize/collections',
      '/rating_products',
      '/all_products',
      '/collection_products'
    ]
    this.timer = null
  }

  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location
    const { isShow } = this.state
    const showIcon = this.isShowIcon(pathname)
    if (isShow && !showIcon) {
      this.setState({
        isShow: false
      })
      return null
    }
    const isShowMiniAppIcon = storage.get('isShowMiniAppIcon')
    if (
      this.isShowIcon(pathname) &&
      this.props.isMiniApp &&
      !isShowMiniAppIcon &&
      this.isHadShareQuali()
    ) {
      storage.set('isShowMiniAppIcon', true)
      this.setState(
        {
          isShow: true
        },
        () => {
          this.timer = setTimeout(this.hideIcon, 5000)
        }
      )
    }
  }

  componentWillUnmount() {
    storage.remove('isShowMiniAppIcon')
    this.timer && clearTimeout(this.timer)
  }

  isHadShareQuali = () => {
    const {
      authentication: { isSpecialUser, isSubscriber }
    } = this.props
    return !isSpecialUser && isSubscriber
  }

  isShowIcon = url => {
    let isShow = false
    _.map(this.showShareList, v => {
      if (
        _.includes(url, v) &&
        !_.includes(this.specialList, url) &&
        !_.includes(url, 'customize')
      ) {
        isShow = true
      }
    })
    return isShow
  }

  hideIcon = () => {
    this.setState({
      isShow: false
    })
    this.timer && clearTimeout(this.timer)
  }

  render() {
    const { isShow } = this.state
    const { customer } = this.props
    if (!isShow) {
      return null
    }
    return (
      <div className="mini-app-referral-tips">
        <div className="referral-box">
          <img
            onClick={this.hideIcon}
            src={require('./images/tips_img.svg')}
            alt=""
          />
          <div className="referral-text">
            邀请好友得
            <span className="text-number">
              ¥
              {customer.active_referral_program
                ? customer.active_referral_program.sender_amount
                : 0}
            </span>
            奖励金
          </div>
        </div>
      </div>
    )
  }
}

export default ReferrralTips
