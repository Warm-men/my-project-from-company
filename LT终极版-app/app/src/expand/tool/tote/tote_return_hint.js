import React from 'react'
import { Text } from 'react-native'
import Stores from '../../../stores/stores'
import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'
import { differenceInDays, endOfDay } from 'date-fns'

const toteReturnHint = (params, isReturnHint = false) => {
  const {
    freeService,
    subscription: { totes_left, status, billing_date },
    inFirstMonthAndMonthlySubscriber
  } = params.customer
  //已开通自在选
  let hint
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
  const leftSubscriptionTime = differenceInDays(
    endOfDay(billing_date),
    new Date()
  )
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
    hint = {
      message: `你当前持有两个衣箱，请先预约归还上个衣箱`,
      leftButtonText: '取消',
      rightButtonText: '去归还',
      leftOnClick: () => {},
      rightOnClick: () => {
        params.hanldeToteReturn(params.currentTotes[1])
      }
    }
  } else if (isTooFast && !isCrossedTote) {
    hint = {
      messageComponent: (
        <Text
          style={{
            color: '#5E5E5E',
            fontSize: 14,
            textAlign: 'center',
            marginVertical: 25,
            letterSpacing: 0.4,
            lineHeight: 24,
            fontWeight: '300'
          }}>
          你的会员有效期还有
          <Text style={{ color: '#121212', fontWeight: '500' }}>
            {leftSubscriptionTime}天
          </Text>
          ，当前剩余
          <Text style={{ color: '#121212', fontWeight: '500' }}>
            {totes_left}个
          </Text>
          衣箱，确定现在预约归还吗
        </Text>
      ),
      leftButtonText: '取消',
      rightButtonText: '确定',
      leftButtonHighLight: true,
      leftOnClick: null,
      rightOnClick: () => {
        params.hanldeToteReturn(params.tote)
      }
    }
  } else if (newestTote.id !== params.tote.id && !isCrossedTote) {
    const newestToteStatus = newestTote.progress_status.status
    const isNewToteComing =
      newestToteStatus !== 'delivered' &&
      newestToteStatus !== 'scheduled_return'
    //新衣箱已下单未签收 ，提示
    if (isNewToteComing) {
      hint = {
        message: `你可收到新衣箱后再预约归还，\n确定要提前归还吗`,
        leftButtonText: '取消',
        rightButtonText: '确定',
        leftButtonHighLight: true,
        leftOnClick: null,
        rightOnClick: () => {
          params.hanldeToteReturn(params.tote)
        }
      }
    }
  } else {
    //新衣箱未下单，剩余衣箱数>0，剩余衣箱数>0，已开通自在选
    if (totes_left > 0 && !isCrossedTote) {
      if (freeService && freeService.state === 'active') {
        hint = {
          message: `你已开通自在选，可先下单新衣箱并\n等收到后再预约归还，确定要提前归还吗`,
          leftButtonText: '取消',
          leftButtonHighLight: true,
          rightButtonText: '确定',
          leftOnClick: null,
          rightOnClick: () => {
            params.hanldeToteReturn(params.tote)
          }
        }
      } else if (
        freeService &&
        freeService.state !== 'apply_refund' &&
        freeService.state !== 'approved' &&
        inFirstMonthAndMonthlySubscriber
      ) {
        //首月，剩余衣箱数>0，未开通自在选
        hint = {
          message: `现在开通自在选，可先下单新衣箱并\n等收到后再预约归还`,
          leftButtonText: '继续归还',
          rightButtonText: '去开通',
          leftOnClick: () => {
            params.hanldeToteReturn(params.tote)
          },
          rightOnClick: params.openFreeService
        }
      }
    } else if (totes_left === 0 && !isCrossedTote) {
      const { extendCancelQuiz, visitExtendCancelQuiz, tote } = params
      // 新衣箱未下单，剩余衣箱数=0，会员未过期，提示
      if (status !== 'cancelled') {
        hint = {
          message: `你已无剩余衣箱，现在续费可立即\n增加新衣箱，会员期可累积使用`,
          leftButtonText: '暂不续费',
          rightButtonText: '立即续费',
          leftOnClick: () => {
            if (extendCancelQuiz && visitExtendCancelQuiz) {
              visitExtendCancelQuiz(extendCancelQuiz, tote)
            } else {
              params.hanldeToteReturn(tote)
            }
          },
          rightOnClick: params.joinMember
        }
      }
    }
  }

  if (!!hint) {
    handleHint(hint)
    return isReturnHint ? { isShowedHint: true, hint } : { isShowedHint: true }
  }
  return { isShowedHint: false }
}

const handleHint = hint => {
  const {
    message,
    leftButtonText,
    rightButtonText,
    leftOnClick,
    rightOnClick,
    leftButtonHighLight,
    messageComponent
  } = hint
  const cancelType = leftButtonHighLight ? 'highLight' : 'normal'
  if (!!messageComponent) {
    Stores.modalStore.show(
      <CustomAlertView
        messageComponent={messageComponent}
        cancel={{
          title: leftButtonText,
          type: cancelType,
          onClick: leftOnClick
        }}
        other={[
          {
            title: rightButtonText,
            type: 'highLight',
            onClick: rightOnClick
          }
        ]}
      />
    )
  } else {
    Stores.modalStore.show(
      <CustomAlertView
        message={message}
        cancel={{
          title: leftButtonText,
          type: cancelType,
          onClick: leftOnClick
        }}
        other={[
          {
            title: rightButtonText,
            type: 'highLight',
            onClick: rightOnClick
          }
        ]}
      />
    )
  }
}

export { toteReturnHint }
