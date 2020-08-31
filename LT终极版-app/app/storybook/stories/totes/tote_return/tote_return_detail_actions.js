import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

export default class ToteReturnDetailActions extends Component {
  _leftButtonOnPress = () => {
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

  _rightButtonOnPress = () => {
    const { tote, isToteScheduledReturn, isScheduledAutoPickup } = this.props
    const { allowed_commands, scheduled_auto_pickup } = isToteScheduledReturn
      ? tote.scheduled_return
      : tote.tote_free_service.scheduled_return
    const { gotoScheduleAutoPickup, modifyShippingCode } = this.props
    const canScheduleAutoPickup = allowed_commands.includes(
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
  _isShowLeftButton = () => {
    const { isScheduledAutoPickup, isToteScheduledReturn, tote } = this.props
    const { allowed_commands, scheduled_auto_pickup } = isToteScheduledReturn
      ? tote.scheduled_return
      : tote.tote_free_service.scheduled_return
    const canScheduleAutoPickup = allowed_commands.includes(
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
    const canScheduleAutoPickup = allowed_commands.includes(
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
    const isShowLeftButton = this._isShowLeftButton()
    const rigthButton = isScheduledAutoPickup
      ? styles.whiteRigthButton
      : styles.redRigthButton
    const rightText = isScheduledAutoPickup
      ? styles.whiteRightText
      : styles.redRightText
    const rightTextDisable = isScheduledAutoPickup
      ? styles.disableWhiteRightText
      : styles.disableRedRightText
    return (
      <View style={styles.wrapView}>
        {isShowLeftButton && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this._leftButtonOnPress}
            style={[styles.buttonItem, styles.leftButton]}>
            <Text style={styles.leftText}>{leftButtonText}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          disabled={disabledRightButton}
          activeOpacity={0.8}
          onPress={this._rightButtonOnPress}
          style={[styles.buttonItem, rigthButton]}>
          <Text style={[rightText, disabledRightButton && rightTextDisable]}>
            {rightButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapView: {
    height: 60,
    flexDirection: 'row',
    borderTopColor: '#CCCCCC',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  buttonItem: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCCCCC',
    borderRadius: 2,
    marginRight: 16
  },
  whiteRigthButton: {
    backgroundColor: '#FFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCCCCC',
    borderRadius: 2
  },
  redRigthButton: {
    backgroundColor: '#ea5c39',
    borderRadius: 2
  },
  leftText: {
    fontSize: 14,
    color: '#5E5E5E',
    fontWeight: '500',
    letterSpacing: 0.4
  },
  whiteRightText: {
    color: '#5E5E5E',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.4
  },
  redRightText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.4
  },
  rightTextDisable: {
    color: '#CCCCCC'
  },
  disableWhiteRightText: {
    color: '#ccc'
  },
  disableRedRightText: {
    color: '#fff'
  }
})
