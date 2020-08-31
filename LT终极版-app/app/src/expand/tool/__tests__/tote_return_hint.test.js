import { toteReturnHint } from '../tote/tote_return_hint'

describe('test toteReturnHint fuction return value', () => {
  let params = {},
    isReturnHint
  beforeEach(() => {
    params.currentTotes = [
      { id: 1, progress_status: { status: 'locked' } },
      { id: 2, progress_status: { status: 'delivered' } }
    ]
    params.tote = { id: 2 }
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
    isReturnHint = true
  })

  it('should return hint messaege is 你已开通自在选，可收到新衣箱后再预约归还，确定要提前归还吗 when freeService && freeService.state === active && newestTote.id !== tote.id', () => {
    let value = toteReturnHint(params, isReturnHint)
    expect(value.hint.message).toEqual(
      `你可收到新衣箱后再预约归还，\n确定要提前归还吗`
    )
    expect(value.isShowedHint).toEqual(true)
  })
  it('should return hint messaege is 你已开通自在选，可先下单新衣箱并等收到后再预约归还，确定要提前归还吗 when next tote has not locked and totes_left > 0', () => {
    params.currentTotes = [{ id: 2, progress_status: { status: 'locked' } }]
    let value = toteReturnHint(params, isReturnHint)
    expect(value.hint.message).toEqual(
      `你已开通自在选，可先下单新衣箱并\n等收到后再预约归还，确定要提前归还吗`
    )
    expect(value.isShowedHint).toEqual(true)
  })
  it('should return hint messaege is 你已无可用衣箱，现在续费可立即增加新衣箱，会员期可累计使用 when next tote has not locked and totes_left === 0, subscription status is active', () => {
    params.currentTotes = [{ id: 2, progress_status: { status: 'locked' } }]
    params.customer.subscription.status = 'active'
    params.customer.subscription.totes_left = 0
    let value = toteReturnHint(params, isReturnHint)
    expect(value.hint.message).toEqual(
      `你已无剩余衣箱，现在续费可立即\n增加新衣箱，会员期可累积使用`
    )
    expect(value.isShowedHint).toEqual(true)
  })
  it('should return hint messaege is 你已无可用衣箱，现在续费可立即增加新衣箱，会员期可累计使用 when next tote has not locked and totes_left === 0, freeService state is not active and lestSubscriptionDate > 0', () => {
    params.currentTotes = [{ id: 2, progress_status: { status: 'locked' } }]
    params.customer.freeService.state = 'cancelled'
    params.customer.subscription.totes_left = 0
    let value = toteReturnHint(params, isReturnHint)
    expect(value.hint.message).toEqual(
      `你已无剩余衣箱，现在续费可立即\n增加新衣箱，会员期可累积使用`
    )
    expect(value.isShowedHint).toEqual(true)
  })
  it('should return hint messaege is 你的会员期已过期，现在续费可继续使用手上衣箱 when next tote has not locked and totes_left === 0, freeService state is active and lestSubscriptionDate === 0', () => {
    params.currentTotes = [{ id: 2, progress_status: { status: 'locked' } }]
    params.customer.freeService.state = 'cancelled'
    params.customer.subscription.totes_left = 0
    params.customer.isValidSubscriber = false
    let value = toteReturnHint(params, isReturnHint)
    expect(value.hint.message).toEqual(
      `你已无剩余衣箱，现在续费可立即\n增加新衣箱，会员期可累积使用`
    )
    expect(value.isShowedHint).toEqual(true)
  })
  it('should return isShowedHint is false when next tote has locked and progress_status is delivered , totes_left === 1, freeService state is active ', () => {
    params.currentTotes[0].progress_status.status = 'delivered'
    let value = toteReturnHint(params, isReturnHint)
    expect(value.hint).toEqual(undefined)
    expect(value.isShowedHint).toEqual(false)
  })
  it('should return isShowedHint message 现在开通自在选，可先下单新衣箱并等收到后再预约归还 when totes_left > 0 and freeService state is cancelled ', () => {
    params.customer.freeService.state = 'cancelled'
    params.customer.inFirstMonthAndMonthlySubscriber = true
    params.currentTotes = [{ id: 2, progress_status: { status: 'locked' } }]
    let value = toteReturnHint(params, isReturnHint)
    expect(value.hint.message).toEqual(
      `现在开通自在选，可先下单新衣箱并\n等收到后再预约归还`
    )
    expect(value.isShowedHint).toEqual(true)
  })
})
