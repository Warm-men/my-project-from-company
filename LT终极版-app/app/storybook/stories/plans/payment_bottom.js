/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'

export default class PaymentBottom extends PureComponent {
  returnTitle = () => {
    const { isSubscriber, subscriptionTime } = this.props
    return isSubscriber
      ? `有效期至${subscriptionTime}`
      : `会员期从衣箱寄出后开始计算`
  }

  render() {
    const { selectPayType, price } = this.props
    return (
      <View style={styles.payButtonView}>
        <View style={{ margin: 20, flex: 1 }}>
          <View style={styles.priceView}>
            <Text style={styles.priceLeftText}>应付: </Text>
            <Text style={styles.priceRightText}>￥{price}</Text>
          </View>
          <Text style={styles.subscriptionTime}>{this.returnTitle()}</Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={selectPayType}>
          <Text style={styles.payButtonTitle}>立即支付</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  payButtonView: {
    width: '100%',
    height: 64,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  priceView: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  priceLeftText: {
    fontSize: 14
  },
  priceRightText: {
    color: '#EA5C39',
    fontSize: 16
  },
  subscriptionTime: {
    fontSize: 10,
    height: 12,
    color: '#C4C4C4'
  },
  payButton: {
    width: p2d(180),
    height: 48,
    backgroundColor: '#EA5C39',
    borderRadius: 2,
    marginRight: 15,
    justifyContent: 'center'
  },
  payButtonTitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FFFFFF'
  }
})
