/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  DeviceEventEmitter
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { inject } from 'mobx-react'
import { Mutate, SERVICE_TYPES } from '../../expand/services/services'
import { shippingAddressFilter } from '../../expand/tool/shipping_address_filter'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import ToteScheduledAutoPickup from './tote_scheduled_return/tote_scheduled_auto_pickup'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'

@inject('currentCustomerStore', 'modalStore', 'appStore')
export default class ToteReturnModifyScheduleContainer extends Component {
  constructor(props) {
    super(props)
    const params = props.navigation.state.params || {}
    this.tote = params.tote
    this.state = {
      didBooked: false,
      isCommitting: false
    }
    this.returnBooking = null
    this.defaultZipCode = '518001'
  }

  _goBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  _updateReturnBooking = time => {
    this.returnBooking = time
  }

  _updateToteReturnShippingAddress = shippingAddress => {
    this.shippingAddress = shippingAddress
  }

  _addAddress = () => {
    this._tote_scheduled_auto_pickup.wrappedInstance._addAddress()
  }

  _toteReturnAutoPickup = () => {
    if (this.state.isCommitting) {
      return
    }
    const { modalStore, currentCustomerStore } = this.props
    const { localShippingAddresses } = currentCustomerStore
    const { validAddressIndex } = shippingAddressFilter(localShippingAddresses)
    if (validAddressIndex === -1) {
      modalStore.show(
        <CustomAlertView
          message={'请添加收货地址'}
          cancel={{ title: '取消', type: 'normal' }}
          other={[
            {
              title: '添加',
              type: 'highLight',
              onClick: this._addAddress
            }
          ]}
        />
      )
      return
    }
    if (!this.shippingAddress) {
      modalStore.show(
        <CustomAlertView
          message={'请选择取件地址'}
          cancel={{ title: '好的' }}
        />
      )
      return
    } else if (!this.returnBooking) {
      modalStore.show(
        <CustomAlertView message={'请选择时间'} cancel={{ title: '好的' }} />
      )
      return
    } else {
      this._penddingConfirmToteReturnAutoPickup()
    }
  }

  _penddingConfirmToteReturnAutoPickup = () => {
    this.setState(
      {
        isCommitting: true
      },
      () => {
        this._confirmToteReturnAutoPickup()
      }
    )
  }

  //确认预约上门归还
  _confirmToteReturnAutoPickup = () => {
    const { tote } = this.tote.scheduled_return
    const { scheduledReturnType } = this.props.navigation.state.params
    const toteFreeService =
      scheduledReturnType === 'tote_scheduled_return'
        ? this.tote.scheduled_return.tote_free_service
        : this.tote.tote_free_service
    const {
      address_1,
      state,
      city,
      district,
      zip_code,
      telephone,
      full_name
    } = this.shippingAddress

    const { navigation, modalStore, appStore } = this.props
    const toteFreeServiceId = toteFreeService && toteFreeService.id
    const returnSlotCount = toteFreeService && toteFreeService.return_slot_count
    const toteId = tote && tote.id
    let input = null
    if (
      scheduledReturnType === 'tote_free_service_scheduled_return' &&
      toteFreeServiceId
    ) {
      //单独归还自在选
      input = {
        requested_pickup_at: this.returnBooking,
        pickup_address: {
          address_1,
          address_2: address_1,
          city,
          country: 'CN',
          district,
          full_name,
          state,
          telephone,
          zip_code: zip_code ? zip_code : this.defaultZipCode
        },
        tote_free_service: {
          id: toteFreeServiceId,
          return_slot_count: returnSlotCount
        }
      }
    } else if (toteFreeServiceId && toteId) {
      //自在选与衣箱同时归还
      input = {
        tote_id: toteId,
        requested_pickup_at: this.returnBooking,
        pickup_address: {
          address_1,
          address_2: address_1,
          city,
          country: 'CN',
          district,
          full_name,
          state,
          telephone,
          zip_code: zip_code ? zip_code : this.defaultZipCode
        },
        tote_free_service: {
          id: toteFreeServiceId,
          return_slot_count: returnSlotCount
        }
      }
    } else {
      //单独归还衣箱
      input = {
        tote_id: toteId,
        requested_pickup_at: this.returnBooking,
        pickup_address: {
          address_1,
          address_2: address_1,
          city,
          country: 'CN',
          district,
          full_name,
          state,
          telephone,
          zip_code: zip_code ? zip_code : this.defaultZipCode
        }
      }
    }
    Mutate(
      SERVICE_TYPES.totes.MUTATION_SCHEDULE_AUTO_PICKUP,
      { input },
      response => {
        this.setState({ isCommitting: false })
        if (response.data.ScheduleAutoPickup.errors.length) {
          modalStore.show(
            <CustomAlertView
              message={response.data.ScheduleAutoPickup.errors[0].message}
              cancel={{ title: '好的', onClick: this._returnError }}
            />
          )
          return
        }
        appStore.showToast('提交成功', 'success')
        DeviceEventEmitter.emit('onRefreshTotes')
        navigation.popToTop()
      },
      () => {
        appStore.showToast('提交失败', 'success')
        this.setState({ isCommitting: false })
      }
    )
  }

  _returnError = () => {
    this.props.navigation.popToTop()
  }

  render() {
    if (!this.tote) {
      return null
    }
    const { navigation } = this.props
    const { isCommitting } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'更改预约'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>{'上门取件'}</Text>
          </View>
          <ToteScheduledAutoPickup
            navigation={navigation}
            updateReturnTime={this._updateReturnBooking}
            updateToteReturnShippingAddress={
              this._updateToteReturnShippingAddress
            }
            ref={toteScheduledAutoPickup =>
              (this._tote_scheduled_auto_pickup = toteScheduledAutoPickup)
            }
          />
        </ScrollView>

        <View style={styles.returnView}>
          <TouchableOpacity
            onPress={this._toteReturnAutoPickup}
            activeOpacity={0.85}
            disabled={isCommitting}
            style={styles.returnButton}>
            <Text style={styles.returnText}>
              {isCommitting ? `提交中` : `确认提交`}
            </Text>
            <Spinner
              isVisible={isCommitting}
              size={10}
              type={'FadingCircle'}
              color={'#fff'}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  returnView: {
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    width: '100%',
    backgroundColor: '#FFF'
  },
  returnButton: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  returnText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 4
  },
  titleView: {
    marginHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    paddingTop: 32,
    paddingBottom: 24
  },
  titleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  }
})
