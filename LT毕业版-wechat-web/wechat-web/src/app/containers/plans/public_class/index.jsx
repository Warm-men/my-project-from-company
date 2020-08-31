import Actions from 'src/app/actions/actions'
import { format, differenceInMilliseconds } from 'date-fns'
import { browserHistory } from 'react-router'
import wxInit from 'src/app/lib/wx_config.js'
import * as storage from 'src/app/lib/storage.js'
import { navigateToMiniProgram } from '../mini_program'
import { paymentMethodId } from 'src/app/lib/payment_method_id.js'
import {
  APPStatisticManager,
  BaiduStatisService,
  ShenceStatisService
} from '../../../lib/statistics/app'

export default class PublicClass extends React.Component {
  showPaymentTipsText = (isSubscriber, expiration_date) => {
    if (isSubscriber && expiration_date) {
      return format(new Date(expiration_date), '有效期至YYYY年MM月DD日')
    } else {
      return '会员期从衣箱寄出后开始计算'
    }
  }

  fetchPlans = () => {
    const fetch = Actions.subscriptionTypes.fetchSubscriptionTypes(
      'signupable',
      this.initValidPromoCode()
    )
    this.props.dispatch(fetch)
  }

  initMaxPromoCode = () => {
    const { data, dispatch } = this.props
    if (!_.isEmpty(data)) {
      const validPromoCode = data.available_promo_codes,
        maxValidPromoCode = this.sortMaxPromoCode(validPromoCode)
      dispatch(Actions.promoCode.set(maxValidPromoCode))
    }
  }

  sortMaxPromoCode = (promo_code = []) =>
    !_.isEmpty(promo_code) &&
    promo_code.reduce((preValue, curValue) =>
      preValue.discount_amount < curValue.discount_amount ? curValue : preValue
    )

  initValidPromoCode = () => {
    const { promoCode, data } = this.props
    const { promo_code: query_promo_code } = this.props.location.query
    let promo_code = ''
    if (this.promo_plans) {
      promo_code = query_promo_code || storage.get('promo_code') || ''
    } else {
      const promo_codes = !_.isEmpty(data) ? data.available_promo_codes : ''
      if (_.isEmpty(promoCode.code)) {
        const maxPromoCode = this.sortMaxPromoCode(promo_codes)
        if (maxPromoCode.status === 'Valid') {
          promo_code = maxPromoCode.code
        }
      } else {
        const index = _.findIndex(promo_codes, v => v.code === promoCode.code)
        promo_code =
          index !== -1
            ? promoCode.code
            : this.sortMaxPromoCode(promo_codes).code
        if (index === -1) {
          // this.props.dispatch(
          //   Actions.tips.changeTips({
          //     isShow: true,
          //     content: '此券不支持此会员卡使用'
          //   })
          // )
          this.initMaxPromoCode()
        }
      }
    }
    return promo_code
  }

  platformSubscriptionInput = (
    subscription_type_id,
    promoCode,
    platform,
    payment_methods
  ) => {
    const { codeState, code } = promoCode
    const operation_plan = this.props.operation_plan
    const { utm_source, utm_medium, utm_campaign } = this.props.location.query
    const utmSource = utm_source
      ? {
          utm_source,
          utm_medium,
          utm_campaign
        }
      : {}
    let promocode = ''
    if (!this.referralCode && this.props.app.abtestGiftRecieveState) {
      promocode = 'ABTEST_COUPLE_GIFT'
    } else if (!_.isEmpty(operation_plan) && operation_plan.promo_code) {
      promocode = operation_plan.promo_code.code
    } else if (codeState === 'valid') {
      promocode = code
    } else if (this.promo_plans) {
      // NOTE:79、149，promo_plans
      promocode =
        this.props.location.query.promo_code || storage.get('promo_code')
    }
    return {
      subscription_type_id,
      promo_code: promocode,
      payment_method_id: paymentMethodId(platform, payment_methods),
      marketing_attribution: utmSource,
      // NOTE：区分是否锁定库存
      unlock_tote_inventory: true
    }
  }

  analyzePlansEnter = props => {
    APPStatisticManager.service(BaiduStatisService.id).track(
      this.analyzeUserType,
      this.utm_data,
      'intent'
    )
    // NOTE：神策数据-非会员和会员访问页面上报事件
    const { authentication, data, promoCode, customer } = props
    const analyzeData = {
      plan: data.id,
      route: window.location.pathname,
      has_promo_code: !_.isEmpty(customer.valid_promo_codes),
      price: data.preview && data.preview.final_price,
      app_utm_source: this.utm_data.source,
      app_utm_medium: this.utm_data.medium,
      app_utm_compaign: this.utm_data.campaign
    }
    if (!authentication.isSubscriber) {
      APPStatisticManager.service(ShenceStatisService.id).track(
        'member_join_intent',
        {
          ...analyzeData,
          amount: promoCode.discountAmount
        }
      )
    } else {
      const { available_purchase_credit } = customer,
        amount = available_purchase_credit
          ? available_purchase_credit.amount
          : 0

      APPStatisticManager.service(ShenceStatisService.id).track(
        'member_extend_intent',
        {
          ...analyzeData,
          has_purchase_credit: amount > 0,
          purchase_credit_amount: data.preview.cash_price,
          promo_code_amount: promoCode.discountAmount
        }
      )
    }
  }

  analyzePlansRequest = () => {
    // NOTE：神策数据-非会员和会员调起支付上报事件
    const { authentication, promoCode, app, customer } = this.props
    const data = this.sensorsData || this.props.data
    this.sensorsData = data
    const hasPromoCode = this.referralCode || promoCode.codeState === 'valid'
    const analyzeData = {
      plan: data.id,
      has_promo_code: hasPromoCode,
      pay_type: app.platform,
      pay_amount: data.preview && data.preview.final_price,
      app_utm_source: this.utm_data.source,
      app_utm_medium: this.utm_data.medium,
      app_utm_compaign: this.utm_data.campaign
    }
    if (!authentication.isSubscriber) {
      APPStatisticManager.service(ShenceStatisService.id).track(
        'member_join_pay_start',
        {
          ...analyzeData,
          amount: promoCode.discountAmount
        }
      )
    } else {
      const { available_purchase_credit } = customer,
        amount = available_purchase_credit
          ? available_purchase_credit.amount
          : 0

      APPStatisticManager.service(ShenceStatisService.id).track(
        'member_extend_pay_start',
        {
          ...analyzeData,
          has_purchase_credit: amount > 0,
          purchase_credit_amount: data.preview.cash_price,
          promo_code_amount: promoCode.discountAmount
        }
      )
    }
  }

  analyzePlansSuccess = () => {
    // NOTE：神策数据-非会员和会员支付成功上报事件，调起和成功上报数据相同
    const { authentication, promoCode, app, customer } = this.props
    const data = this.sensorsData || this.props.data
    const hasPromoCode = this.referralCode || promoCode.codeState === 'valid'
    const analyzeData = {
      plan: data.id,
      route: window.location.pathname,
      has_promo_code: hasPromoCode,
      pay_type: app.platform,
      pay_amount: data.preview && data.preview.final_price,
      app_utm_source: this.utm_data.source,
      app_utm_medium: this.utm_data.medium,
      app_utm_compaign: this.utm_data.campaign
    }
    if (!authentication.isSubscriber) {
      APPStatisticManager.service(ShenceStatisService.id).track(
        'member_join_ok',
        {
          ...analyzeData,
          amount: promoCode.discountAmount
        }
      )
    } else {
      const { available_purchase_credit } = customer,
        amount = available_purchase_credit
          ? available_purchase_credit.amount
          : 0

      APPStatisticManager.service(ShenceStatisService.id).track(
        'member_extend_ok',
        {
          ...analyzeData,
          has_purchase_credit: amount > 0,
          purchase_credit_amount: data.preview.cash_price,
          promo_code_amount: promoCode.discountAmount
        }
      )
    }
  }

  handlePayment = () => {
    const {
      data,
      customer: { jd_credit_score, finished_onboarding_questions },
      app: { platform },
      location: { pathname },
      dispatch
    } = this.props
    // NOTE: 购买度假套餐 jd 信用分数不够时提示
    if (
      pathname === '/mplans' &&
      platform === 'jd' &&
      jd_credit_score &&
      Number(jd_credit_score.score) < 70
    ) {
      dispatch(
        Actions.app.showGlobalAlert({
          content: '你的小白信用低于70分，暂时还不能享受免押金权益',
          handleClick: () => dispatch(Actions.app.resetGlobalAlert()),
          btnText: '好的'
        })
      )
      return null
    }
    // NOTE: remember payment type
    if (platform === 'jd') {
      storage.set(
        'userType',
        this.authentication.isSubscriber ? 'renewMember' : 'openMember'
      )
    }

    APPStatisticManager.service(BaiduStatisService.id).track(
      this.analyzeUserType,
      { price: data.base_price },
      'pay'
    )
    this.trackAbtest && this.trackAbtest('click_plans_btn')

    if (
      finished_onboarding_questions === 'ALL' &&
      !this.authentication.isSubscriber
    )
      window.adhoc('track', 'onboarding_16', 1)

    if (this.props.app.hasButtonActivated) {
      return null
    }
    dispatch(Actions.app.buttonState('pending'))
    if (this.referralCode) {
      //NOTE: save referral code
      this.props.dispatch(
        Actions.referral.userSaveReferralCode(
          this.referralCode,
          this.extendSubscription
        )
      )
    } else {
      this.extendSubscription()
    }
  }

  extendSubscription = () => {
    this.creatOrderTime = format(new Date())
    const {
      data: { id },
      promoCode,
      app: { platform },
      customer: { payment_methods }
    } = this.props
    //NOTE: If you don't have annual card, use a monthly card(user card type: annual card or month card)
    //NOTE: annual card activity page enter plans, use current subscription type => annual card type.
    const fetch = Actions.subscription.extendSubscription(
      this.platformSubscriptionInput(id, promoCode, platform, payment_methods),
      this.extendSubscriptionSuccess,
      this.extendSubscriptionError
    )
    this.props.dispatch(fetch)
  }

  extendSubscriptionSuccess = (dispatch, data, actionData) => {
    // NOTE:统计订单生成时间
    const startTime = this.creatOrderTime
    if (startTime) {
      const successTime = format(new Date())
      const spendTime = differenceInMilliseconds(successTime, startTime)
      APPStatisticManager.service(BaiduStatisService.id).track(
        this.analyzeUserType,
        { duration: `${spendTime}ms` },
        'create_order'
      )
      this.creatOrderTime = null
    }

    this.analyzePlansRequest()

    dispatch(Actions.app.buttonState('reset'))

    const { ExtendSubscription } = data.data,
      {
        app: { isWechat, platform },
        data: { base_price },
        customer: { finished_onboarding_questions, id }
      } = this.props
    //NOTE: (0元支付)not need to payment
    if (ExtendSubscription.order.successful) {
      if (!isWechat) {
        return browserHistory.replace(this.renderH5Success)
      } else {
        this.analyzePlansSuccess()
      }
      this.fetchNewPromoCode()
      this.linkToPlansSuccess()
      return null
    }

    const { authorization_details } = ExtendSubscription.payment
    const authorizationDetails = JSON.parse(authorization_details)

    // NOTE: jd payment
    if (platform === 'jd') {
      window.location.href = authorizationDetails.url
      return null
    }

    //NOTE: h5 payment
    if (platform === 'wechat_web') {
      const redirect_url = `https://${window.location.host}${this.renderH5Success}`
      window.location.href = `${
        authorizationDetails.mweb_url
      }&redirect_url=${encodeURIComponent(redirect_url)}`
      return null
    }

    //mini program
    if (platform === 'mini_app') {
      const params = {
        payParams: authorization_details,
        payType: this.authentication.isSubscriber
          ? 'renewMember'
          : 'openMember',
        redirect_url: '/plans_success'
      }
      if (this.referralCode) {
        params['isReferral'] = this.referralCode
      }
      navigateToMiniProgram(params)
      return null
    }

    //NOTE: wechat payment
    wx.chooseWXPay({
      timestamp: authorizationDetails.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: authorizationDetails.nonceStr, // 支付签名随机串，不长于 32 位
      package: authorizationDetails.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: authorizationDetails.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: authorizationDetails.paySign, // 支付签名
      success: () => {
        // 支付成功后的回调函数
        if (!this.authentication.isSubscriber) {
          try {
            window.adhoc('track', 'PAYFORPLANS', 1)
            this.trackAbtest && this.trackAbtest('subscribe_member')
            this.trackAbtest && this.trackAbtest('handle_plans_success')
            this.trackAbtest && this.trackAbtest('referral_plans_success')
            this.trackAllSub && this.trackAllSub('subscribe_member_v2')
            if (finished_onboarding_questions === 'ALL')
              window.adhoc('track', 'onboarding_17', 1)
          } catch (error) {
            console.log(error)
          }
        }
        // NOTE:任何购买行为都上报
        window.adhoc('track', 'all_subscribe_member', 1)
        // NOTE:统计购买成功
        APPStatisticManager.service(BaiduStatisService.id).track(
          this.analyzeUserType,
          { price: base_price, ...this.utm_data },
          'pay_success'
        )

        this.analyzePlansSuccess()

        //NOTE: payment success, fetch new promo code again
        this.fetchNewPromoCode()
        this.linkToPlansSuccess()
      },
      fail: () => {
        // NOTE:统计购买失败
        APPStatisticManager.service(BaiduStatisService.id).track(
          this.analyzeUserType,
          { price: base_price, ...this.utm_data },
          'pay_failure'
        )
        const errorInfo = {
          authorizationDetails,
          price: base_price,
          customer_id: id
        }
        this.props.dispatch(Actions.errorAction.reportErrorMessage(errorInfo))
        wxInit(true, () =>
          this.extendSubscriptionSuccess(dispatch, data, actionData)
        )
      },
      cancel: () => {
        this.isShowQuestionAlert && this.showQuestionAlert()
        // NOTE:统计用户取消购买
        APPStatisticManager.service(BaiduStatisService.id).track(
          this.analyzeUserType,
          { price: base_price, ...this.utm_data },
          'pay_cancel'
        )
      }
    })
  }

  extendSubscriptionError = () => {
    this.creatOrderTime = null
    this.props.dispatch(Actions.app.buttonState('reset'))
  }

  fetchNewPromoCode = () => {
    const action = Actions.currentCustomer.fetchMe(),
      dispatch = this.props.dispatch
    dispatch(action)
    dispatch(Actions.promoCode.reset())
  }
}
