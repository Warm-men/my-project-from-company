import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
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
import { SERVICE_TYPES, QNetwork } from '../../expand/services/services'
import p2d from '../../expand/tool/p2d'
import CouponItem from '../../../storybook/stories/account/coupon_item'
import CouponActions from '../../../storybook/stories/totes/coupon_actions'
import NonConpon from '../../../storybook/stories/account/nonConpon'

@inject('currentCustomerStore', 'couponStore')
@observer
export default class CouponContainer extends Component {
  static defaultProps = {
    filters: [{ valid: '未使用' }, { used: '已使用' }, { expired: '已失效' }]
  }
  constructor(props) {
    super(props)
    const { validCoupons } = props.couponStore
    this.state = { selectBar: 'valid', data: validCoupons }
  }
  componentDidMount() {
    this._didSelectedBar(this.state.selectBar)
    this.getCouponList()
    DeviceEventEmitter.addListener('onRefreshCoupon', () => {
      this.getCouponList()
    })
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  _didSelectedBar = key => {
    this.setState({
      selectBar: key,
      data: this._setCouponsInCurrentBar(key)
    })
  }
  _setCouponsInCurrentBar = key => {
    const { couponStore } = this.props
    return key === 'valid'
      ? couponStore.validPromoCodes.concat(couponStore.validCoupons)
      : key === 'used'
      ? couponStore.usedPromoCodes.concat(couponStore.usedCoupons)
      : couponStore.expiredPromoCodes.concat(couponStore.expiredCoupons)
  }
  getCouponList = () => {
    const { couponStore } = this.props
    const variables = { type: 'All' }
    QNetwork(SERVICE_TYPES.me.QUERY_ME_ALL_COUPON, variables, response => {
      const { me } = response.data
      couponStore.updateCoupon(me)
      const { selectBar } = this.state
      this.setState({
        data: this._setCouponsInCurrentBar(selectBar)
      })
    })
  }
  selectBarList = () => {
    let selectBarList = []
    const { filters } = this.props
    filters.map((item, index) => {
      for (var key in item) {
        selectBarList.push(
          <SelectBarButton
            name={key}
            onPress={this._didSelectedBar}
            filters={filters}
            selectBar={this.state.selectBar}
            key={index}
            index={index}
          />
        )
      }
    })
    return selectBarList
  }

  _refresh = () => {
    this.getCouponList()
  }

  nowUse = nowCoupon => {
    const { navigation } = this.props
    if (navigation.state.params && navigation.state.params.onSelect) {
      navigation.state.params.onSelect(nowCoupon)
      navigation.goBack()
    } else {
      let ids = null
      if (nowCoupon.subscription_type_ids) {
        ids = nowCoupon.subscription_type_ids
      }
      navigation.navigate('JoinMember', {
        nowCoupon,
        ids,
        refresh: this._refresh
      })
    }
  }

  itemImage = item => {
    return <CouponActions item={item} onPress={this.nowUse} />
  }

  couponItem = ({ item }) => {
    let usedTime, expiredTime
    isUsed = this.state.selectBar === 'used'
    if (isUsed) {
      // 券类型使用时间
      // used_at 优惠券  applied_at 加衣券
      if (item.used_at || item.applied_at) {
        usedTime = dateFns.format(
          item.used_at ? item.used_at : item.applied_at,
          'YYYY年MM月DD日'
        )
      }
    } else {
      // 券类型有效期时间
      // expiration_date 优惠券  expired_at 加衣券
      expiredTime = dateFns.format(
        item.expiration_date ? item.expiration_date : item.expired_at,
        'YYYY年MM月DD日'
      )
    }
    return (
      <View style={{ marginBottom: p2d(12) }}>
        <CouponItem
          usedTime={usedTime}
          expiredTime={expiredTime}
          item={item}
          onPress={this.itemImage}
          isUsed={isUsed}
        />
      </View>
    )
  }
  _keyExtractor = (item, index) => index.toString()

  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          style={styles.navigationBar}
          title={'优惠券'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.selectBarButtonView}>{this.selectBarList()}</View>
        <View style={styles.container}>
          {this.state.data.length > 0 ? (
            <FlatList
              data={this.state.data}
              keyExtractor={this._keyExtractor}
              renderItem={this.couponItem}
            />
          ) : (
            <NonConpon />
          )}
        </View>
      </SafeAreaView>
    )
  }
}

export class SelectBarButton extends PureComponent {
  constructor(props) {
    super(props)
  }

  reviseName = () => {
    const { name, onPress } = this.props
    onPress(name)
  }

  render() {
    const { index, name, filters, selectBar } = this.props
    return (
      <TouchableOpacity
        key={index}
        style={styles.selectBarButton}
        onPress={this.reviseName}>
        <View style={styles.selectBarButtonTextView}>
          <Text
            style={[
              selectBar === name
                ? styles.selectBarButtonText
                : styles.unSelectBarButtonText,
              styles.BarButtonText
            ]}>
            {filters[index][name]}
          </Text>
        </View>
        {selectBar === name ? (
          <View style={styles.selectBarButtonLine} />
        ) : null}
      </TouchableOpacity>
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
  selectBarButtonView: {
    flexDirection: 'row'
  },
  selectBarButton: {
    flexGrow: 1,
    alignItems: 'center'
  },
  selectBarButtonTextView: {
    height: p2d(22),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0,
    borderTopWidth: 0
  },
  BarButtonText: {
    fontSize: 14
  },
  selectBarButtonText: {
    color: '#EA5C39',
    fontSize: 14
  },
  unSelectBarButtonText: {
    color: '#999',
    fontSize: 14
  },
  selectBarButtonLine: {
    width: p2d(28),
    height: 2,
    backgroundColor: '#EA5C39',
    marginTop: p2d(4),
    marginBottom: p2d(2),
    borderRadius: 1
  }
})
