import { differenceInDays, endOfDay } from 'date-fns'

const scheduleReturnHint = params => {
  const {
    freeService,
    subscription: { totes_left, status, billing_date },
    in_first_month_and_monthly_subscriber
  } = params.customer

  let hintContent

  const newestTote = params.currentTotes[0]
  const totesLength = params.currentTotes.length

  const currentToteIndex = params.currentTotes.findIndex(item => {
    return item.id === params.tote.id
  })
  const newToteProgressStatus = params.currentTotes[0].progress_status
  const oldToteProgressStatus =
    totesLength === 2 && params.currentTotes[1].progress_status

  const isCrossedTote =
    totesLength === 2 &&
    newToteProgressStatus.status === 'delivered' &&
    oldToteProgressStatus.status === 'delivered'
  const billingDate = endOfDay(billing_date)
  const leftSubscriptionTime = differenceInDays(billingDate, new Date())
  const isTooFast =
    totes_left > 0 &&
    status !== 'cancelled' &&
    status !== 'pending_hold' &&
    leftSubscriptionTime / totes_left > 18
  if (currentToteIndex === 1 && isCrossedTote) {
    return { isShowedHint: false }
  }
  if (currentToteIndex === 0 && isCrossedTote) {
    //有两个衣箱在手，用户点击新衣箱的预约归还
    hintContent = {
      message: `你当前持有两个衣箱，请先预约归还上个衣箱`,
      leftButtonText: '取消',
      rightButtonText: '去归还',
      leftOnClick: () => {},
      rightOnClick: () => {
        params.hanldeToteReturn(params.tote)
      },
      toteId: params.currentTotes[1].id
    }
  } else if (isTooFast && !isCrossedTote) {
    hintContent = {
      hintChildren: (
        <span>
          你的会员有效期还有
          <span style={{ color: '#121212', fontWeight: 500 }}>
            {leftSubscriptionTime}天
          </span>
          ，当前剩余
          <span style={{ color: '#121212', fontWeight: 500 }}>
            {totes_left}个
          </span>
          衣箱，确定现在预约归还吗
        </span>
      ),
      leftButtonText: '取消',
      rightButtonText: '确定',
      leftButtonHighLight: true,
      leftOnClick: () => {},
      rightOnClick: () => {
        params.hanldeToteReturn(params.tote)
      }
    }
  } else if (newestTote.id !== params.tote.id && !isCrossedTote) {
    const { status } = newestTote.progress_status
    const newestToteStatus =
      status !== 'delivered' && status !== 'scheduled_return'
    //新衣箱已下单未签收 ，提示
    if (newestToteStatus) {
      hintContent = {
        message: `你可收到新衣箱后再预约归还，确定要提前归还吗`,
        leftButtonText: '取消',
        rightButtonText: '确定',
        leftButtonHighLight: true,
        leftOnClick: () => {},
        rightOnClick: () => {
          params.hanldeToteReturn(params.tote)
        }
      }
    }
  } else {
    //新衣箱未下单，剩余衣箱数>0，剩余衣箱数>0，已开通自在选
    if (totes_left > 0 && !isCrossedTote) {
      if (freeService && freeService.state === 'active') {
        hintContent = {
          message: `你已开通自在选，可先下单新衣箱并等收到后再预约归还，确定要提前归还吗`,
          leftButtonText: '取消',
          leftButtonHighLight: true,
          rightButtonText: '确定',
          leftOnClick: () => {},
          rightOnClick: () => {
            params.hanldeToteReturn(params.tote)
          }
        }
      } else if (
        freeService &&
        freeService.state !== 'apply_refund' &&
        freeService.state !== 'approved' &&
        in_first_month_and_monthly_subscriber
      ) {
        //首月，剩余衣箱数>0，未开通自在选
        hintContent = {
          message: `现在开通自在选，可先下单新衣箱并等收到后再预约归还`,
          leftButtonText: '继续归还',
          rightButtonText: '去开通',
          leftOnClick: () => {
            params.hanldeToteReturn(params.tote)
          },
          rightOnClick: params.openFreeService
        }
      }
    } else if (totes_left === 0 && !isCrossedTote) {
      // 新衣箱未下单，剩余衣箱数=0，会员未过期，提示
      const { goQuiz, hanldeToteReturn, joinMember } = params
      if (status !== 'cancelled') {
        hintContent = {
          message: `你已无剩余衣箱，现在续费可立即增加新衣箱，会员期可累积使用`,
          leftButtonText: '暂不续费',
          rightButtonText: '立即续费',
          leftOnClick: !!goQuiz ? goQuiz : hanldeToteReturn,
          rightOnClick: joinMember
        }
      }
    }
  }

  if (hintContent) {
    return { isShowedHint: true, hintContent }
  }
  return { isShowedHint: false }
}

export { scheduleReturnHint }
