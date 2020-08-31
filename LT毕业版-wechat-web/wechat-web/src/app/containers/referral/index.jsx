import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import classname from 'classnames'
import ActionButton from 'src/app/components/shared/action_button/index'
import PageHelmet from 'src/app/lib/pagehelmet'
import ProgressTable from './invitation_progress/progress_table'
import wxInit from 'src/app/lib/wx_config.js'
import authentication from 'src/app/lib/authentication'
import deviceType from 'src/app/lib/device_type'
import Actions from 'src/app/actions/actions'
import Swiper from 'react-id-swiper'
import Headportrait from 'src/assets/images/account/mine_headportrait.svg'
import ReferralShareImage from 'src/app/containers/referral/images/referral_share_image.png'
import './index.scss'
import { UTM_REFERRAL } from '../../constants/global_config'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../lib/statistics/app'

const getState = state => ({
  customer: state.customer,
  authentication: authentication(state.customer),
  isWechat: state.app.isWechat,
  isMiniApp: state.app.platform === 'mini_app'
})

@connect(getState)
class Referral extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowReferral: false,
      isShowActivityRules: false,
      scrollText: null
    }
    this.options = {
      direction: 'vertical',
      slidesPerView: 1,
      autoplay: true,
      loop: false,
      spaceBetween: 8,
      mousewheel: true,
      speed: 100
    }
    this.referral_url_arr = props.customer.referral_url.split('/')
    this.referral_code = encodeURIComponent(
      this.referral_url_arr[this.referral_url_arr.length - 1]
    )

    this.handleInitShare()
  }

  componentWillMount() {
    if (!this.props.isWechat) {
      browserHistory.replace('/home')
      return null
    } else {
      window.adhoc('getFlags', flag => {
        this.setState({
          abtestVar: flag.get('D181127_WECHAT_REFERRAL_ALL_ALL')
        })
      })
    }
    window.adhoc('getFlags', flag => {
      this.setState({
        abtestVar: flag.get('D181127_WECHAT_REFERRAL_ALL_ALL')
      })
    })
    this.props.dispatch(
      Actions.searchSuccessReferrals.searchSuccessReferrals(
        (dispatch, data) => {
          const { success_referrals } = data.data
          this.setState({
            scrollText: success_referrals
          })
        }
      )
    )
  }

  componentDidMount() {
    if (deviceType().isiOS) {
      wxInit()
    } else {
      wxInit(true, null, true)
    }
    //WECHATSHARE: 介绍页微信分享
    wx.ready(() => {
      this.wxMenuShareTimeline()
      this.wxMenuShareAppMessage()
      if (this.isVip) {
        this.wxHideMenuItems()
      }
    })
    this.isVip &&
      APPStatisticManager.service(BaiduStatisService.id).track(
        'referral',
        {
          customerId: this.props.customer.id
        },
        'intent'
      )
  }

  componentWillReceiveProps(nextProps) {
    // NOTE：重置分享
    if (!_.isEmpty(nextProps.customer)) {
      this.handleInitShare(nextProps)
    }
  }

  handleInitShare = nextProps => {
    const props = nextProps || this.props
    this.isVip =
      props.authentication.isSubscriber &&
      !props.customer.isFreeUser &&
      !props.customer.isFreeTote79

    this.title = this.isVip
      ? `${props.customer.nickname}送你一个超超超大衣橱！`
      : 'Le Tote 托特衣箱'

    this.imgUrl = this.isVip
      ? ReferralShareImage
      : 'https://qimg.letote.cn/logo/12logo400x400.png'

    this.link = this.isVip
      ? `https://${window.location.host}/referral_free_tote?referral_code=${this.referral_code}${UTM_REFERRAL}`
      : `https://${window.location.host}/home`

    this.desc = this.isVip
      ? '立刻领取TA送你的专属优惠，来自美国的时装共享平台'
      : '来自美国的时装共享平台，一件衣服价格，每日不同造型，全球时装任意换'
  }

  wxMenuShareTimeline = () => {
    wx.onMenuShareTimeline({
      title: this.title,
      link: this.link,
      imgUrl: this.imgUrl,
      success: () => {
        this.setState({
          isShowReferral: false
        })
        APPStatisticManager.service(BaiduStatisService.id).track(
          'referral',
          {
            target: 'time_line',
            customerId: this.props.customer.id
          },
          'success'
        )
        window.adhoc('track', 'referral_share_success', 1)
      },
      trigger: () => {
        APPStatisticManager.service(BaiduStatisService.id).track(
          'referral',
          {
            target: 'time_line',
            customerId: this.props.customer.id
          },
          'share'
        )
      },
      fail: () => wxInit(true, this.wxMenuShareTimeline)
    })
  }

  wxMenuShareAppMessage = () => {
    wx.onMenuShareAppMessage({
      title: this.title,
      desc: this.desc,
      link: this.link,
      imgUrl: this.imgUrl,
      success: () => {
        this.setState({
          isShowReferral: false
        })
        APPStatisticManager.service(BaiduStatisService.id).track(
          'referral',
          {
            target: 'app_message',
            customerId: this.props.customer.id
          },
          'success'
        )
        window.adhoc('track', 'referral_share_success', 1)
      },
      trigger: () => {
        APPStatisticManager.service(BaiduStatisService.id).track(
          'referral',
          {
            target: 'app_message',
            customerId: this.props.customer.id
          },
          'share'
        )
      },
      fail: () => wxInit(true, this.wxMenuShareAppMessage)
    })
  }

  wxHideMenuItems = () =>
    wx.hideMenuItems({
      menuList: [
        'menuItem:share:qq',
        'menuItem:share:weiboApp',
        'menuItem:share:QZone'
      ], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
      fail: () => wxInit(true, this.wxHideMenuItems)
    })

  handleOpenWarn = () => {
    if (this.isVip) {
      this.setState(state => ({
        isShowReferral: !state.isShowReferral
      }))
      APPStatisticManager.service(BaiduStatisService.id).track(
        'referral',
        {
          customerId: this.props.customer.id
        },
        'click'
      )
    } else {
      browserHistory.push('/plans')
    }
  }

  handleOpenRule = () =>
    this.setState(state => ({
      isShowActivityRules: !state.isShowActivityRules
    }))

  handleLinkToProgess = () => {
    browserHistory.push('/referral_progress')
  }

  handleMiniShareLink = () => {
    const { authentication, customer } = this.props
    const isVip =
      authentication.isSubscriber &&
      !customer.isFreeUser &&
      !customer.isFreeTote79
    if (isVip) {
      return `https://${
        window.location.host
      }/referral_free_tote?nickname=${encodeURIComponent(
        customer.nickname
      )}&avatar_url=${encodeURIComponent(customer.avatar_url)}&referral_code=${
        this.referral_code
      }`
    } else {
      return `https://${window.location.host}/home`
    }
  }

  handleBannerClick = url => () => {
    if (!_.isEmpty(url)) {
      window.location.href = url
    }
  }

  handleBtnClick = () => {
    window.adhoc('track', 'click_referral_btn', 1)
    this.handleOpenWarn()
  }

  render() {
    const { scrollText } = this.state
    if (!scrollText || !this.props.customer.id) {
      return null
    }
    const {
        available_purchase_credit,
        spent_purchase_credit,
        referrals,
        nickname,
        referral_banner: {
          referral_program_banner_url,
          referral_program_jump_url
        },
        active_referral_program
      } = this.props.customer,
      hasReferral = referrals && referrals.length !== 0,
      hasMoreReferral = referrals && referrals.length > 20,
      classname_free_tote = classname('free-tote', {
        'not-vip-free-tote-height': !this.isVip
      })
    const sender_amount = _.isEmpty(active_referral_program)
      ? 0
      : active_referral_program.sender_amount
    return (
      <div className="referral">
        <PageHelmet
          title="邀请好友有礼"
          link="/referrl"
          shareTitle={this.isVip ? `${nickname}送你一个超超超大衣橱！` : null}
          shareUrl={this.isVip ? this.handleMiniShareLink() : null}
        />
        {this.state.isShowReferral && (
          <ReferralWarn
            isMiniApp={this.props.isMiniApp}
            handleOpenWarn={this.handleOpenWarn}
          />
        )}
        {this.state.isShowActivityRules && (
          <Rules
            senderAmount={sender_amount}
            handleOpenRule={this.handleOpenRule}
          />
        )}

        <header>
          <img
            className="banner"
            src={referral_program_banner_url}
            onClick={this.handleBannerClick(referral_program_jump_url)}
            alt="img..."
          />
        </header>
        <div className={classname_free_tote}>
          <h5>邀请好友有礼</h5>
          <span className="free-tote-text">
            将链接分享给好友，双方各得
            <span className="text-tips">¥{sender_amount}奖励金</span>
          </span>
          <div className="activity" onClick={this.handleOpenRule}>
            活动规则 <i />
          </div>
          {scrollText && (
            <div className="scroll-text-box">
              <Swiper {...this.options} wrapperClass="scroll-container-scroll">
                {_.map(scrollText, (v, k) => {
                  return (
                    <div key={k} className="scroll-container">
                      <img
                        className="scroll-img"
                        alt=""
                        src={v.customer_avatar || Headportrait}
                      />
                      <span className="scroll-text">
                        <span className="active-name">{v.customer_name}</span>
                        成功邀请好友
                        <span className="active-text">
                          {v.referral_count}名
                        </span>
                        ，获得
                        <span className="active-text">
                          ¥{v.time_cash_amount}
                        </span>
                        奖励金
                      </span>
                    </div>
                  )
                })}
              </Swiper>
            </div>
          )}
          {!this.isVip && (
            <div className="novip-description">活动仅限会员参与</div>
          )}
          <ActionButton onClick={this.handleBtnClick} className="btn">
            {this.isVip ? '邀请得奖励' : '加入会员'}
          </ActionButton>
        </div>
        {this.isVip && (
          <div className="process-box">
            <div className="top-title">邀请流程</div>
            <img
              className="referral-process"
              src={require('./images/referral-process.png')}
              alt=""
            />
          </div>
        )}
        {this.isVip && (
          <div>
            <div className="bonus">
              <div className="top-title">已获得奖励金</div>
              {!hasReferral && (
                <div className="top-description">
                  奖励金可用于续费或购买服饰，可累计使用
                </div>
              )}
              {hasReferral ? (
                <div className="bonus-table">
                  <span className="price">
                    {spent_purchase_credit.amount +
                      available_purchase_credit.amount}
                  </span>
                  元
                </div>
              ) : (
                <div className="no-referral">
                  还没有获得奖励，赶快邀请好友加入会员吧
                </div>
              )}
            </div>

            {hasReferral && (
              <div className="invitation-progress">
                <div className="top-title">邀请进度</div>
                <div className="top-description">
                  已成功邀请{referrals.length}
                  人，好友加入会员7天后即可获得奖励金
                </div>
                <ProgressTable
                  referrals={
                    hasMoreReferral ? referrals.slice(0, 20) : referrals
                  }
                />
                {hasMoreReferral && (
                  <div className="load-more" onClick={this.handleLinkToProgess}>
                    查看更多 <i />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export const ReferralWarn = ({ handleOpenWarn, isMiniApp }) => (
  <div className="warnning" onClick={handleOpenWarn}>
    <img
      className={`ref-arrow ${isMiniApp ? 'mini-app' : ''}`}
      src={require('./images/referral-arrow.png')}
      alt="img..."
    />
    <p className="add-me">点击右上角分享邀请链接给好友</p>
  </div>
)

const Rules = ({ handleOpenRule, senderAmount }) => (
  <div className="rules">
    <div className="rules-detail">
      <div className="rules-title">活动规则</div>
      <div className="rules-contents">
        1、好友通过你的邀请链接，可用￥{senderAmount}
        奖励金优惠成为托特衣箱会员；
      </div>
      <div className="rules-contents">
        2、好友加入会员7天后，你可获得¥{senderAmount}
        奖励金，成功邀请越多，获得奖励越多；
      </div>
      <div className="rules-contents">
        3、奖励金从获得之日起一年内有效，可用于续费或购买服饰，并可累计使用；
      </div>
      <div className="rules-contents">
        4、请勿恶意刷奖励金，如发现违规行为，我们有权取消因此获得的奖励金。
      </div>
    </div>
    <img
      src={require('./images/delete.png')}
      onClick={handleOpenRule}
      className="rule-del"
      alt="img..."
    />
  </div>
)

export default Referral
