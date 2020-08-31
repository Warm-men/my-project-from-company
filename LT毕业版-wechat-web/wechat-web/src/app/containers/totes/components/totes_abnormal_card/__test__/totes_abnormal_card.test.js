import { shallow } from 'src/utilsTests'
import { TotesAbnormalCardContainer } from 'src/app/containers/totes/components/totes_abnormal_card'

import RoleCard from 'src/app/containers/totes/components/totes_abnormal_card/components/role_card'
import Order from 'src/app/containers/totes/components/totes_abnormal_card/components/order'
import ServiceHold from 'src/app/containers/totes/components/totes_abnormal_card/components/service_hold'
import CustomerStatus from 'src/app/containers/totes/components/totes_abnormal_card/components/customer_status'

describe('Test TotesAbnormalCardContainer', () => {
  let wrapper,
    dispatch,
    initToteStateTips = {
      credit_account_validation: { errors: [], success: true },
      transaction_validation: { errors: [], success: true },
      subscription_validation: { errors: [], success: true },
      extra_validation: { errors: [], success: true },
      tote_return_validation: { errors: [], success: true }
    }
  beforeEach(() => {
    dispatch = jest.fn()
    wrapper = shallow(TotesAbnormalCardContainer, {
      dispatch,
      toteStateTips: null,
      customer: { subscription: null }
    })
  })
  it('toteStateTips为空', () => {
    expect(wrapper.find('.totes-abnormal-card-container').length).toBe(0)
  })
  it('toteStateTips不为空', () => {
    wrapper.setProps({ toteStateTips: initToteStateTips })
    expect(wrapper.find('.totes-abnormal-card-container').length).toBe(1)
  })

  it('Tote页面状态： 信用账户有待处理欠款', () => {
    wrapper.setProps({
      toteStateTips: {
        ...initToteStateTips,
        credit_account_validation: {
          errors: [
            {
              error_code: 'errors_need_recharge_account',
              message: '信用账户有待处理欠款'
            }
          ],
          success: false
        }
      }
    })
    expect(wrapper.containsMatchingElement(<Order />)).toBe(true)
  })

  it('Tote页面状态：卷尺卡片', () => {
    wrapper.setProps({
      toteStateTips: {
        ...initToteStateTips,
        extra_validation: {
          errors: [
            {
              error_code: 'errors_first_tote_gift',
              message: ''
            }
          ],
          success: false
        }
      }
    })
    expect(wrapper.containsMatchingElement(<RoleCard />)).toBe(true)
  })

  it('Tote页面状态： 已申请暂停会员期', () => {
    wrapper.setProps({
      toteStateTips: {
        ...initToteStateTips,
        subscription_validation: {
          errors: [
            {
              error_code: 'errors_subscription_hold_pending',
              message: '信用账户有待处理欠款'
            }
          ],
          success: false
        }
      }
    })
    expect(wrapper.containsMatchingElement(<ServiceHold />)).toBe(true)
  })

  it('Tote页面状态： 已无可用衣箱', () => {
    wrapper.setProps({
      toteStateTips: {
        ...initToteStateTips,
        subscription_validation: {
          errors: [
            {
              error_code: 'errors_tote_left_zero',
              message: '已无可用衣箱'
            }
          ],
          success: false
        }
      }
    })
    expect(wrapper.containsMatchingElement(<CustomerStatus />)).toBe(true)
  })
})
