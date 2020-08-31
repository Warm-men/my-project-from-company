import { getToteCartError } from 'src/app/containers/totes/new_totes/utils/shopping_car_error.js'

describe('测试加入尺码按钮文字与状态', () => {
  let validateResult
  it('validateResult数据为空', () => {
    validateResult = null
    expect(getToteCartError(validateResult)).toEqual(null)
    validateResult = {}
    expect(getToteCartError(validateResult)).toEqual(null)
    validateResult = {
      errors: []
    }
    expect(getToteCartError(validateResult)).toEqual(null)
  })
  it('文字提示', () => {
    validateResult = {
      errors: [
        {
          error_code: '',
          message: '测试'
        }
      ]
    }
    expect(getToteCartError(validateResult)).toEqual('测试')
    validateResult = {
      errors: [
        {
          error_code: 'error',
          message: '测试！'
        }
      ]
    }
    expect(getToteCartError(validateResult)).toEqual('测试！')
  })
  it('弹窗提示', () => {
    validateResult = {
      errors: [
        {
          error_code: 'error_need_payment',
          message: '测试1'
        }
      ]
    }
    expect(getToteCartError(validateResult)).toEqual({
      title: '待支付订单提醒',
      buttonText: '去付款',
      link: '/payment_pending',
      content: '测试1'
    })
    validateResult = {
      errors: [
        {
          error_code: 'error_subscription_inactive',
          message: '测试2'
        }
      ]
    }
    expect(getToteCartError(validateResult)).toEqual({
      title: '会员已过期',
      buttonText: '去续费',
      link: '/plans',
      content: '测试2'
    })
    validateResult = {
      errors: [
        {
          error_code: 'error_scheduled_pickup',
          message: '测试3'
        }
      ]
    }
    expect(getToteCartError(validateResult)).toEqual({
      title: '预约归还提醒',
      buttonText: '去开通',
      link: '/open_free_service',
      content: '测试3'
    })
    validateResult = {
      errors: [
        {
          error_code: 'error_need_recharge_account',
          message: '测试4'
        }
      ]
    }
    expect(getToteCartError(validateResult)).toEqual({
      title: '欠款提醒',
      buttonText: '去处理',
      link: '/credit_account',
      content: '测试4'
    })
    validateResult = {
      errors: [
        {
          error_code: 'error_run_out_of_subscription_totes',
          message: '测试5'
        }
      ]
    }
    expect(getToteCartError(validateResult)).toEqual({
      title: '续费提醒',
      buttonText: '去续费',
      link: '/plans',
      content: '测试5'
    })
  })
})
