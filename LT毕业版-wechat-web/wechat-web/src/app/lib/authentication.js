import { format, differenceInDays } from 'date-fns'
import * as CARD_TYPE from 'src/app/lib/card_type.js'
/**
 * 用户权限
 * @param {*obj} customer
 */
const authentication = customer => ({
  isValidSubscriber: isValidSubscriber(customer),
  isExpiredSubscriber: isExpiredSubscriber(customer),
  isSubscriber: isSubscriber(customer),
  expiresInDays: expiresInDays(customer),
  isVacation: isVacation(customer),
  isSpecialUser: isSpecialUser(customer)
})

/**
 * 特殊会员用户
 * @param {*obj} customer
 */
export const isSpecialUser = customer => {
  if (!_.isEmpty(customer)) {
    const { isFreeUser, isFreeTote79 } = customer
    return isFreeUser || isFreeTote79
  }
  return false
}

/**
 * 是否度假套餐会员
 * @param {*obj} customer
 */
export const isVacation = customer => {
  if (!_.isEmpty(customer.subscription)) {
    const { subscription_type } = customer.subscription
    if (!_.isEmpty(subscription_type)) {
      return subscription_type.occasion === CARD_TYPE.OCCASION_MEMBER
    } else {
      return false
    }
  } else {
    return false
  }
}

/**
 * 订阅天数
 * @param {*obj} customer
 */
export const differenceDays = customer => {
  const { subscription } = customer
  if (!subscription) return false
  const currentTime = format(new Date(), 'YYYY-MM-DD')
  const subcriberTime = format(subscription.billing_date, 'YYYY-MM-DD')
  return differenceInDays(currentTime, subcriberTime)
}

/**
 * 是否订阅 true or false
 * @param {*obj} customer
 */
export const isValidSubscriber = customer => {
  if (isSubscriber(customer)) {
    const { status } = customer.subscription
    return (
      status === 'trial' ||
      status === 'active' ||
      status === 'pending_hold' ||
      status === 'on_hold'
    )
  }
  return false
}

/**
 * 是否过期 true or false，status:trial, active, pending_hold, on_hold都是会员期内
 * @param {*obj} customer
 */
export const isExpiredSubscriber = customer => {
  if (isSubscriber(customer)) {
    const { status } = customer.subscription
    if (
      status === 'trial' ||
      status === 'active' ||
      status === 'pending_hold' ||
      status === 'on_hold'
    ) {
      return false
    }
    return true
  } else {
    return false
  }
}

/**
 * 是否订阅
 * @param {*obj} customer
 */
export const isSubscriber = customer => {
  if (_.isEmpty(customer)) {
    return false
  } else {
    return customer.subscription && customer.subscription.id ? true : false
  }
}

/**
 * 过期天数
 * @param {*obj} customer
 */
export const expiresInDays = customer =>
  differenceDays(customer) > 0 ? differenceDays(customer) : -1

export default authentication
