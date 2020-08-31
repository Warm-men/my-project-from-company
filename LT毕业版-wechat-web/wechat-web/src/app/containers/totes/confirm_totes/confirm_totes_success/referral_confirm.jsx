import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import ActionButton from 'src/app/components/shared/action_button/index'
import PageHelmet from 'src/app/lib/pagehelmet'
import { ReferralWarn } from 'src/app/containers/referral/index.jsx'
import wxInit from 'src/app/lib/wx_config.js'
import authentication from 'src/app/lib/authentication'
import deviceType from 'src/app/lib/device_type'
import { endOfDay, differenceInDays, format } from 'date-fns'
import ReferralShareImage from 'src/app/containers/referral/images/referral_share_image.png'
import './index.scss'
import { UTM_REFERRAL_CONFIRM } from '../../../../constants/global_config'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../../../lib/statistics/app'

const getState = state => ({
  customer: state.customer,
  authentication: authentication(state.customer),
  isWechat: state.app.isWechat,
  platform: state.app.platform
})

export default connect(getState)(Referral)
function Referral(props) {
  const [isShowReferral, setIsShowReferral] = useState(false)

  let referral_url_arr = props.customer.referral_url.split('/')
  let referral_code = encodeURIComponent(
    referral_url_arr[referral_url_arr.length - 1]
  )

  const customerId = props.customer.id

  const isVip =
    props.authentication.isSubscriber &&
    !props.customer.isFreeUser &&
    !props.customer.isFreeTote79

  const title = isVip
    ? `${props.customer.nickname}送你一个超超超大衣橱！`
    : 'Le Tote 托特衣箱'

  const shareImgUrl = isVip
    ? ReferralShareImage
    : 'https://qimg.letote.cn/logo/12logo400x400.png'

  const link = isVip
    ? `https://${window.location.host}/referral_free_tote?referral_code=${referral_code}${UTM_REFERRAL_CONFIRM}`
    : `https://${window.location.host}/home`

  const desc = isVip
    ? '立刻领取TA送你的专属优惠，来自美国的时装共享平台'
    : '来自美国的时装共享平台，一件衣服价格，每日不同造型，全球时装任意换'
  const goReferral = () => {
    if (props.isWechat) {
      window.location.href = `https://${window.location.host}/referral`
    } else {
      // NOTE：小程序获取环境变量是异步，location方式不便处理
      browserHistory.push('/referral')
    }
  }
  useEffect(() => {
    // NOTE:非微信不需要
    if (props.isWechat) {
      if (deviceType().isiOS) {
        wxInit()
      } else {
        wxInit(true, null, true)
      }
      //WECHATSHARE: 确认介绍页微信分享
      wx.ready(() => {
        wxMenuShareTimeline()
        wxMenuShareAppMessage()
        if (isVip) {
          wxHideMenuItems()
        }
      })
      isVip &&
        APPStatisticManager.service(BaiduStatisService.id).track(
          'referral',
          { customerId },
          'intent'
        )
    }
  }, [])

  const wxMenuShareTimeline = () => {
    wx.onMenuShareTimeline({
      title,
      link,
      imgUrl: shareImgUrl,
      success: () => {
        setIsShowReferral(false)
        APPStatisticManager.service(BaiduStatisService.id).track(
          'referral',
          { target: 'time_line', customerId },
          'success'
        )
        window.adhoc('track', 'referral_share_success', 1)
      },
      trigger: () => {
        APPStatisticManager.service(BaiduStatisService.id).track(
          'referral',
          { target: 'time_line', customerId },
          'share'
        )
      },
      fail: () => wxInit(true, wxMenuShareTimeline)
    })
  }

  const wxMenuShareAppMessage = () => {
    wx.onMenuShareAppMessage({
      title,
      desc,
      link,
      imgUrl: shareImgUrl,
      success: () => {
        setIsShowReferral(false)
        APPStatisticManager.service(BaiduStatisService.id).track(
          'referral',
          { target: 'app_message', customerId },
          'success'
        )
        window.adhoc('track', 'referral_share_success', 1)
      },
      trigger: () => {
        APPStatisticManager.service(BaiduStatisService.id).track(
          'referral',
          { target: 'app_message', customerId },
          'share'
        )
      },
      fail: () => wxInit(true, wxMenuShareAppMessage)
    })
  }

  const wxHideMenuItems = () =>
    wx.hideMenuItems({
      menuList: [
        'menuItem:share:qq',
        'menuItem:share:weiboApp',
        'menuItem:share:QZone'
      ], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
      fail: () => wxInit(true, wxHideMenuItems)
    })

  const handleOpenWarn = () => {
    if (isVip) {
      setIsShowReferral(state => !state)
      APPStatisticManager.service(BaiduStatisService.id).track(
        'referral',
        { customerId },
        'click'
      )
    } else {
      browserHistory.push('/plans?next_page=authorize')
    }
  }

  const renewSubscription = () => {
    const {
      subscription: { billing_date, totes_left },
      enable_payment_contract
    } = props.customer
    let message = null
    const billingDate = endOfDay(billing_date)
    const leftSubscriptionDays = differenceInDays(billingDate, new Date())
    if (!enable_payment_contract.length) {
      if (totes_left >= 1) {
        if (leftSubscriptionDays < 15) {
          return (message = (
            <div>
              会员期剩
              <span className={'lineHeightText'}>{leftSubscriptionDays}</span>
              天，衣箱数剩余
              <span className={'lineHeightText'}>{totes_left}个</span>
              ，到期后未用完衣箱将被清零，续费可延长会员期
            </div>
          ))
        }
      } else if (totes_left === 0) {
        if (leftSubscriptionDays < 8) {
          if (leftSubscriptionDays === 0) {
            return (message = (
              <div>会员今天到期，到期后需立即归还衣箱，续费可延长会员期</div>
            ))
          } else {
            return (message = (
              <div>
                会员期剩
                <span className={'lineHeightText'}>
                  {leftSubscriptionDays}天
                </span>
                ，衣箱数剩余
                <span className={'lineHeightText'}>{totes_left}个</span>
                ，到期后需立即归还衣箱，续费可延长会员期
              </div>
            ))
          }
        } else if (leftSubscriptionDays < 15) {
          return (message = (
            <div>
              会员期剩
              <span className={'lineHeightText'}>{leftSubscriptionDays}天</span>
              ，衣箱数剩余
              <span className={'lineHeightText'}>{totes_left}个</span>
            </div>
          ))
        }
      }
    }
    return message
  }

  const {
    platform,
    customer: {
      nickname,
      referral_banner,
      subscription: { billing_date, totes_left }
    }
  } = props
  if (!customerId) return null
  const isShowShare = platform !== 'jd'
  const renewMessage = renewSubscription()
  const billingDateText = format(endOfDay(billing_date), 'YYYY.M.DD')
  return (
    <div className="confirm-totes-suc referral">
      <PageHelmet
        title="下单成功"
        link="/confirm-totes-success"
        shareTitle={`${nickname}送你一个超超超大衣橱！`}
        shareUrl={link}
      />
      {isShowReferral && (
        <ReferralWarn
          isMiniApp={platform === 'mini_app'}
          handleOpenWarn={handleOpenWarn}
        />
      )}
      <img
        className="success-icon"
        alt=""
        src={require('src/app/containers/complete_size/images/success_logo.png')}
      />
      <p className="success-title">下单成功</p>
      {isShowShare ? (
        <div className="button-view">
          {renewMessage ? (
            <>
              <div className="renew-view">{renewMessage}</div>
              <ActionButton
                actionType="secondary"
                size="small"
                className="mid share-totes"
                to="/plans"
              >
                立即续费
              </ActionButton>
            </>
          ) : (
            <>
              <div className="renew-view fix-margin-bottom">
                会员期至
                <span className={'lineHeightText'}>{billingDateText}</span>
                ，衣箱数剩余
                <span className={'lineHeightText'}>{totes_left}个</span>
              </div>
              <div onClick={goReferral}>
                <img
                  className="referral-banner"
                  src={referral_banner.referred_program_entry_banner_url}
                  alt=""
                />
              </div>
            </>
          )}
          <Link to="/totes" className="back-totes-btn">
            返回衣箱
          </Link>
        </div>
      ) : (
        <div>
          {renewMessage ? (
            <div>
              <div className="renew-view">{renewMessage}</div>
              <ActionButton
                actionType="secondary"
                size="small"
                className="mid share-totes"
                to="/plans"
              >
                立即续费
              </ActionButton>
              <Link to="/totes" className="back-totes-btn">
                返回衣箱
              </Link>
            </div>
          ) : (
            <div>
              <span className="tips-text" />
              <ActionButton
                actionType="secondary"
                size="small"
                className="mid share-totes"
                to="/totes"
              >
                返回衣箱
              </ActionButton>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
