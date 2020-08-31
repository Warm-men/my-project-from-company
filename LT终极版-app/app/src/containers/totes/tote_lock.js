/* @flow */
import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
  Text
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import ProductList from '../../../storybook/stories/tote_cart/shoppingCar/tote_tracker_products'
import { inject, observer } from 'mobx-react'
import { Mutate, SERVICE_TYPES, QNetwork } from '../../expand/services/services'
import { shippingAddressFilter } from '../../../src/expand/tool/shipping_address_filter'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import p2d from '../../expand/tool/p2d'
import Statistics from '../../expand/tool/statistics'
import { isValidCustomerName } from '../../expand/tool/userInfo_inspect'
import ShippingAddress from '../../../storybook/stories/totes/shipping_address'
import {
  getError,
  translationErrorCode
} from '../../expand/tool/shopping_car_error'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'

@inject('currentCustomerStore', 'modalStore', 'appStore', 'toteCartStore')
@observer
export default class ToteLockContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { addressIndex: 0, isCommitting: false }
  }

  componentDidMount() {
    this._updateAddressIndex()
  }

  _alert = (textValue, buttonValue, onClick) => {
    this.props.modalStore.show(
      <CustomAlertView
        message={textValue}
        cancel={{ title: '取消', type: 'normal' }}
        other={[
          {
            title: buttonValue,
            type: 'highLight',
            onClick: onClick
          }
        ]}
      />
    )
  }
  //确认下单
  _confirmButton = () => {
    if (this.state.isCommitting) {
      return
    }
    const { localShippingAddresses } = this.props.currentCustomerStore
    let addressIndex = this.state.addressIndex
    const latestShippingAddress = localShippingAddresses[addressIndex]
    if (!latestShippingAddress || !latestShippingAddress.address_1) {
      this._alert('请添加收货地址', '添加', this._addAddress)
      return
    }
    const hasAddress = latestShippingAddress && latestShippingAddress.address_1
    const _isValidCustomerName =
      latestShippingAddress &&
      latestShippingAddress.full_name &&
      isValidCustomerName(latestShippingAddress.full_name)
    if (!_isValidCustomerName) {
      this._alert(
        '根据国家主管部门要求实行实名收寄，请填写真实姓名',
        '去修改',
        this._editAddress
      )
      return
    }
    Statistics.onEvent({
      id: 'tote_lock',
      label: '点确认下单按钮',
      attributes: { hasAddress: hasAddress ? 'true' : 'false' }
    })

    this.setState({ isCommitting: true })
    this._lockLatestTote()
  }

  _lockLatestTote = () => {
    const {
      appStore,
      modalStore,
      navigation,
      currentCustomerStore
    } = this.props
    const { localShippingAddresses } = currentCustomerStore
    const addressIndex = this.state.addressIndex
    const shippingAddress = localShippingAddresses[addressIndex]
    const {
      address_1,
      address_2,
      city,
      state,
      zip_code,
      telephone,
      district,
      country,
      full_name
    } = shippingAddress
    const input = {
      shipping_address: {
        address_1,
        address_2,
        city,
        state,
        zip_code,
        telephone,
        district,
        country,
        full_name
      },
      category_rule_flag: true
    }
    Mutate(
      SERVICE_TYPES.totes.MUTATION_TOTE_CART_PLACE_ORDER,
      { input },
      response => {
        const {
          success,
          tote_swap_questionnaire,
          tote,
          errors,
          customer
        } = response.data.ToteCartPlaceOrder
        if (success) {
          currentCustomerStore.updateCurrentCustomerSubscription(customer)

          if (tote_swap_questionnaire) {
            navigation.navigate('RateToteSwap', {
              questionnaire: tote_swap_questionnaire,
              id: tote.id
            })
          } else {
            navigation.navigate('ToteLockSuccess')
          }
          DeviceEventEmitter.emit('onRefreshTotes')
          this.getShoppingCar()
        } else {
          this.setState({ isCommitting: false })
          const { toastError, alertError } = getError(errors)
          if (toastError.length) {
            appStore.showToastWithOpacity(toastError[0].message)
          }
          if (alertError.length) {
            if (
              alertError[0].error_code === 'error_need_identity_authentication'
            ) {
              navigation.navigate('IdentityAuthentication')
              return
            }
            const {
              title,
              buttonTitle,
              cancelButtonTitle
            } = translationErrorCode(alertError[0].error_code)
            modalStore.show(
              <CustomAlertView
                title={title}
                message={alertError[0].message}
                cancel={
                  cancelButtonTitle
                    ? { title: cancelButtonTitle, type: 'normal' }
                    : null
                }
                other={[
                  {
                    title: buttonTitle,
                    type: 'highLight',
                    onClick: this.errorOnPress
                  }
                ]}
              />
            )
          }
        }
      },
      () => {
        this.setState({ isCommitting: false })
      }
    )
  }

  getShoppingCar = () => {
    const { toteCartStore } = this.props
    QNetwork(SERVICE_TYPES.toteCart.QUERY_ME_TOTECART, {}, response => {
      const { me } = response.data
      if (me) {
        toteCartStore.updateToteCart(me.tote_cart)
      }
    })
  }

  errorOnPress = () => {
    const { navigation, toteCartStore, modalStore } = this.props
    const { validate_result } = toteCartStore.toteCart
    const { alertError } = getError(validate_result.errors)
    if (alertError && !alertError.length) return

    switch (alertError[0].error_code) {
      case 'error_need_payment':
        navigation.navigate('PaymentPending')
        break
      case 'error_subscription_inactive':
        navigation.navigate('JoinMember')
        break
      case 'error_scheduled_pickup':
        navigation.navigate('OpenFreeService')
        break
      case 'error_scheduled_pickup_without_free_service':
        modalStore.hide()
        break
      case 'error_need_recharge_account':
        navigation.navigate('CreditAccount')
        break
      case 'error_run_out_of_subscription_totes':
        navigation.navigate('JoinMember')
        break
    }
  }

  _updateAddressIndex = () => {
    const { localShippingAddresses } = this.props.currentCustomerStore
    const { isSelectedAddressIndex, validAddressIndex } = shippingAddressFilter(
      localShippingAddresses
    )
    this.setState({
      addressIndex:
        (isSelectedAddressIndex !== -1 && isSelectedAddressIndex) ||
        (validAddressIndex !== -1 && validAddressIndex) ||
        0
    })
  }

  finishSelectAddress = () => {
    this._updateAddressIndex()
  }

  onConfirmAdd = () => {
    this._updateAddressIndex()
  }

  //添加地址
  _addAddress = () => {
    this.props.navigation.navigate('EditAndAddShippingAddress', {
      edit: false,
      onConfirmAdd: this.onConfirmAdd
    })
  }
  //选择地址
  _selectAddress = () => {
    this.props.navigation.navigate('ShippingAddress', {
      isSelectAddress: true,
      selectAddress: this.finishSelectAddress,
      onConfirmAdd: this.onConfirmAdd
    })
  }
  //修改地址
  _editAddress = () => {
    this.props.navigation.navigate('EditAndAddShippingAddress', {
      edit: true,
      addressIndex: this.state.addressIndex
    })
  }
  _goBack = () => {
    const { params } = this.props.navigation.state
    if (params && params.fromIdentityAuthentication) {
      this.props.navigation.popToTop()
    } else {
      this.props.navigation.goBack()
    }
  }
  render() {
    const { toteCartStore, currentCustomerStore } = this.props

    const { accessory_items, clothing_items } = toteCartStore.toteCart
    const products = [...clothing_items, ...accessory_items]

    const { localShippingAddresses } = currentCustomerStore
    const addressIndex = this.state.addressIndex
    const shippingAddress = localShippingAddresses[addressIndex]
    const hasAddress = shippingAddress && shippingAddress.address_1
    const _isValidCustomerName =
      shippingAddress &&
      shippingAddress.full_name &&
      isValidCustomerName(shippingAddress.full_name)
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'下单衣箱'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <ShippingAddress
            hasAddress={hasAddress}
            shippingAddress={shippingAddress}
            isValidCustomerName={_isValidCustomerName}
            selectAddress={this._selectAddress}
          />
          {products && (
            <ProductList
              flatListStyle={styles.flatListStyle}
              products={products}
            />
          )}
          <View style={styles.remind}>
            <Text style={styles.remindTitle}>配送说明</Text>
            <Text style={styles.remindContent}>
              1、每天17点前下单，会在当天寄出{'\n'}
              2、晚于17点的订单，会在第二天寄出{'\n'}
              3、所有衣箱均由顺丰标快免费配送，提交后可查询配送状态
            </Text>
          </View>
        </ScrollView>
        <View style={styles.lockView}>
          <TouchableOpacity
            onPress={this._confirmButton}
            style={styles.lockButton}>
            <Text style={styles.lockText}>
              {this.state.isCommitting ? '提交中' : '确认下单'}
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
  remind: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 26,
    borderTopWidth: 7,
    borderColor: '#F7F7F7'
  },
  remindTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    marginBottom: 14
  },
  remindContent: {
    fontSize: 13,
    color: '#999',
    lineHeight: 24
  },
  lockView: {
    width: '100%',
    height: 48,
    zIndex: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#F7F7F7'
  },
  lockButton: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  lockText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 4
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20
  },
  loadingView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: p2d(221),
    backgroundColor: '#03050D',
    opacity: 0.8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 18
  },
  flatListStyle: {
    paddingTop: 16
  }
})
