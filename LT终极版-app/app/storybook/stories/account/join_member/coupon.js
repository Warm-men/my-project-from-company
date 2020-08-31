import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default class CouponAutoDeduct extends Component {
  render() {
    const { style, tempCoupon, selectCoupon } = this.props
    const buttonTitle = tempCoupon
      ? '-￥' + tempCoupon.discount_amount
      : '暂无可用优惠券'
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.text}>优惠券</Text>
        <TouchableOpacity style={styles.buttonView} onPress={selectCoupon}>
          <Text style={styles.buttonTitle}>{buttonTitle}</Text>
          <Icon name="ios-arrow-forward" size={18} color="#ccc" />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 48
  },
  text: { fontSize: 14, color: '#242424', paddingLeft: 10 },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  buttonTitle: { fontSize: 14, color: '#EA5C39', marginRight: 5 }
})
