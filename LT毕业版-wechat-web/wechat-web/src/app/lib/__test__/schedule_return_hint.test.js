import { scheduleReturnHint } from '../tote/schedule_return_hint'
import { addDays, format } from 'date-fns'

describe('test scheduleReturnHint fuction return value', () => {
  let params = {}
  beforeEach(() => {
    params.currentTotes = [
      { id: 1, progress_status: { status: 'locked' } },
      { id: 2, progress_status: { status: 'shipped' } }
    ]
    params.tote = { id: 2, delivered_at: new Date() - 172800000 - 100000000 }
    params.customer = {
      freeService: {
        state: 'active'
      },
      subscription: {
        totes_left: 1,
        status: 'active'
      },
      isValidSubscriber: true
    }
    params.hanldeToteReturn = jest.fn()
    params.joinMember = jest.fn()
  })

  it('should return hintContent messaege is 你可收到新衣箱后再预约归还，确定要提前归还吗 when freeService && freeService.state === active && newestTote.id !== tote.id', () => {
    let value = scheduleReturnHint(params)
    expect(value.hintContent.message).toEqual(
      `你可收到新衣箱后再预约归还，确定要提前归还吗`
    )
    expect(value.isShowedHint).toEqual(true)
  })
  it('should return hintContent messaege is 你已开通自在选，可先下单新衣箱并等收到后再预约归还，确定要提前归还吗 when next tote has not locked and totes_left > 0', () => {
    params.currentTotes = [{ id: 2 }]
    let value = scheduleReturnHint(params)
    expect(value.hintContent.message).toEqual(
      `你已开通自在选，可先下单新衣箱并等收到后再预约归还，确定要提前归还吗`
    )
    expect(value.isShowedHint).toEqual(true)
  })
  it('should return hintContent messaege is 现在开通自在选，可先下单新衣箱并等收到后再预约归还 when next tote has not locked and free_service not active and totes_left > 0', () => {
    params.currentTotes = [{ id: 2 }]
    params.customer.freeService.state = 'cancelled'
    params.customer.in_first_month_and_monthly_subscriber = true
    let value = scheduleReturnHint(params)
    expect(value.hintContent.message).toEqual(
      `现在开通自在选，可先下单新衣箱并等收到后再预约归还`
    )
    expect(value.isShowedHint).toEqual(true)
  })
  it('should return hintContent messaege is 你已无剩余衣箱，现在续费可立即增加新衣箱，会员期可累积使用 when next tote has not locked and totes_left === 0, subscription status is active', () => {
    params.currentTotes = [{ id: 2 }]
    params.customer.subscription.status = 'active'
    params.customer.subscription.totes_left = 0
    let value = scheduleReturnHint(params)
    expect(value.hintContent.message).toEqual(
      `你已无剩余衣箱，现在续费可立即增加新衣箱，会员期可累积使用`
    )
    expect(value.isShowedHint).toEqual(true)
  })
  it('should return hintContent messaege is 你已无剩余衣箱，现在续费可立即增加新衣箱，会员期可累积使用 when next tote has not locked and totes_left === 0, freeService state is not active and lestSubscriptionDate > 0', () => {
    params.currentTotes = [{ id: 2 }]
    params.customer.freeService.state = 'cancelled'
    params.customer.subscription.totes_left = 0
    params.customer.isValidSubscriber = false
    let value = scheduleReturnHint(params)
    expect(value.hintContent.message).toEqual(
      `你已无剩余衣箱，现在续费可立即增加新衣箱，会员期可累积使用`
    )
    expect(value.isShowedHint).toEqual(true)
  })
  it('should return hintContent messaege is 你已无剩余衣箱，现在续费可立即增加新衣箱，会员期可累积使用 when next tote has not locked and totes_left === 0, freeService state is active and lestSubscriptionDate === 0', () => {
    params.currentTotes = [{ id: 2 }]
    params.customer.freeService.state = 'cancelled'
    params.customer.subscription.totes_left = 0
    let value = scheduleReturnHint(params)
    expect(value.hintContent.message).toEqual(
      `你已无剩余衣箱，现在续费可立即增加新衣箱，会员期可累积使用`
    )
    expect(value.isShowedHint).toEqual(true)
  })
  it('should return isShowedHint is false when next tote has locked and progress_status is delivered , totes_left === 1, freeService state is active ', () => {
    params.currentTotes[0].progress_status.status = 'delivered'
    let value = scheduleReturnHint(params)
    expect(value.hintContent).toEqual(undefined)
    expect(value.isShowedHint).toEqual(false)
  })
})
