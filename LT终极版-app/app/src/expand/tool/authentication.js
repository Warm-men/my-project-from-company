import dateFns from 'date-fns'

/**
 * 用户权限
 * @param {*obj} customer
 */
const authentication = customer => {
  return {
    isValidSubscriber: isValidSubscriber(customer),
    isExpiredSubscriber: isExpiredSubscriber(customer),
    isSubscriber: isSubscriber(customer),
    expiresInDays: expiresInDays(customer),
    subscriptionDate: subscriptionDate(customer)
  }
}

/**
 * 订阅天数
 * @param {*obj} customer
 */
const differenceDays = customer => {
  const { subscription } = customer
  if (!subscription) return 1
  const currentTime = dateFns.format(new Date(), 'YYYY-MM-DD')
  const subscriptionTime = dateFns.format(
    subscription.billing_date,
    'YYYY-MM-DD'
  )
  return dateFns.differenceInDays(currentTime, subscriptionTime)
}

/**
 * 截止日期
 * @param {*obj} customer
 */
const subscriptionDate = customer => {
  const { subscription } = customer
  if (!subscription) return ''
  if (!subscription.billing_date) return ''
  const subscriptionTime = dateFns.format(
    subscription.billing_date,
    'YYYY年MM月DD日'
  )
  return subscriptionTime
}

/**
 * 是否订阅 true or false
 * @param {*obj} customer
 */
const isValidSubscriber = customer => differenceDays(customer) <= 0

/**
 * 是否过期 true or false
 * @param {*obj} customer
 */
const isExpiredSubscriber = customer => {
  const billing_date =
    customer.subscription && customer.subscription.billing_date
  return (
    isSubscriber(customer) &&
    (billing_date === 'N/A' ||
      billing_date === null ||
      differenceDays(customer) > 0)
  )
}

/**
 * 是否订阅
 * @param {*obj} customer
 */
const isSubscriber = customer =>
  customer.subscription && customer.subscription.id ? true : false

/**
 * 过期天数
 * @param {*obj} customer
 */
const expiresInDays = customer =>
  differenceDays(customer) > 0 ? differenceDays(customer) : -1

export default authentication
