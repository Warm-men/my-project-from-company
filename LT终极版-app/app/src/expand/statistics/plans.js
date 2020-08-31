import Statistics from '../tool/statistics'
import Stories from '../../stores/stores'
import { abTrack } from '../../components/ab_testing'
import { Client } from '../services/client'
import appsFlyer from 'react-native-appsflyer'

// 访问plans页面
const visitPlans = (nowCoupon, allAvailablePurchaseCredit, nowPlan) => {
  const { currentCustomerStore } = Stories
  const {
    isSubscriber,
    subscription,
    finishedOnboardingQuestions
  } = currentCustomerStore
  const isOnboarding = finishedOnboardingQuestions === 'ALL'
  if (isOnboarding && !isSubscriber) {
    abTrack('onboarding_15', 1)
  }

  let promoCode
  if (nowCoupon) {
    promoCode = nowCoupon
  } else {
    if (nowPlan.available_promo_codes.length) {
      promoCode = nowPlan.available_promo_codes[0]
    }
  }

  let input = {
    route: 'JoinMember',
    plan: subscription ? subscription.subscription_type.id : nowPlan.id,
    has_promo_code: !!promoCode,
    price: nowPlan.preview.final_price + ''
  }
  if (!isSubscriber) {
    Statistics.onEvent({
      id: 'member_join_intent',
      label: '打开会员开通',
      attributes: {
        ...input,
        amount: promoCode ? promoCode.discount_amount : '0'
      }
    })
    abTrack('member_join_intent', 1)
  } else {
    if (nowPlan.interval === subscription.subscription_type.interval) {
      Statistics.onEvent({
        id: 'member_extend_intent',
        label: '打开会员续费',
        attributes: {
          ...input,
          promo_code_amount: promoCode ? promoCode.discount_amount : '0',
          has_purchase_credit: !!allAvailablePurchaseCredit ? 'true' : 'false',
          purchase_amount: nowPlan.preview.cash_price + ''
        }
      })
    } else {
      Statistics.onEvent({
        id: 'upgrade_member_visit',
        label: '访问升级页面',
        attributes: {
          ...input,
          upgrade_plan: nowPlan.id,
          pay_amount: nowPlan.preview.final_price,
          promo_code_amount: promoCode ? promoCode.discount_amount : '0',
          has_purchase_credit: !!allAvailablePurchaseCredit ? 'true' : 'false',
          purchase_amount: nowPlan.preview.cash_price + ''
        }
      })
    }
  }
}

//点击支付套餐按钮
const payPlan = (nowCoupon, allAvailablePurchaseCredit, nowPlan) => {
  const { currentCustomerStore } = Stories
  const {
    isSubscriber,
    subscription,
    finishedOnboardingQuestions
  } = currentCustomerStore
  const isOnboarding = finishedOnboardingQuestions === 'ALL'
  if (isOnboarding && !isSubscriber) {
    abTrack('onboarding_16', 1)
  }
  let input = {
    route: 'JoinMember',
    plan: subscription ? subscription.subscription_type.id : nowPlan.id,
    has_promo_code: !!nowCoupon,
    pay_type: this.payType,
    pay_amount: nowPlan.preview.final_price + ''
  }
  if (!isSubscriber) {
    abTrack('member_join_pay_start', 1)
    Statistics.onEvent({
      id: 'member_join_pay_start',
      label: '点开通支付',
      attributes: {
        ...input,
        amount: nowCoupon ? nowCoupon.discount_amount + '' : '0'
      }
    })
  } else {
    if (nowPlan.interval === subscription.subscription_type.interval) {
      Statistics.onEvent({
        id: 'member_extend_pay_start',
        label: '点续费支付',
        attributes: {
          ...input,
          promo_code_amount: nowCoupon ? nowCoupon.discount_amount + '' : '0',
          has_purchase_credit: !!allAvailablePurchaseCredit ? 'true' : 'false',
          purchase_amount: nowPlan.preview.cash_price + ''
        }
      })
    } else {
      Statistics.onEvent({
        id: 'upgrade_member_requset',
        label: '升级页面请求支付',
        attributes: {
          ...input,
          upgrade_plan: nowPlan.id,
          promo_code_amount: nowCoupon ? nowCoupon.discount_amount + '' : '0',
          has_purchase_credit: !!allAvailablePurchaseCredit ? 'true' : 'false',
          purchase_amount: nowPlan.preview.cash_price + ''
        }
      })
    }
  }
}

//订阅套餐成功
const paySuccess = (
  nowCoupon,
  allAvailablePurchaseCredit,
  nowPlan,
  isSubscriber
) => {
  const { currentCustomerStore } = Stories
  const { subscription, finishedOnboardingQuestions } = currentCustomerStore
  const isOnboarding = finishedOnboardingQuestions === 'ALL'
  if (isOnboarding && !isSubscriber) {
    abTrack('onboarding_17', 1)
  }

  let input = {
    route: 'JoinMember',
    plan: subscription ? subscription.subscription_type.id : nowPlan.id,
    has_promo_code: !!nowCoupon,
    pay_type: this.payType,
    pay_amount: nowPlan.preview.final_price + ''
  }
  if (!isSubscriber) {
    Statistics.onEvent({
      id: 'member_join_ok',
      label: '开通成功',
      attributes: {
        ...input,
        amount: nowCoupon ? nowCoupon.discount_amount + '' : '0'
      }
    })
    abTrack('member_join_ok', 1)
  } else {
    if (nowPlan.interval === subscription.subscription_type.interval) {
      Statistics.onEvent({
        id: 'member_extend_ok',
        label: '续费成功',
        attributes: {
          ...input,
          promo_code_amount: nowCoupon ? nowCoupon.discount_amount + '' : '0',
          has_purchase_credit: !!allAvailablePurchaseCredit ? 'true' : 'false',
          purchase_amount: nowPlan.preview.cash_price + ''
        }
      })
    } else {
      Statistics.onEvent({
        id: 'upgrade_member_success',
        label: '升级页面成功支付',
        attributes: {
          ...input,
          upgrade_plan: nowPlan.id,
          promo_code_amount: nowCoupon ? nowCoupon.discount_amount + '' : '0',
          has_purchase_credit: !!allAvailablePurchaseCredit ? 'true' : 'false',
          purchase_amount: nowPlan.preview.cash_price + ''
        }
      })
    }
  }

  // 正式环境才上报appsflyer事件
  if (Client.ORIGIN.indexOf('wechat.') !== -1) {
    const eventName = !isSubscriber ? 'member_join_ok' : 'member_extend_ok'
    const eventValues = {
      af_currency: 'CNY',
      af_revenue: nowPlan.preview.final_price
    }
    appsFlyer.trackEvent(eventName, eventValues, () => {}, () => {})
  }
}

export default {
  visitPlans,
  payPlan,
  paySuccess
}
