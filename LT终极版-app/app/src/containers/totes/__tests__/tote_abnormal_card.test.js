import React from 'react'
import ToteAbnormalCard from '../tote_abnormal_card'
import { shallow } from 'enzyme'
import { CreditAccountBar } from '../../../../storybook/stories/totes/tote_top_card'

describe('tote abnormal card', () => {
  let wrapper
  let next_state

  beforeEach(() => {
    wrapper = shallow(
      <ToteAbnormalCard.wrappedComponent currentCustomerStore={{}} />
    )

    next_state = {
      toteStateTips: {
        credit_account_validation: {
          errors: [],
          success: true
        },
        transaction_validation: {
          success: true,
          errors: []
        },
        subscription_validation: {
          success: true,
          errors: []
        },
        extra_validation: {
          success: true,
          errors: []
        },
        tote_return_validation: {
          success: true,
          errors: []
        }
      }
    }
  })

  it('should be null at the begginning', () => {
    expect(wrapper.html()).toBe(null)
  })

  it('render correctly when no validation', () => {
    wrapper.setState(next_state)
    expect(wrapper.html()).toEqual('<View style="flex:1"></View>')
  })

  describe('credit account bar in tote abnormal card', () => {
    it('should show credit account bar when there is a account alert', () => {
      next_state.toteStateTips.credit_account_validation = {
        errors: [
          {
            error_code: 'errors_need_recharge_account',
            message: '信用账户有待处理欠款'
          }
        ],
        success: false
      }
      wrapper.setState(next_state)
      expect(wrapper.find(CreditAccountBar)).toHaveLength(1)
    })

    it('should not show credit account bar when there is no account alert', () => {
      wrapper.setState(next_state)
      expect(wrapper.find(CreditAccountBar)).toHaveLength(0)
    })
  })

  describe('transaction validation card', () => {
    it('should show transaction card if it is', () => {
      next_state.toteStateTips.transaction_validation = {
        errors: [
          {
            error_code: 'errors_need_payment',
            message: '待付款'
          }
        ],
        success: false
      }
      wrapper.setState(next_state)
      expect(
        wrapper.find({ testID: 'tansaction-validation-card' })
      ).toHaveLength(1)
    })

    it('should not show transaction card if it is not', () => {
      wrapper.setState(next_state)
      expect(
        wrapper.find({ testID: 'tansaction-validation-card' })
      ).toHaveLength(0)
    })
  })

  describe('subscription validation card', () => {
    it('should show subscription card if it is', () => {
      next_state.toteStateTips.subscription_validation = {
        errors: [
          {
            error_code: 'errors_need_payment',
            message: '待付款'
          }
        ],
        success: false
      }

      wrapper.setState(next_state)
      expect(
        wrapper.find({ testID: 'subscription-validation-card' })
      ).toHaveLength(1)
    })

    it('should not show subscription card if it is not', () => {
      wrapper.setState(next_state)
      expect(
        wrapper.find({ testID: 'subscription-validation-card' })
      ).toHaveLength(0)
    })
  })

  describe('extra card', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<ToteAbnormalCard.wrappedComponent totesStore={{}} />)
    })

    it('should show extra card if it is', () => {
      next_state.toteStateTips.extra_validation = {
        errors: [
          {
            error_code: 'errors_need_payment',
            message: '待付款'
          }
        ],
        success: false
      }

      wrapper.setState(next_state)
      expect(wrapper.find({ testID: 'extra-validation-card' })).toHaveLength(1)
    })

    it('should not show extra card if it is not', () => {
      wrapper.setState(next_state)
      expect(wrapper.find({ testID: 'extra-validation-card' })).toHaveLength(0)
    })
  })
})
