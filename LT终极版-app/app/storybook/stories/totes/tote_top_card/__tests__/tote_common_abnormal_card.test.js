import React from 'react'
import { shallow } from 'enzyme'
import ToteCommonAbnormalCard from '../tote_common_abnormal_card'
import CreditAccountBar from '../credit_account_bar'
import dateFns from 'date-fns'

describe('tote common abnormal card', () => {
  const button_white_style = '#242424'
  const button_red_style = '#FFF'
  const title_normal_style = '#333333'
  describe('needs payment', () => {
    let wrapper
    beforeEach(() => {
      const props = {
        error_code: 'errors_need_payment',
        message: '你有待支付订单，请尽快处理'
      }

      wrapper = shallow(
        <CreditAccountBar message={props.message} buttonText={'去付款'} />
      )
    })

    it('should display title', () => {
      expect(
        wrapper.find({ testID: 'credit-account-bar-message' }).prop('children')
      ).toEqual('你有待支付订单，请尽快处理')
    })

    it('should display click button', () => {
      expect(
        wrapper
          .find({ testID: 'credit-account-bar-button-text' })
          .prop('children')
      ).toEqual('去付款')
    })
  })

  describe('expired subscriber', () => {
    let wrapper
    beforeEach(() => {
      const props = {
        error_code: 'errors_subscription_disabled',
        message: '我们准备了很多新衣服，等你回来哦'
      }
      wrapper = shallow(<ToteCommonAbnormalCard errors={props} />)
    })

    it('should display title with normal style', () => {
      expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(
        '会员已过期'
      )
      expect(wrapper.find({ testID: 'title' }).prop('style').color).toMatch(
        title_normal_style
      )
    })

    it('should display message', () => {
      expect(wrapper.find({ testID: 'message' }).prop('children')).toEqual(
        '我们准备了很多新衣服，等你回来哦'
      )
    })

    it('should display click button', () => {
      expect(wrapper.find({ testID: 'click-button' }).prop('children')).toEqual(
        '立即续费'
      )
      expect(
        wrapper.find({ testID: 'click-button' }).prop('style').color
      ).toEqual(button_red_style)
    })
  })

  describe('on hold', () => {
    let wrapper
    beforeEach(() => {
      const props = {
        error_code: 'errors_subscription_on_hold',
        message: '将在2111年10月10日08:00恢复'
      }
      const subscription = {
        hold_date: dateFns.format(dateFns.addDays(new Date(), 30))
      }
      wrapper = shallow(
        <ToteCommonAbnormalCard errors={props} subscription={subscription} />
      )
    })

    it('should display title', () => {
      expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(
        '会员期暂停中'
      )
      expect(wrapper.find({ testID: 'title' }).prop('style').color).toEqual(
        title_normal_style
      )
    })

    it('should display message', () => {
      expect(wrapper.find({ testID: 'message' }).prop('children')).toEqual(
        '将在2111年10月10日08:00恢复'
      )
    })

    it('should display click button', () => {
      expect(wrapper.find({ testID: 'click-button' }).prop('children')).toEqual(
        '提前恢复'
      )
      expect(
        wrapper.find({ testID: 'click-button' }).prop('style').color
      ).toEqual(button_white_style)
    })

    it('should not display click button if reactive in next day', () => {
      const hold_date = dateFns.format(
        dateFns.addDays(new Date(), 1),
        'YYYY年MM月DD日'
      )
      const next_props = {
        error_code: 'errors_subscription_on_hold',
        message: '将在' + hold_date + '08:00恢复'
      }

      wrapper.setProps({
        errors: next_props,
        subscription: {
          hold_date: new Date()
        }
      })

      expect(wrapper.find({ testID: 'click-button' })).toHaveLength(0)
    })
  })

  describe('hold date on tommorrow', () => {
    let wrapper
    const tommorrow = dateFns.format(
      dateFns.addDays(new Date()),
      'YYYY年MM月DD日HH:mm'
    )
    beforeEach(() => {
      const props = {
        error_code: 'errors_subscription_on_hold',
        message: `将在${tommorrow}恢复`
      }
      const subscription = {
        hold_date: dateFns.addDays(new Date())
      }
      wrapper = shallow(
        <ToteCommonAbnormalCard errors={props} subscription={subscription} />
      )
    })

    it('should not display click button', () => {
      expect(wrapper.find({ testID: 'click-button' }).length).toBe(0)
    })

    it('should display message', () => {
      expect(wrapper.find({ testID: 'message' }).prop('children')).toEqual(
        `将在${tommorrow}恢复`
      )
    })
  })

  describe('renew subscription', () => {
    let wrapper
    const tommorrow = dateFns.format(
      dateFns.addDays(new Date()),
      'YYYY年MM月DD日HH:mm'
    )
    beforeEach(() => {
      const props = {
        error_code: 'error_subscription_requesting_resume',
        message: `你已申请提前恢复会员期，将在${tommorrow}恢复`
      }
      const subscription = {
        hold_date: dateFns.addDays(new Date())
      }
      wrapper = shallow(
        <ToteCommonAbnormalCard errors={props} subscription={subscription} />
      )
    })

    it('should not display click button', () => {
      expect(wrapper.find({ testID: 'click-button' }).length).toBe(0)
    })

    it('should display message', () => {
      expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(
        '已申请恢复会员期'
      )
      expect(wrapper.find({ testID: 'message' }).prop('children')).toEqual(
        `你已申请提前恢复会员期，将在${tommorrow}恢复`
      )
    })
  })
})
