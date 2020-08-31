import {
  getToteCartError,
  isNotShowErrorText
} from 'src/app/containers/totes/new_totes/utils/shopping_car_error.js'
describe('test static getDerivedStateFromProps from new_totes', () => {
  const getDerivedStateFromProps = jest.fn((nextProps, preState) => {
    const { tote_cart } = nextProps
    if (
      !_.isEmpty(tote_cart) &&
      !_.isEmpty(tote_cart.validate_result) &&
      !_.isEmpty(tote_cart.validate_result.errors)
    ) {
      const { validate_result } = tote_cart
      const errorObj = getToteCartError(validate_result)
      const error_code = validate_result.errors[0].error_code
      if (_.isString(errorObj)) {
        // NOTE：用户身份验证不需要在购物车提示
        if (error_code === 'error_scheduled_pickup_without_free_service') {
          return {
            alertTitle: '预约归还提醒',
            alertCode: error_code,
            alertContent: errorObj
          }
        }
        return {
          isShowErrorText: !_.includes(isNotShowErrorText, error_code),
          errorText: errorObj,
          error_code
        }
      } else {
        return { hintObj: errorObj, error_code }
      }
    }
    return null
  })
  it('error_code is error_scheduled_pickup_without_free_service', () => {
    const nextProps = {
      tote_cart: {
        validate_result: {
          errors: [
            {
              error_code: 'error_scheduled_pickup_without_free_service',
              message: ''
            }
          ]
        }
      }
    }
    const message = getDerivedStateFromProps(nextProps)
    expect(message.alertTitle).toEqual('预约归还提醒')
  })
  it('error_code is error_already_has_a_new_tote', () => {
    const nextProps = {
      tote_cart: {
        validate_result: {
          errors: [
            {
              error_code: 'error_already_has_a_new_tote',
              message: '已有衣箱在途中，暂不能下单'
            }
          ]
        }
      }
    }
    const message = getDerivedStateFromProps(nextProps)
    expect(message.errorText).toEqual('已有衣箱在途中，暂不能下单')
    expect(message.isShowErrorText).toEqual(false)
  })
  it('error_code is error_need_payment', () => {
    const nextProps = {
      tote_cart: {
        validate_result: {
          errors: [
            {
              error_code: 'error_need_payment',
              message: ''
            }
          ]
        }
      }
    }
    const message = getDerivedStateFromProps(nextProps)
    expect(message.hintObj.title).toEqual('待支付订单提醒')
  })
})
