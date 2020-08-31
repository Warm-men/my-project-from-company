import React from 'react'
import { shallow } from 'enzyme'
import ToteBuyClothesDetailsContainer from '../tote_buy_clothes_details'

describe('tote buy clothes details', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <ToteBuyClothesDetailsContainer
        navigation={{
          state: {
            params: {
              order: {
                id: 1
              },
              orders: [],
              nonReturnedlist: []
            }
          }
        }}
      />
    )
    const next_state = {
      summary: { discount: null, purchase_credit: null, total_amount: null },
      payment: null
    }
    wrapper.setState(next_state)
  })

  describe('test function returnGateway', () => {
    it('returnGateway should return null', () => {
      const next_state = {
        summary: { discount: null, purchase_credit: null, total_amount: null },
        payment: null
      }
      wrapper.setState(next_state)
      const result = wrapper.instance().returnGateway()
      expect(result.name).toEqual(null)
    })
    it('returnGateway should return alipay pay', () => {
      const next_state = {
        summary: { discount: null, purchase_credit: null, total_amount: 100 },
        payment: { gateway: 'alipay' }
      }
      wrapper.setState(next_state)
      const result = wrapper.instance().returnGateway()
      expect(result.name).toEqual('支付宝支付')
    })
    it('returnGateway should return wechat pay', () => {
      const next_state = {
        summary: { discount: null, purchase_credit: null, total_amount: 100 },
        payment: { gateway: 'wechat' }
      }
      wrapper.setState(next_state)
      const result = wrapper.instance().returnGateway()
      expect(result.name).toEqual('微信支付')
    })
    it('returnGateway should return jd_pay pay', () => {
      const next_state = {
        summary: { discount: null, purchase_credit: null, total_amount: 2000 },
        payment: { gateway: 'jd_pay' }
      }
      wrapper.setState(next_state)
      const result = wrapper.instance().returnGateway()
      expect(result.name).toEqual('京东支付')
    })
    it('returnGateway should return null', () => {
      const next_state = {
        summary: { discount: null, purchase_credit: null, total_amount: 2001 },
        payment: { gateway: 'jd_pay' }
      }
      wrapper.setState(next_state)
      const result = wrapper.instance().returnGateway()
      expect(result.name).toEqual(null)
    })
  })
})
