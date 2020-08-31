import React from 'react'
import { shallow } from 'enzyme'
import ReminderAfterToteSwapPoll from '../tote_lock/tote_lock_success'
import dateFns from 'date-fns'
describe('tote_lock_success', () => {
  let billing_date = dateFns.addDays(new Date(), 8)
  let currentCustomerStore = {
    referralBanner: {
      referral_entry_banner_height: 230,
      referral_entry_banner_width: 670,
      referred_program_entry_banner_url:
        'https://qimg-staging.letote.cn/uploads/referral_program_image/1/%E6%B5%8B%E8%AF%9511.png'
    },
    enablePaymentContract: [],
    subscription: {
      billing_date,
      totes_left: 1
    }
  }
  beforeEach(() => {
    wrapper = shallow(
      <ReminderAfterToteSwapPoll currentCustomerStore={currentCustomerStore} />
    ).dive()
  })

  it('未开通免密，剩余衣箱数等于1，剩余会员期大于等于 8 天、小于15天', () => {
    expect(wrapper.find({ testID: 'referralBanner' }).length).toBe(0)
    expect(wrapper.find({ testID: 'renewMessage1' }).length).toBe(1)
  })

  it('未开通免密，剩余衣箱数大于1，剩余会员期小于15天', () => {
    currentCustomerStore.subscription.totes_left = 2
    currentCustomerStore.subscription
    wrapper = shallow(
      <ReminderAfterToteSwapPoll currentCustomerStore={currentCustomerStore} />
    ).dive()
    expect(wrapper.find({ testID: 'renewMessage1' }).length).toBe(1)
    expect(wrapper.find({ testID: 'referralBanner' }).length).toBe(0)
  })

  it('未开通免密，剩余衣箱数等于1，剩余会员期小于8', () => {
    currentCustomerStore.subscription.totes_left = 1
    currentCustomerStore.subscription.billing_date = dateFns.addDays(
      new Date(),
      7
    )
    wrapper = shallow(
      <ReminderAfterToteSwapPoll currentCustomerStore={currentCustomerStore} />
    ).dive()
    expect(wrapper.find({ testID: 'renewMessage1' }).length).toBe(1)
    expect(wrapper.find({ testID: 'referralBanner' }).length).toBe(0)
  })

  it('未开通免密，剩余衣箱数等于0，剩余会员期小于8', () => {
    currentCustomerStore.subscription.totes_left = 0
    currentCustomerStore.subscription.billing_date = dateFns.addDays(
      new Date(),
      7
    )
    wrapper = shallow(
      <ReminderAfterToteSwapPoll currentCustomerStore={currentCustomerStore} />
    ).dive()
    expect(wrapper.find({ testID: 'renewMessage3' }).length).toBe(1)
  })

  it('未开通免密，剩余衣箱数等于0，剩余会员期为0', () => {
    currentCustomerStore.subscription.totes_left = 0
    currentCustomerStore.subscription.billing_date = new Date()
    wrapper = shallow(
      <ReminderAfterToteSwapPoll currentCustomerStore={currentCustomerStore} />
    ).dive()
    expect(wrapper.find({ testID: 'renewMessage2' }).length).toBe(1)
  })

  it('未开通免密，剩余衣箱数等于0，剩余会员期大于8，小于15', () => {
    currentCustomerStore.subscription.totes_left = 0
    currentCustomerStore.subscription.billing_date = dateFns.addDays(
      new Date(),
      10
    )
    wrapper = shallow(
      <ReminderAfterToteSwapPoll currentCustomerStore={currentCustomerStore} />
    ).dive()
    expect(wrapper.find({ testID: 'renewMessage4' }).length).toBe(1)
  })

  it('显示referralBanner', () => {
    currentCustomerStore.enablePaymentContract = [1]

    wrapper = shallow(
      <ReminderAfterToteSwapPoll currentCustomerStore={currentCustomerStore} />
    ).dive()
    expect(wrapper.find({ testID: 'renewMessage' }).length).toBe(0)
    expect(wrapper.find({ testID: 'referralBanner' }).length).toBe(1)
  })

  it('totes_left为null,显示referralBanner', () => {
    currentCustomerStore.subscription.totes_left = null

    wrapper = shallow(
      <ReminderAfterToteSwapPoll currentCustomerStore={currentCustomerStore} />
    ).dive()
    expect(wrapper.find({ testID: 'renewMessage1' }).length).toBe(0)
    expect(wrapper.find({ testID: 'renewMessage2' }).length).toBe(0)
    expect(wrapper.find({ testID: 'renewMessage3' }).length).toBe(0)
    expect(wrapper.find({ testID: 'renewMessage4' }).length).toBe(0)
    expect(wrapper.find({ testID: 'referralBanner' }).length).toBe(1)
  })
})
