import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text
} from 'react-native'
import {
  SafeAreaView,
  NavigationBar,
  BarButtonItem
} from '../../../storybook/stories/navigationbar'
import dateFns from 'date-fns'
import { inject, observer } from 'mobx-react'
import { SERVICE_TYPES, QNetwork, Mutate } from '../../expand/services/services'
import p2d from '../../expand/tool/p2d'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import CouponItem from '../../../storybook/stories/account/coupon_item'
import { ToastView } from '../../../storybook/stories/alert/toast_view'
import CouponActions from '../../../storybook/stories/totes/coupon_actions'
import NonConpon from '../../../storybook/stories/account/nonConpon'
@inject(
  'currentCustomerStore',
  'couponStore',
  'modalStore',
  'appStore',
  'toteCartStore'
)
@observer
export default class UseCouponContainer extends Component {
  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.state = {
      data: [],
      isLoading: true,
      currentCoupon: params && params.coupon ? params.coupon : null
    }
  }

  componentDidMount() {
    this.getCouponList()
  }

  setConpon = currentCoupon => {
    this.setState({ currentCoupon })
  }

  showQueryDialog = () => {
    const { modalStore } = this.props
    modalStore.show(<ToastView message={'正在为你挑选衣服'} />)
  }

  getCouponList = () => {
    const { navigation } = this.props
    const { params } = navigation.state
    let subscription_type_id =
      params && params.subscriptionTypeId ? params.subscriptionTypeId : {}
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME_ALL_COUPON,
      subscription_type_id,
      response => {
        const { me } = response.data
        const { valid_coupons, valid_promo_codes } = me
        this.setState({
          isLoading: false,
          data: params && params.isCoupon ? valid_coupons : valid_promo_codes
        })
      },
      () => {
        this.setState({
          isLoading: false
        })
      }
    )
  }

  nowUse = () => {
    const { currentCoupon } = this.state
    const { params } = this.props.navigation.state
    if (params.isCoupon) {
      this._applyCouponToTote(currentCoupon)
    } else {
      this.props.navigation.state.params.onSelect(currentCoupon)
      this.props.navigation.goBack()
    }
  }

  _applyCouponToTote = coupon => {
    let input = {
      customer_coupon_id: coupon.customer_coupon_id
    }
    Mutate(
      SERVICE_TYPES.toteCart.MUTATION_APPLY_COUPON_TO_TOTE,
      { input },
      response => {
        const { success, tote_cart } = response.data.ApplyCouponToToteCart
        if (success) {
          this.props.toteCartStore.updateToteCart(tote_cart)
          this.props.appStore.showToastWithOpacity('加衣券使用成功')
        }
        this.getValidCouponList()
      }
    )
  }

  getValidCouponList = () => {
    const { couponStore, navigation } = this.props
    QNetwork(SERVICE_TYPES.me.QUERY_ME_VALID_COUPON, {}, response => {
      const { me } = response.data
      couponStore.validCoupons = me.valid_coupons
      navigation.goBack()
    })
  }

  couponItem = ({ item }) => {
    // 券类型
    // expiration_date 优惠券  expired_at 加衣券
    const expiredTime = dateFns.format(
      item.expiration_date ? item.expiration_date : item.expired_at,
      'YYYY年MM月DD日'
    )

    return (
      <View style={{ marginBottom: p2d(12) }}>
        <CouponItem
          item={{ ...item }}
          onPress={this.itemImage}
          expiredTime={expiredTime}
        />
      </View>
    )
  }

  itemImage = item => {
    return (
      <CouponActions
        item={item}
        isUse={true}
        nowPromoCode={this.state.currentCoupon}
        onPress={this.setConpon}
      />
    )
  }

  _keyExtractor = (item, index) => index.toString()

  _goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    const { params } = this.props.navigation.state
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          style={styles.navigationBar}
          title={params.isCoupon ? '使用加衣券' : '使用优惠券'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.container}>
          {this.state.data.length ? (
            <FlatList
              extraData={this.state.currentCoupon}
              data={this.state.data}
              keyExtractor={this._keyExtractor}
              renderItem={this.couponItem}
            />
          ) : this.state.isLoading ? (
            <View style={styles.loadingView}>
              <Spinner
                isVisible={true}
                size={30}
                type={'Pulse'}
                color={'#222'}
              />
            </View>
          ) : (
            <NonConpon />
          )}
        </View>
        {!!this.state.currentCoupon && (
          <TouchableOpacity style={styles.bottomButton} onPress={this.nowUse}>
            <Text style={styles.buttonText}>确定使用</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  container: {
    backgroundColor: '#F7F7F7',
    flex: 1,
    alignItems: 'center',
    paddingTop: p2d(14)
  },
  navigationBar: {
    borderBottomWidth: 0
  },
  bottomButton: {
    height: p2d(40),
    width: p2d(345),
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#EA5C39'
  },
  buttonText: {
    fontSize: 14,
    color: '#fff'
  },
  loadingView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
})
