import React from 'react'
import { shallow } from 'enzyme'
import ToteStatusBarTracker from '../tote_current_status_tracker'
import dateFns from 'date-fns'

describe('tote status bar tracker', () => {
  let wrapper
  let nextProgressStatus
  const next_locked_at = new Date()
  beforeAll(() => {
    nextProgressStatus = {
      delivered_at: null,
      description: '已下单',
      locked_at: next_locked_at,
      schedule_returned_at: null,
      shipped_at: null,
      status: 'locked',
      title: '正在等待发货'
    }
    wrapper = shallow(
      <ToteStatusBarTracker
        progressStatus={nextProgressStatus}
        toteStatus={'scheduled_return'}
      />
    )
  })

  it('should always show four items with header', () => {
    const headerNodes = wrapper.find({ testID: 'header' })
    expect(headerNodes).toHaveLength(4)
    expect(headerNodes.get(0).props.children).toEqual('已下单')
    expect(headerNodes.get(1).props.children).toEqual('已发货')
    expect(headerNodes.get(2).props.children).toEqual('已签收')
    expect(headerNodes.get(3).props.children).toEqual('还衣箱')
  })

  describe('trakcer bar when locked', () => {
    it('should only show locked at', () => {
      const captionDate = dateFns.format(next_locked_at, 'MM月DD日')
      const dateNodes = wrapper.find({ testID: 'caption-date' })
      expect(dateNodes.get(0).props.children).toEqual(captionDate)
      expect(dateNodes.get(1).props.children).toEqual(null)
      expect(dateNodes.get(2).props.children).toEqual(null)
      expect(dateNodes.get(3).props.children).toEqual(null)
    })

    it('should show 17 progress when locked', () => {
      const { progress } = wrapper.instance()._checkProgress()
      expect(progress).toEqual('12.5%')
    })
  })

  describe('tracker bar when shipped', () => {
    beforeAll(() => {
      nextProgressStatus = {
        delivered_at: null,
        description: '已下单',
        locked_at: next_locked_at,
        schedule_returned_at: null,
        shipped_at: next_locked_at,
        status: 'shipped',
        title: '衣箱正在路上'
      }
      wrapper.setProps({
        progressStatus: nextProgressStatus
      })
    })
    it('should show locked_at, shipped_at when shipped', () => {
      const lockDate = dateFns.format(next_locked_at, 'MM月DD日')
      const shipDate = dateFns.format(next_locked_at, 'MM月DD日')

      const dateNodes = wrapper.find({ testID: 'caption-date' })
      expect(dateNodes.get(0).props.children).toEqual(lockDate)
      expect(dateNodes.get(1).props.children).toEqual(shipDate)
      expect(dateNodes.get(2).props.children).toEqual(null)
      expect(dateNodes.get(3).props.children).toEqual(null)
    })

    it('should show 39 progress when shipped', () => {
      const { progress } = wrapper.instance()._checkProgress()
      expect(progress).toEqual('37.5%')
    })
  })

  describe('tracker bar when delivered', () => {
    beforeAll(() => {
      nextProgressStatus = {
        delivered_at: next_locked_at,
        description: '已签收',
        locked_at: next_locked_at,
        schedule_returned_at: null,
        shipped_at: next_locked_at,
        status: 'delivered',
        title: '已签收'
      }
      wrapper.setProps({
        progressStatus: nextProgressStatus
      })
    })

    it('should show locked_at, shipped_at, delivered_at when delivered', () => {
      const lockDate = dateFns.format(next_locked_at, 'MM月DD日')
      const shipDate = dateFns.format(next_locked_at, 'MM月DD日')
      const delivererDate = dateFns.format(next_locked_at, 'MM月DD日')

      const dateNodes = wrapper.find({ testID: 'caption-date' })
      expect(dateNodes.get(0).props.children).toEqual(lockDate)
      expect(dateNodes.get(1).props.children).toEqual(shipDate)
      expect(dateNodes.get(2).props.children).toEqual(delivererDate)
      expect(dateNodes.get(3).props.children).toEqual(null)
    })

    it('should show 61.5 progress when shipped', () => {
      const { progress } = wrapper.instance()._checkProgress()
      expect(progress).toEqual('62.5%')
    })
  })

  describe('tracker bar when schedule return', () => {
    beforeAll(() => {
      nextProgressStatus = {
        delivered_at: next_locked_at,
        description: '还衣箱',
        locked_at: next_locked_at,
        schedule_returned_at: next_locked_at,
        shipped_at: next_locked_at,
        status: 'scheduled_return',
        title: '还衣箱'
      }
      wrapper.setProps({
        progressStatus: nextProgressStatus
      })
    })

    it('should show all date when schedule return', () => {
      const lockDate = dateFns.format(next_locked_at, 'MM月DD日')
      const shipDate = dateFns.format(next_locked_at, 'MM月DD日')
      const delivererDate = dateFns.format(next_locked_at, 'MM月DD日')

      const dateNodes = wrapper.find({ testID: 'caption-date' })
      expect(dateNodes.get(0).props.children).toEqual(lockDate)
      expect(dateNodes.get(1).props.children).toEqual(shipDate)
      expect(dateNodes.get(2).props.children).toEqual(delivererDate)
      expect(dateNodes.get(3).props.children).toEqual(delivererDate)
    })

    it('should show 84.5 progress when shipped', () => {
      const { progress } = wrapper.instance()._checkProgress()
      expect(progress).toEqual('87.5%')
    })
  })
})
