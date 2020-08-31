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
import p2d from '../../expand/tool/p2d'
import CouponItem from '../../../storybook/stories/account/coupon_item'
import CouponActions from '../../../storybook/stories/totes/coupon_actions'
import NonConpon from '../../../storybook/stories/account/nonConpon'
export default class UsePromoCodeContainer extends Component {
  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.state = {
      data: this.mergePromoCodes(),
      nowPromoCode: params && params.nowPromoCode ? params.nowPromoCode : null
    }
    this.index = 0
  }

  mergePromoCodes = () => {
    const {
      validPromoCodes,
      invalidPromoCodes,
      nowPromoCode
    } = this.props.navigation.state.params
    let data = [],
      newInvalidPromoCodes = [],
      newValidPromoCodes = validPromoCodes
    newInvalidPromoCodes = invalidPromoCodes.map(item => {
      item.disabled = true
      return item
    })
    if (nowPromoCode) {
      newValidPromoCodes = validPromoCodes.filter(item => {
        return item.code !== nowPromoCode.code
      })
      newValidPromoCodes.unshift(nowPromoCode)
    }
    data.push(...newValidPromoCodes, ...newInvalidPromoCodes)
    return data
  }

  setPromoCode = nowPromoCode => {
    this.setState({ nowPromoCode })
  }

  nowUse = () => {
    const { nowPromoCode } = this.state
    const { navigation } = this.props
    navigation.state.params.onSelect(nowPromoCode)
    navigation.goBack()
  }

  notUse = () => {
    const { navigation } = this.props
    navigation.state.params.onSelect(null)
    navigation.goBack()
  }

  couponItem = ({ item }) => {
    const expiredTime = dateFns.format(item.expiration_date, 'YYYY年MM月DD日')
    const { hideDiffAmount } = this.props.navigation.state.params
    return (
      <View style={{ marginBottom: p2d(12) }}>
        <CouponItem
          item={{ ...item }}
          onPress={this.itemImage}
          expiredTime={expiredTime}
          hideDiffAmount={hideDiffAmount}
        />
      </View>
    )
  }

  itemImage = item => {
    if (item.disabled) {
      return null
    }
    return (
      <CouponActions
        item={item}
        isUse={true}
        nowPromoCode={this.state.nowPromoCode}
        onPress={this.setPromoCode}
      />
    )
  }

  _keyExtractor = (item, index) => index.toString()

  _goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    const { nowPromoCode, data } = this.state
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          style={styles.navigationBar}
          title={'使用优惠券'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.container}>
          {data.length ? (
            <FlatList
              extraData={nowPromoCode}
              data={data}
              keyExtractor={this._keyExtractor}
              renderItem={this.couponItem}
            />
          ) : (
            <NonConpon />
          )}
        </View>
        {!!nowPromoCode && (
          <View style={styles.bottomView}>
            <TouchableOpacity
              style={[styles.bottomLeftButton]}
              onPress={this.notUse}>
              <Text style={styles.buttonLeftText}>不使用优惠券</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton} onPress={this.nowUse}>
              <Text style={styles.buttonText}>确定使用</Text>
            </TouchableOpacity>
          </View>
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
  bottomView: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between'
  },
  bottomLeftButton: {
    height: p2d(40),
    width: p2d(165),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  buttonLeftText: {
    fontSize: 14,
    color: '#000'
  },
  bottomButton: {
    height: p2d(40),
    width: p2d(165),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EA5C39'
  },
  buttonText: {
    fontSize: 14,
    color: '#fff'
  }
})
