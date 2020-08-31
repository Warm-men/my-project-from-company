import React from 'react'
import { shallow } from 'enzyme'
import ToteCommonAbnormalCard from '../tote_common_abnormal_card'
import ImageTouchCard from '../image_touch_card'
import dateFns from 'date-fns'

describe('tote common abnormal card 1', () => {
  const button_red_style = '#FFF'
  const title_small_style = '#242424'
  const title_normal_style = '#333333'

  describe('no totes left', () => {
    let wrapper
    beforeEach(() => {
      const props = {
        error_code: 'errors_tote_left_zero',
        message: '现在续费，剩余会员期可累积使用'
      }
      wrapper = shallow(<ToteCommonAbnormalCard errors={props} />)
    })

    it('should display title', () => {
      expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(
        '已无可用衣箱'
      )
      expect(wrapper.find({ testID: 'title' }).prop('style').color).toEqual(
        title_normal_style
      )
    })

    it('should display message', () => {
      expect(wrapper.find({ testID: 'message' }).prop('children')).toEqual(
        '现在续费，剩余会员期可累积使用'
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

  describe('first tote gift', () => {
    let wrapper
    beforeEach(() => {
      const props = {
        error_code: 'errors_first_tote_gift',
        message: '尺码不全'
      }
      wrapper = shallow(<ToteCommonAbnormalCard errors={props} />)
    })

    it('should display ImageTouchCard', () => {
      expect(wrapper.find(ImageTouchCard)).toHaveLength(1)
    })
  })

  describe('other errors', () => {
    let wrapper
    beforeEach(() => {
      const props = {
        error_code: 'errors_others',
        message: '其他错误'
      }
      wrapper = shallow(<ToteCommonAbnormalCard errors={props} />)
    })

    it('should only display message directly', () => {
      expect(wrapper.find({ testID: 'title' }).prop('style').color).toMatch(
        title_normal_style
      )
      expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual('')
      expect(wrapper.find({ testID: 'click-button' })).toHaveLength(0)
    })
  })

  describe('hold date on today', () => {
    let wrapper
    const today = dateFns.format(new Date(), 'YYYY年MM月DD日HH:mm')
    beforeEach(() => {
      const props = {
        error_code: 'errors_subscription_on_hold',
        message: `将在${today}恢复`
      }
      const subscription = {
        hold_date: new Date()
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
        `将在${today}恢复`
      )
    })
  })

  describe('hold pending', () => {
    let wrapper
    beforeEach(() => {
      const props = {
        error_code: 'errors_subscription_hold_pending',
        message: '在确认所有衣箱已归还后将正式为你暂停'
      }
      wrapper = shallow(<ToteCommonAbnormalCard errors={props} />)
    })

    it('should display title', () => {
      expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(
        '已申请暂停会员期'
      )
      expect(wrapper.find({ testID: 'title' }).prop('style').color).toEqual(
        title_normal_style
      )
    })

    it('should display message', () => {
      expect(wrapper.find({ testID: 'message' }).prop('children')).toEqual(
        '在确认所有衣箱已归还后将正式为你暂停'
      )
    })

    it('should not display click button', () => {
      expect(wrapper.find({ testID: 'click-button' }).length).toBe(0)
    })
  })
})
