import { paymentMethodId } from 'src/app/lib/payment_method_id.js'

describe('Test paymentMethodId func', () => {
  let platform,
    payment_methods = [
      {
        id: 623,
        payment_gateway: 'wechat'
      },
      {
        id: 624,
        payment_gateway: 'wechat_mini_app'
      },
      {
        id: 635,
        payment_gateway: 'wechat_native'
      }
    ]
  it('Test MiniApp paymentMethodId', () => {
    platform = 'mini_app'
    expect(paymentMethodId(platform, payment_methods)).toEqual(-6)
    expect(paymentMethodId(platform)).toEqual(-6)
  })
  it('Test wechat paymentMethodId', () => {
    platform = 'wechat'
    expect(paymentMethodId(platform, payment_methods)).toEqual(623)
    expect(paymentMethodId(platform)).toEqual(false)
  })
  it('Test jd paymentMethodId', () => {
    platform = 'jd'
    expect(paymentMethodId(platform, payment_methods)).toEqual(-5)
    expect(paymentMethodId(platform)).toEqual(-5)
  })
  it('Test empty data paymentMethodId', () => {
    platform = null
    expect(paymentMethodId(platform, payment_methods)).toEqual(-2)
    payment_methods = payment_methods = []
    expect(paymentMethodId(platform, payment_methods)).toEqual(-2)
    expect(paymentMethodId(platform)).toEqual(-2)
    expect(paymentMethodId()).toEqual(-2)
  })
})
