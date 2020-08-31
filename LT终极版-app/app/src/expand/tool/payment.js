import { Mutate, SERVICE_TYPES } from '../../expand/services/services'
import channel from '../../expand/tool/channel'
import { Platform } from 'react-native'
import JdPay from 'react-native-letote-jdpay'
import Alipay from 'react-native-letote-alipay'
import PaymentConstants from './payment_constanst'
import Stores from '../../stores/stores'
const pay = async (id, promo_code, payment_method_id) => {
  payment_method_id = parsePaymentId(payment_method_id)
  return extendSubscription(id, promo_code, payment_method_id)
    .then(result => {
      return sendRequest(result)
    })
    .catch(error => {
      return sendPayFail({ error })
    })
}
export const payOrder = async (id, promo_code, payment_method_id) => {
  payment_method_id = parsePaymentId(payment_method_id)
  return retryPayment(id, promo_code, payment_method_id)
    .then(result => {
      return sendRequest(result)
    })
    .catch(() => {
      return sendPayFail()
    })
}

const parsePaymentId = payment_method_id => {
  switch (payment_method_id) {
    case PaymentConstants.type.WECHAT_NATIVE:
      payment_method_id = PaymentConstants.id.WECHAT_NATIVE_PAYMENT_ID
      break
    case PaymentConstants.type.JD_PAY_NATIVE:
      payment_method_id = PaymentConstants.id.JD_PAY_NATIVE_PAYMENT_ID
      break
    case PaymentConstants.type.ALIPAY_NATIVE:
      payment_method_id = PaymentConstants.id.ALPAY_NATIVE_PAYMENT_ID
      break
    default:
      payment_method_id = PaymentConstants.id.DEFAULT_PAYMENT_METHOD
  }
  return payment_method_id
}
export const getPaymentId = (
  paymentMethod,
  payment_method_id,
  currentPaymentMethodId,
  currentPrice
) => {
  switch (paymentMethod) {
    //免密支付失败 走常规支付
    case PaymentConstants.type.WECHAT_NATIVE:
      payment_method_id =
        currentPrice < 500
          ? currentPaymentMethodId === -1
            ? currentPaymentMethodId
            : payment_method_id
          : -1
      break
    case PaymentConstants.type.JD_PAY_NATIVE:
      payment_method_id = PaymentConstants.id.JD_PAY_NATIVE_PAYMENT_ID
      break
    case PaymentConstants.type.ALIPAY_NATIVE:
      payment_method_id = PaymentConstants.id.ALPAY_NATIVE_PAYMENT_ID
      break
    default:
      payment_method_id = PaymentConstants.id.WECHAT_NATIVE_PAYMENT_ID
  }
  return payment_method_id
}
/**
 * [请求生成支付订单]
 * @param  {[String]}  id                      [productId]
 * @param  {[String]}  promo_code             [description]
 * @param  {[String]}  payment_method_id     [wechat_native或者-1]
 * @return {Promise}                        [description]
 */
const extendSubscription = async (id, promo_code, payment_method_id) => {
  let utm_source = Platform.OS === 'ios' ? channel : await channel
  let promise = await new Promise((resolve, reject) => {
    Mutate(
      SERVICE_TYPES.extendSubscription.MUTATION_EXTENDSUBSCRIPTION,
      {
        extendSubscriptionInput: {
          payment_method_id: payment_method_id,
          promo_code: promo_code,
          subscription_type_id: id,
          marketing_attribution: { utm_source },
          unlock_tote_inventory: true
        }
      },
      response => {
        //TODO 错误处理
        resolve(response.data.ExtendSubscription)
      },
      error => {
        reject(error)
        //TODO 错误处理
      }
    )
  })
  return promise
}

const retryPayment = async (id, promo_code, payment_method_id) => {
  let promise = await new Promise((resolve, reject) => {
    let input = {
      order_id: id,
      payment_method_id: payment_method_id
    }
    if (promo_code) {
      input.promo_code = promo_code
    }
    Mutate(
      SERVICE_TYPES.retryPayment.RETRY_PAYMENT,
      {
        retryPaymentInput: input
      },
      response => {
        //TODO 错误处理
        resolve(response.data.RetryPayment)
      },
      error => {
        reject(error)
        //TODO 错误处理
      }
    )
  })
  return promise
}
/**
 * enable customer contract for  WeChat
 * @return {Promise}       [description]
 */
export const enableCustomerContract = async (
  openFreeService,
  isSelectedFreeService
) => {
  return requestContractInfo(openFreeService, isSelectedFreeService)
    .then(response => {
      return openWechatContractPage(response)
    })
    .catch(error => {
      return sendContractFail(error)
    })
}
const openWechatContractPage = async response => {
  var WeChat = require('react-native-letote-wechat')
  return await WeChat.contract(response)
}
const requestContractInfo = async (openFreeService, isSelectedFreeService) => {
  let promise = await new Promise((resolve, reject) => {
    Mutate(
      SERVICE_TYPES.customerContract.ENABLE_CUSTOMER_CONTRACT,
      {
        enableCustomerContractInput: {
          payment_method_id: PaymentConstants.id.CONTRACT_PAYMENT_METHOD_ID,
          open_free_service: openFreeService,
          is_charge_after_entrust: !!isSelectedFreeService
        }
      },
      response => {
        if (
          response.data.EnableCustomerContract.errors &&
          response.data.EnableCustomerContract.errors.length > 0
        ) {
          reject(response.data.EnableCustomerContract.errors[0])
        } else {
          resolve(response.data.EnableCustomerContract.contract_attributes)
          //用于记录续费的免密支付的id
          Stores.subscriptionStore.charge_after_entrust_id =
            response.data.EnableCustomerContract.charge_after_entrust.id
        }
      },
      error => {
        reject(error)
      }
    )
  })
  return promise
}

/**
 * disables customer contract for  WeChat
 * @return {Promise}       [description]
 */
export const disableCustomerContract = async (
  payment_contract_id,
  contract_termination_remark
) => {
  let promise = await new Promise((resolve, reject) => {
    Mutate(
      SERVICE_TYPES.customerContract.DISABLE_CUSTOMER_CONTRACT,
      {
        disableCustomerContractInput: {
          payment_contract_id: payment_contract_id,
          contract_termination_remark: contract_termination_remark
        }
      },
      response => {
        resolve(response)
      },
      error => {
        error && reject(error)
      }
    )
  })
  return promise
}

export const sendRequest = result => {
  if (result && result.order && result.order.successful) {
    return sendPaySuccess()
  } else if (result.errors) {
    return sendPayFailError(result.errors)
  } else {
    return sendPayRequest(result)
  }
}
export const sendPayRequest = async result => {
  try {
    let paymentResult
    switch (result.payment.gateway) {
      case PaymentConstants.type.WECHAT_NATIVE:
        var WeChat = require('react-native-letote-wechat')
        paymentResult = await WeChat.pay(
          JSON.parse(result.payment.authorization_details)
        )
        break
      case PaymentConstants.type.JD_PAY_NATIVE:
        paymentResult = await JdPay.pay(result.payment.authorization_details)
        break
      case PaymentConstants.type.ALIPAY_NATIVE:
        paymentResult = await Alipay.pay(result.payment.authorization_details)
        break
    }
    return paymentResult
  } catch (e) {
    console.log(e)
  }
}

export const purchaseOverdraft = async paymentId => {
  payment_method_id = parsePaymentId(paymentId)
  return requestOverDraft(payment_method_id)
    .then(result => {
      return sendRequest(result.data.PurchaseOverdraft)
    })
    .catch(error => {
      return sendPayFail({ error })
    })
}

const requestOverDraft = async payment_method_id => {
  let promise = await new Promise((resolve, reject) => {
    Mutate(
      SERVICE_TYPES.overdraft.MUTATION_PURCHASE_OVERDRAFT,
      { input: { payment_method_id } },
      response => {
        resolve(response)
      },
      error => {
        error && reject(error)
      }
    )
  })
  return promise
}
const sendPaySuccess = async () => {
  const result = {}
  result.errCode = 0
  return await result
}
const sendPayFail = async data => {
  const result = {}
  //支付失败
  result.errCode = -1
  if (data && data.error) {
    result.error = data.error
  }
  return await result
}
const sendPayFailError = async errors => {
  const result = {}
  //支付失败提示
  result.errors = errors
  return await result
}
const sendContractFail = async error => {
  const result = {}
  result.errCode = -1
  result.message = error
  return await result
}

export default pay
