/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import ToteScheduledAutoPickup from './tote_scheduled_auto_pickup'
import ToteScheduledSelfDelivery from './tote_scheduled_self_delivery'
import SelectButton from '../../../../storybook/stories/totes/tote_return/tote_scheduled_return_select_button'

export default class ToteScheduledReturnContainer extends Component {
  constructor(props) {
    super(props)
    const { scheduledPickupsType } = props
    this.state = { scheduledPickupsType }
  }

  _didSelectedItem = type => {
    this.setState({ scheduledPickupsType: type }, () => {
      const { updateScheduledPickupsType } = this.props
      updateScheduledPickupsType && updateScheduledPickupsType(type)
    })
  }

  _editAddress = () => {
    const isScheduledAutoPickup =
      this.state.scheduledPickupsType === 'scheduled_auto_pickup'
    isScheduledAutoPickup &&
      this._tote_scheduled_auto_pickup.wrappedInstance._editAddress()
  }

  _addAddress = () => {
    const isScheduledAutoPickup =
      this.state.scheduledPickupsType === 'scheduled_auto_pickup'
    isScheduledAutoPickup &&
      this._tote_scheduled_auto_pickup.wrappedInstance._addAddress()
  }

  _updateReturnTime = time => {
    const { updateReturnBooking } = this.props
    updateReturnBooking && updateReturnBooking(time)
  }

  render() {
    const isScheduledAutoPickup =
      this.state.scheduledPickupsType === 'scheduled_auto_pickup'
    const {
      navigation,
      updateToteReturnShippingAddress,
      tote,
      isOnlyReturnToteFreeService
    } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.selectButtonView}>
          <SelectButton
            onPress={this._didSelectedItem}
            scheduledPickupsType={this.state.scheduledPickupsType}
            text={'上门取件'}
            type={'scheduled_auto_pickup'}
          />
          <SelectButton
            onPress={this._didSelectedItem}
            scheduledPickupsType={this.state.scheduledPickupsType}
            text={'自行寄回'}
            type={'scheduled_self_delivery'}
          />
        </View>
        {isScheduledAutoPickup ? (
          <ToteScheduledAutoPickup
            navigation={navigation}
            updateReturnTime={this._updateReturnTime}
            ref={toteScheduledAutoPickup =>
              (this._tote_scheduled_auto_pickup = toteScheduledAutoPickup)
            }
            updateToteReturnShippingAddress={updateToteReturnShippingAddress}
            isOnlyReturnToteFreeService={isOnlyReturnToteFreeService}
          />
        ) : (
          <ToteScheduledSelfDelivery
            tote={tote}
            isOnlyReturnToteFreeService={isOnlyReturnToteFreeService}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30
  },
  selectButtonView: {
    flexDirection: 'row',
    marginHorizontal: 16,
    paddingTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2'
  }
})
