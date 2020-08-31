import React, { PureComponent } from 'react'

export default class ToteReturnDetailActions extends PureComponent {
  leftButtonOnPress = () => {
    const {
      gotoScheduleAutoPickup,
      gotoScheduleSeflDelivery,
      tote,
      isToteScheduledReturn
    } = this.props
    const { scheduled_auto_pickup } = isToteScheduledReturn
      ? tote.scheduled_return
      : tote.tote_free_service.scheduled_return
    if (!!scheduled_auto_pickup) {
      gotoScheduleSeflDelivery()
    } else {
      gotoScheduleAutoPickup()
    }
  }

  rightButtonOnPress = () => {
    const { tote, isToteScheduledReturn, isScheduledAutoPickup } = this.props
    const { allowed_commands, scheduled_auto_pickup } = isToteScheduledReturn
      ? tote.scheduled_return
      : tote.tote_free_service.scheduled_return
    const { gotoScheduleAutoPickup, modifyShippingCode } = this.props
    const canScheduleAutoPickup = _.includes(
      allowed_commands,
      'schedule_auto_pickup'
    )
    if (
      !!scheduled_auto_pickup &&
      canScheduleAutoPickup &&
      isScheduledAutoPickup
    ) {
      gotoScheduleAutoPickup()
      return
    }
    modifyShippingCode()
  }
  isShowLeftButton = () => {
    const { isScheduledAutoPickup, isToteScheduledReturn, tote } = this.props
    const { allowed_commands, scheduled_auto_pickup } = isToteScheduledReturn
      ? tote.scheduled_return
      : tote.tote_free_service.scheduled_return
    const canScheduleAutoPickup = _.includes(
      allowed_commands,
      'schedule_auto_pickup'
    )
    if (isScheduledAutoPickup) {
      return true
    } else {
      if (!!scheduled_auto_pickup) {
        return false
      } else {
        if (canScheduleAutoPickup) {
          return true
        } else {
          return false
        }
      }
    }
  }
  render() {
    const { isScheduledAutoPickup, tote, isToteScheduledReturn } = this.props
    const {
      allowed_commands,
      scheduled_auto_pickup,
      scheduled_self_delivery
    } = isToteScheduledReturn
      ? tote.scheduled_return
      : tote.tote_free_service.scheduled_return
    const shipping_code =
      scheduled_self_delivery && scheduled_self_delivery.shipping_code
    const canScheduleAutoPickup = _.includes(
      allowed_commands,
      'schedule_auto_pickup'
    )
    const leftButtonText = !!scheduled_auto_pickup
      ? '我想改自行寄回'
      : '我想改上门取件'
    const rightButtonText = !shipping_code
      ? isScheduledAutoPickup
        ? '更改预约'
        : '输入单号'
      : '修改单号'
    const disabledRightButton =
      !!scheduled_auto_pickup && !canScheduleAutoPickup && isScheduledAutoPickup
    const isShowLeftButton = this.isShowLeftButton()
    const buttonOnClickStyle = isScheduledAutoPickup
      ? 'buttonItem whiteButton'
      : 'buttonItem redButton'
    const buttonBlurStyle = isScheduledAutoPickup
      ? 'buttonItem whiteBlurButton'
      : 'buttonItem redBlurButton'
    const buttonStyle = disabledRightButton
      ? buttonBlurStyle
      : buttonOnClickStyle
    return (
      <div className={'actionWrapView'}>
        {isShowLeftButton && (
          <div
            onClick={this.leftButtonOnPress}
            className={'buttonItem leftButton'}
          >
            <div className={'leftText'}>{leftButtonText}</div>
          </div>
        )}
        <div
          disabled={disabledRightButton}
          onClick={!disabledRightButton ? this.rightButtonOnPress : null}
          className={buttonStyle}
        >
          <div className={'rightText'}>{rightButtonText}</div>
        </div>
      </div>
    )
  }
}
