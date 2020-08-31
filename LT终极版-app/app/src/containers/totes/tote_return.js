/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  DeviceEventEmitter,
  Platform,
  BackHandler
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { inject } from 'mobx-react'
import dateFns from 'date-fns'
import { QNetwork, Mutate, SERVICE_TYPES } from '../../expand/services/services'
import { shippingAddressFilter } from '../../expand/tool/shipping_address_filter'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import { isValidCustomerName } from '../../expand/tool/userInfo_inspect'
import Statistics from '../../expand/tool/statistics'
import ToteReturnFreeService from '../../../storybook/stories/totes/tote_return/tote_return_free_service'
import ToteReturnProductList from '../../../storybook/stories/tote_cart/shoppingCar/tote_tracker_products'
import ToteScheduledReturn from './tote_scheduled_return/index'
import AlertPartsInTote from '../../../storybook/stories/alert/parts_in_tote'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'

@inject('totesStore', 'currentCustomerStore', 'modalStore', 'appStore')
export default class ToteReturnContainer extends Component {
  constructor(props) {
    super(props)
    const params = props.navigation.state.params || {}
    this.tote = params.tote
    this.state = {
      didBooked: false,
      isCommitting: false,
      freeServiceReturnType: 'allLeft',
      toteProducts: []
    }
    this.returnBooking = null
    this.defaultZipCode = '518001'
    this.scheduledPickupsType = 'scheduled_auto_pickup'
    this.shippingAddress = {}
    this.isPopupPartShowed = false
    this.productParts = null
    this.listeners = []
  }
  componentDidMount() {
    const { isOnlyReturnToteFreeService } = this.props.navigation.state.params
    if (!isOnlyReturnToteFreeService) {
      this._getNextToteStatus()
      const isShowRemindTFS = this._isShowRemindTFS()
      if (isShowRemindTFS) {
        this._showFreeServiceHint()
      }
    }
    this.listeners.push(
      this.props.navigation.addListener('didFocus', () => {
        if (Platform.OS === 'android') {
          BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackPress
          )
        }
      })
    )
    this.listeners.push(
      this.props.navigation.addListener('willBlur', () => {
        if (Platform.OS === 'android') {
          BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackPress
          )
        }
      })
    )
    this.returnTote()
    this._getUnreturnToteParts()
  }

  componentWillUnmount() {
    this.listeners.map(item => {
      item.remove()
    })
  }

  _isShowRemindTFS = () => {
    const { current_totes } = this.props.totesStore
    const isAllToteDelivered = current_totes.find(item => {
      return item.progress_status.status !== 'delivered'
    })
    const toteFreeService = this.tote.scheduled_return.tote_free_service
    const freeServiceState =
      toteFreeService &&
      toteFreeService.hint &&
      toteFreeService.hint.state === 'schedule_with_prev_tote'
    const remindTFS =
      current_totes.length === 2 && !isAllToteDelivered && freeServiceState
    return remindTFS
  }

  handleBackPress = () => {
    this._goBack()
    return true
  }

  shouldComponentUpdate(nextProps) {
    const { localShippingAddresses } = this.props.currentCustomerStore
    if (
      !localShippingAddresses[this.state.addressIndex] ||
      (localShippingAddresses[this.state.addressIndex] &&
        !localShippingAddresses[this.state.addressIndex].address_1 &&
        nextProps.currentCustomerStore.localShippingAddresses &&
        nextProps.currentCustomerStore.localShippingAddresses[
          this.state.addressIndex
        ].address_1)
    ) {
      Statistics.onEvent({
        id: 'fill_in_returnTote_address',
        label: '填写预约地址'
      })
    }
    return true
  }

  returnTote = () => {
    let toteProducts = this.tote.tote_products.filter(function(item) {
      return (
        item.transition_state !== 'purchased' &&
        item.transition_state !== 'returned'
      )
    })
    this.setState({ toteProducts })
  }

  _getUnreturnToteParts = () => {
    const tote_id = this.tote.id
    QNetwork(
      SERVICE_TYPES.totes.QUERY_UNRETURN_TOTE_PARTS,
      { tote_id },
      response => {
        this.productParts = response.data.unreturn_tote_parts
      }
    )
  }
  _getNextToteStatus = () => {
    QNetwork(SERVICE_TYPES.totes.QUERY_NEXT_TOTE_STATUS, {}, response => {
      const { currentCustomerStore } = this.props
      const subscription = {
        ...currentCustomerStore.subscription,
        next_tote_status: response.data.me.subscription.next_tote_status
      }
      currentCustomerStore.subscription = subscription
      const isNeedPayment =
        subscription.next_tote_status &&
        !subscription.next_tote_status.can_create_tote &&
        subscription.next_tote_status.final_code === 'NEED_PAYMENT'
      if (isNeedPayment) {
        this.props.modalStore.show(
          <CustomAlertView
            message={
              '你有待付款的订单，未处理不能开启下个衣箱；如忘记归还，请跟随现有衣箱一起寄回'
            }
            cancel={{ title: '跟随衣箱归还', type: 'normal' }}
            other={[
              {
                title: '去付款',
                type: 'highLight',
                onClick: this._goPaymentPending
              }
            ]}
          />
        )
        return
      }
    })
  }

  _showFreeServiceHint = () => {
    const { customer_nth_tote } = this.tote
    const { modalStore } = this.props
    if (customer_nth_tote < 4) {
      modalStore.show(
        <CustomAlertView
          message={'新衣箱的自在选请随本衣箱一起寄回'}
          cancel={{ title: '好的', type: 'normal' }}
        />
      )
    }
  }

  _goPaymentPending = () => {
    this.props.modalStore.hide()
    this.props.navigation.navigate('PaymentPending')
  }

  _goBack = () => {
    const { navigation } = this.props
    navigation.popToTop()
  }

  _updateSelectedItem = freeServiceReturnType => {
    this.setState({ freeServiceReturnType })
  }

  _updateScheduledPickupsType = type => {
    this.scheduledPickupsType = type
  }

  _updateReturnBooking = time => (this.returnBooking = time)

  _updateToteReturnShippingAddress = shippingAddress => {
    this.shippingAddress = shippingAddress
  }

  _handleConfirmReturn = () => {
    if (this.scheduledPickupsType === 'scheduled_auto_pickup') {
      const { params } = this.props.navigation.state
      if (params.isOnlyReturnToteFreeService) {
        const { freeServiceReturnType } = this.state
        if (freeServiceReturnType === 'allLeft') {
          this._penddingScheduledSelfDelivery()
        } else {
          this._toteReturnAutoPickup()
        }
        return
      }
      this._toteReturnAutoPickup()
    } else {
      this._toteReturnSelfDelivery()
    }
  }

  _popupPart = callback => {
    this.props.modalStore.show(
      <CustomAlertView
        messageComponent={<AlertPartsInTote message={this.productParts} />}
        messageComponentStyle={{ paddingHorizontal: 0 }}
        cancel={{
          title: '好的',
          onClick: () => {
            callback()
            this.isPopupPartShowed = true
          }
        }}
      />
    )
  }

  _toteReturnAutoPickup = () => {
    if (this.state.isCommitting) {
      return
    }
    const { modalStore, currentCustomerStore, navigation } = this.props
    const { localShippingAddresses } = currentCustomerStore
    const nowShippingAddress = this.shippingAddress
    const { validAddressIndex } = shippingAddressFilter(localShippingAddresses)
    if (validAddressIndex === -1) {
      this.props.modalStore.show(
        <CustomAlertView
          message={'请添加收货地址'}
          cancel={{ title: '取消', type: 'normal' }}
          other={[
            {
              title: '添加',
              type: 'highLight',
              onClick: this._tote_scheduled_return._addAddress
            }
          ]}
        />
      )
      return
    }

    const _isValidCustomerName =
      nowShippingAddress &&
      nowShippingAddress.full_name &&
      isValidCustomerName(nowShippingAddress.full_name)
    const { isOnlyReturnToteFreeService } = navigation.state.params
    const hasProductParts = this._hasProductParts()
    if (!_isValidCustomerName) {
      modalStore.show(
        <CustomAlertView
          message={'根据国家主管部门要求实行实名收寄，请填写真实姓名'}
          cancel={{ title: '取消', type: 'normal' }}
          other={[
            {
              title: '去修改',
              type: 'highLight',
              onClick: this._tote_scheduled_return._editAddress
            }
          ]}
        />
      )
      return
    } else if (!nowShippingAddress) {
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
    } else if (
      !isOnlyReturnToteFreeService &&
      hasProductParts &&
      !this.isPopupPartShowed
    ) {
      this._popupPart(this._penddingConfirmToteReturnAutoPickup)
      return
    } else {
      this._penddingConfirmToteReturnAutoPickup()
    }
  }

  _hasProductParts = () => {
    if (!this.productParts) return false
    const { current, history } = this.productParts
    if (current.product_parts.length || history.product_parts.length) {
      return true
    } else {
      return false
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
    const { scheduled_return } = this.tote
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
    const { isOnlyReturnToteFreeService } = navigation.state.params
    const toteFreeService = isOnlyReturnToteFreeService
      ? this.tote.tote_free_service
      : scheduled_return.tote_free_service
    const toteFreeServiceId = toteFreeService && toteFreeService.id
    const returnSlotCount =
      this.state.freeServiceReturnType === 'allLeft' ? 0 : 2

    const bookingInfo = {
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
    let input = null
    if (isOnlyReturnToteFreeService && toteFreeServiceId) {
      //单独归还自在选
      input = {
        ...bookingInfo,
        tote_free_service: {
          id: toteFreeServiceId,
          return_slot_count: returnSlotCount
        }
      }
    } else {
      if (toteFreeServiceId) {
        //自在选与衣箱同时归还
        input = {
          tote_id: scheduled_return.tote.id,
          ...bookingInfo,
          tote_free_service: {
            id: toteFreeServiceId,
            return_slot_count: returnSlotCount
          }
        }
      } else {
        //单独归还衣箱
        input = {
          tote_id: scheduled_return.tote.id,
          ...bookingInfo
        }
      }
    }
    Mutate(
      SERVICE_TYPES.totes.MUTATION_SCHEDULE_AUTO_PICKUP,
      { input },
      response => {
        this.setState({ isCommitting: false })
        const { errors, return_warn } = response.data.ScheduleAutoPickup
        if (errors.length) {
          modalStore.show(
            <CustomAlertView
              message={errors[0].message}
              cancel={{ title: '好的', onClick: this._returnError }}
            />
          )
          return
        }
        const days = dateFns.differenceInDays(new Date(), this.tote.styled_at)
        Statistics.onEvent({
          id: 'tote_length_of_stay',
          label: '用户使用衣箱时长',
          attributes: { days: days + '' }
        })
        DeviceEventEmitter.emit('onRefreshTotes')
        const { display_rate_incentive_guide } = this.tote
        if (display_rate_incentive_guide && !isOnlyReturnToteFreeService) {
          navigation.replace('ToteReturnScheduledDone', {
            tote: this.tote,
            return_warn
          })
        } else {
          appStore.showToast('提交成功', 'success')
          navigation.popToTop()
        }
      },
      () => {
        appStore.showToast('提交失败', 'success')
        this.setState({ isCommitting: false })
      }
    )
  }

  _returnError = () => {
    DeviceEventEmitter.emit('onRefreshTotes')
    this.props.navigation.popToTop()
  }

  _toteReturnSelfDelivery = () => {
    const { isOnlyReturnToteFreeService } = this.props.navigation.state.params
    const hasProductParts = this._hasProductParts()
    if (
      !isOnlyReturnToteFreeService &&
      hasProductParts &&
      !this.isPopupPartShowed
    ) {
      this._popupPart(this._penddingScheduledSelfDelivery)
    } else {
      this._penddingScheduledSelfDelivery()
    }
  }

  _penddingScheduledSelfDelivery = () => {
    if (this.state.isCommitting) {
      return
    }
    this.setState(
      {
        isCommitting: true
      },
      () => {
        this._confirmToteReturnSelfDelivery()
      }
    )
  }
  //确认自寄归还
  _confirmToteReturnSelfDelivery = () => {
    const { scheduled_return } = this.tote
    const { navigation, modalStore, appStore } = this.props
    const { isOnlyReturnToteFreeService } = navigation.state.params
    const toteFreeService = isOnlyReturnToteFreeService
      ? this.tote.tote_free_service
      : scheduled_return.tote_free_service
    const toteFreeServiceId = toteFreeService && toteFreeService.id
    const returnSlotCount =
      this.state.freeServiceReturnType === 'allLeft' ? 0 : 2
    let input = null
    if (isOnlyReturnToteFreeService && toteFreeServiceId) {
      //单独自寄归还自在选
      input = {
        tote_free_service: {
          id: toteFreeServiceId,
          return_slot_count: returnSlotCount
        }
      }
    } else {
      if (toteFreeServiceId) {
        //自寄归还自在选和衣箱
        input = {
          tote_id: scheduled_return.tote.id,
          tote_free_service: {
            id: toteFreeServiceId,
            return_slot_count: returnSlotCount
          }
        }
      } else {
        //自寄归还衣箱
        input = {
          tote_id: scheduled_return.tote.id
        }
      }
    }
    Mutate(
      SERVICE_TYPES.totes.MUTATION_SCHEDULE_SELF_DELIVERY,
      { input },
      response => {
        this.setState({ isCommitting: false })
        const { errors, return_warn } = response.data.ScheduleSelfDelivery
        if (!!errors.length) {
          modalStore.show(
            <CustomAlertView
              message={errors[0].message}
              cancel={{ title: '好的', onClick: this._returnError }}
            />
          )
          return
        }
        const days = dateFns.differenceInDays(new Date(), this.tote.styled_at)
        Statistics.onEvent({
          id: 'tote_length_of_stay',
          label: '用户使用衣箱时长',
          attributes: { days: days + '' }
        })
        DeviceEventEmitter.emit('onRefreshTotes')
        const { display_rate_incentive_guide } = this.tote
        if (display_rate_incentive_guide && !isOnlyReturnToteFreeService) {
          navigation.replace('ToteReturnScheduledDone', {
            tote: this.tote,
            return_warn
          })
        } else {
          appStore.showToast('提交成功', 'success')
          navigation.popToTop()
        }
      },
      () => {
        appStore.showToast('提交失败', 'success')
        this.setState({ isCommitting: false })
      }
    )
  }

  render() {
    if (!this.tote) {
      return null
    }
    const { navigation } = this.props
    const hasToteFreeService = this.tote.scheduled_return.tote_free_service
    const { isOnlyReturnToteFreeService } = navigation.state.params
    const productListTitle = hasToteFreeService ? '待归还衣箱' : '归还衣箱'
    const isOnlyReturnToteFreeServiceLeftAll =
      isOnlyReturnToteFreeService &&
      this.state.freeServiceReturnType === 'allLeft'
    const { state } = (hasToteFreeService && hasToteFreeService.hint) || {}
    const didntComplete =
      state &&
      state !== 'complete_with_purchase' &&
      state !== 'complete_with_return'
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'预约归还'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {((!!hasToteFreeService && didntComplete) ||
            !!isOnlyReturnToteFreeService) && (
            <ToteReturnFreeService
              updateSelectedItem={this._updateSelectedItem}
              currentTote={this.tote}
              isOnlyReturnToteFreeService={!!isOnlyReturnToteFreeService}
            />
          )}
          {!isOnlyReturnToteFreeService && (
            <View style={styles.productsView}>
              <Text style={styles.titleText}>{productListTitle}</Text>
              <ToteReturnProductList
                disabled={true}
                products={this.state.toteProducts}
              />
            </View>
          )}
          {!isOnlyReturnToteFreeServiceLeftAll && (
            <ToteScheduledReturn
              updateReturnBooking={this._updateReturnBooking}
              updateScheduledPickupsType={this._updateScheduledPickupsType}
              navigation={navigation}
              ref={toteScheduledReturn =>
                (this._tote_scheduled_return = toteScheduledReturn)
              }
              tote={this.tote}
              scheduledPickupsType={'scheduled_auto_pickup'}
              updateToteReturnShippingAddress={
                this._updateToteReturnShippingAddress
              }
              isOnlyReturnToteFreeService={isOnlyReturnToteFreeService}
              updateAddressIndex={this._updateAddressIndex}
            />
          )}
        </ScrollView>

        <View style={styles.returnView}>
          <TouchableOpacity
            disabled={this.state.isCommitting}
            onPress={this._handleConfirmReturn}
            activeOpacity={0.85}
            style={styles.returnButton}>
            <Text style={styles.returnText}>
              {this.state.isCommitting ? `提交中` : `确认提交`}
            </Text>
            <Spinner
              isVisible={this.state.isCommitting}
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
  productsView: {
    paddingHorizontal: 16
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginVertical: 24
  }
})
