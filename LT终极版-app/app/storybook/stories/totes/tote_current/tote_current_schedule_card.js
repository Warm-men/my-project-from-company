/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import ToteReturnScheduleAutoPickup from './tote_current_schedule_auto_pickup'
import ToteReturnScheduleSelfDelivery from './tote_current_schedule_self_delivery'

export default class ToteReturnScheduleCard extends PureComponent {
  _gotoModifySchedule = () => {
    const { tote, gotoModifySchedule, scheduledReturnType } = this.props
    gotoModifySchedule && gotoModifySchedule(tote, scheduledReturnType)
  }

  _gotoReturnDetail = () => {
    const { tote, gotoReturnToteDetail, scheduledReturnType } = this.props
    gotoReturnToteDetail(tote, scheduledReturnType)
  }

  _getScheduledReturn = () => {
    const { scheduledReturnType, tote } = this.props
    let scheduledReturn = null
    if (scheduledReturnType === 'tote_free_service_scheduled_return') {
      scheduledReturn = tote.tote_free_service.scheduled_return || {}
    } else {
      scheduledReturn = tote.scheduled_return
    }
    return scheduledReturn
  }

  render() {
    const { fillInTrackingNumber, scheduledReturnType } = this.props
    const scheduledReturn = this._getScheduledReturn()
    const { fc_address } = this.props.tote
    const { scheduled_auto_pickup, scheduled_self_delivery } = scheduledReturn
    if (!scheduled_auto_pickup && !scheduled_self_delivery) {
      return null
    }
    return (
      <View style={styles.container}>
        {scheduled_auto_pickup && (
          <ToteReturnScheduleAutoPickup
            scheduledAutoPickup={scheduled_auto_pickup}
            gotoModifySchedule={this._gotoModifySchedule}
            gotoReturnDetail={this._gotoReturnDetail}
            scheduledReturnType={scheduledReturnType}
          />
        )}
        {scheduled_self_delivery && (
          <ToteReturnScheduleSelfDelivery
            scheduledSelfDelivery={scheduled_self_delivery}
            fcAddress={fc_address}
            scheduledReturnType={scheduledReturnType}
            tote={this.props.tote}
            gotoReturnDetail={this._gotoReturnDetail}
            fillInTrackingNumber={fillInTrackingNumber}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#FAFAFA',
    marginTop: 16
  }
})
