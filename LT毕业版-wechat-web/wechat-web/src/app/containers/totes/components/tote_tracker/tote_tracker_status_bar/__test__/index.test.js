import { mount } from 'src/utilsTests'
import ToteTrackerStatusBar from 'src/app/containers/totes/components/tote_tracker/tote_tracker_status_bar'

describe('Test ToteTrackerStatusBar', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(ToteTrackerStatusBar, {
      tote: {
        progress_status: {
          status: '',
          locked_at: '',
          shipped_at: '',
          delivered_at: '',
          schedule_returned_at: ''
        }
      }
    })
  })
  it('Test Tote Null', () => {
    wrapper.setProps({ tote: null })
    expect(wrapper.find('.tote-tracker-bar-container').length).toEqual(0)
  })
  it('Test Tote Locked', () => {
    wrapper.setProps({
      tote: {
        progress_status: {
          status: 'locked',
          locked_at: 'Sat, 16 Feb 2019 15:36:51 +0800',
          shipped_at: '',
          delivered_at: '',
          schedule_returned_at: ''
        }
      }
    })
    expect(
      wrapper
        .find('.date')
        .at(0)
        .text()
    ).toEqual('02月16日')
    expect(
      wrapper
        .find('.step-box')
        .at(0)
        .hasClass('active')
    ).toEqual(true)
    expect(wrapper.find('.date').at(1)).toHaveLength(0)
    expect(
      wrapper
        .find('.step-box')
        .at(1)
        .hasClass('active')
    ).toEqual(false)
  })
  it('Test Tote Shipped', () => {
    wrapper.setProps({
      tote: {
        progress_status: {
          status: 'shipped',
          locked_at: 'Sat, 15 Feb 2019 15:36:51 +0800',
          shipped_at: 'Sat, 16 Feb 2019 15:36:51 +0800',
          delivered_at: '',
          schedule_returned_at: ''
        }
      }
    })
    expect(
      wrapper
        .find('.date')
        .at(0)
        .text()
    ).toEqual('02月15日')
    expect(
      wrapper
        .find('.step-box')
        .at(0)
        .hasClass('active')
    ).toEqual(true)
    expect(
      wrapper
        .find('.date')
        .at(1)
        .text()
    ).toEqual('02月16日')
    expect(
      wrapper
        .find('.step-box')
        .at(1)
        .hasClass('active')
    ).toEqual(true)
    expect(wrapper.find('.date').at(2)).toHaveLength(0)
    expect(
      wrapper
        .find('.step-box')
        .at(2)
        .hasClass('active')
    ).toEqual(false)
  })
  it('Test Tote Delivered', () => {
    wrapper.setProps({
      tote: {
        progress_status: {
          status: 'delivered',
          locked_at: 'Sat, 14 Feb 2019 15:36:51 +0800',
          shipped_at: 'Sat, 15 Feb 2019 15:36:51 +080',
          delivered_at: 'Sat, 16 Feb 2019 15:36:51 +080',
          schedule_returned_at: ''
        }
      }
    })
    expect(
      wrapper
        .find('.date')
        .at(0)
        .text()
    ).toEqual('02月14日')
    expect(
      wrapper
        .find('.step-box')
        .at(0)
        .hasClass('active')
    ).toEqual(true)
    expect(
      wrapper
        .find('.date')
        .at(1)
        .text()
    ).toEqual('02月15日')
    expect(
      wrapper
        .find('.step-box')
        .at(1)
        .hasClass('active')
    ).toEqual(true)
    expect(
      wrapper
        .find('.date')
        .at(2)
        .text()
    ).toEqual('02月16日')
    expect(
      wrapper
        .find('.step-box')
        .at(1)
        .hasClass('active')
    ).toEqual(true)
    expect(wrapper.find('.date').at(3)).toHaveLength(0)
    expect(
      wrapper
        .find('.step-box')
        .at(3)
        .hasClass('active')
    ).toEqual(false)
  })
  it('Test Tote ScheduleReturned', () => {
    wrapper.setProps({
      tote: {
        progress_status: {
          status: 'scheduled_return',
          locked_at: 'Sat, 14 Feb 2019 15:36:51 +0800',
          shipped_at: 'Sat, 15 Feb 2019 15:36:51 +080',
          delivered_at: 'Sat, 16 Feb 2019 15:36:51 +080',
          schedule_returned_at: 'Sat, 17 Feb 2019 15:36:51 +080'
        }
      }
    })
    expect(
      wrapper
        .find('.date')
        .at(0)
        .text()
    ).toEqual('02月14日')
    expect(
      wrapper
        .find('.step-box')
        .at(0)
        .hasClass('active')
    ).toEqual(true)
    expect(
      wrapper
        .find('.date')
        .at(1)
        .text()
    ).toEqual('02月15日')
    expect(
      wrapper
        .find('.step-box')
        .at(1)
        .hasClass('active')
    ).toEqual(true)
    expect(
      wrapper
        .find('.date')
        .at(2)
        .text()
    ).toEqual('02月16日')
    expect(
      wrapper
        .find('.step-box')
        .at(1)
        .hasClass('active')
    ).toEqual(true)
    expect(
      wrapper
        .find('.date')
        .at(3)
        .text()
    ).toEqual('02月17日')
    expect(
      wrapper
        .find('.step-box')
        .at(3)
        .hasClass('active')
    ).toEqual(true)
  })
})
