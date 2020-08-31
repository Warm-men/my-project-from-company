import React from 'react'
import { shallow } from 'enzyme'
import ToteStatusBar from '../tote_status_bar'
import StatusBarButtons from '../tote_status_bar_buttons'
import StatusBarTracker from '../tote_current_status_tracker'

describe('tote status bar', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <ToteStatusBar
        progressStatus={{}}
        pushToMyCustomerPhotos={{}}
        isRated={true}
        markToteDelivered={true}
        tote={{
          id: 255393,
          tote_products: [],
          progress_status: {
            status: '',
            hide_delivered_btn: true
          }
        }}
      />
    )
  })

  describe('status of tote status bar', () => {
    const next_locked_at = new Date()
    let nextTote
    beforeEach(() => {
      nextTote = {
        id: 1,
        tote_products: [],
        progress_status: {
          delivered_at: null,
          description: '已下单',
          locked_at: next_locked_at,
          scheduled_return_at: null,
          shipped_at: null,
          status: null,
          title: '正在等待发货'
        }
      }
    })

    it('should show title when locked', () => {
      wrapper.setProps({
        tote: nextTote
      })
      expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(
        '正在等待发货'
      )
      expect(wrapper.find(StatusBarButtons)).toHaveLength(1)
    })

    it('should show StatusBarTracker when isShowTracker ie true', () => {
      wrapper.setState({
        isShowTracker: true
      })
      expect(wrapper.find(StatusBarTracker)).toHaveLength(1)
    })

    it('should show StatusBarTracker when isShowTracker ie false', () => {
      wrapper.setState({
        isShowTracker: false
      })
      expect(wrapper.find(StatusBarTracker)).toHaveLength(0)
    })

    it('should show title when shipped', () => {
      nextTote.progress_status.title = '衣箱正在路上'
      wrapper.setProps({
        tote: nextTote
      })
      expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(
        '衣箱正在路上'
      )
      expect(wrapper.find(StatusBarButtons)).toHaveLength(1)
    })

    it('should show title when delivered', () => {
      nextTote.progress_status.title = '已签收'
      wrapper.setProps({
        tote: nextTote
      })
      expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(
        '已签收'
      )
      expect(wrapper.find(StatusBarButtons)).toHaveLength(1)
    })

    it('should show title when delivered', () => {
      nextTote.progress_status.title = '已预约归还'
      wrapper.setProps({
        tote: nextTote
      })
      expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(
        '已预约归还'
      )
      expect(wrapper.find(StatusBarButtons)).toHaveLength(1)
    })
  })
})
