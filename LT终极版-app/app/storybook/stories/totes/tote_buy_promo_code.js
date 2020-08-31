import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
export default class ToteBuyPromoCode extends PureComponent {
  render() {
    const {
      nowPromoCode,
      discount,
      userPromoCode,
      isPayEnd,
      promoCodesNum
    } = this.props
    return (
      <View style={styles.specificPriceView}>
        <Text style={styles.hui14}>
          优惠券{' '}
          {promoCodesNum > 1 && (
            <Text style={styles.hui12}>（有{promoCodesNum}张可用）</Text>
          )}
        </Text>
        <TouchableOpacity
          disabled={isPayEnd}
          onPress={userPromoCode}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          {nowPromoCode || isPayEnd ? (
            <Text style={styles.hei14}>-¥{discount}</Text>
          ) : (
            <Text style={styles.hui914}>
              {!!!promoCodesNum ? '无可用' : '未使用优惠券'}
            </Text>
          )}
          {!isPayEnd && (
            <Icon
              name="ios-arrow-forward"
              size={20}
              color="#ccc"
              style={{ marginLeft: 10 }}
            />
          )}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  hei14: {
    fontSize: 14,
    color: '#333'
  },
  hui14: {
    fontSize: 14,
    color: '#666'
  },
  hui12: {
    fontSize: 12,
    color: '#989898'
  },
  hui914: {
    fontSize: 14,
    color: '#999'
  },
  specificPriceView: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F2'
  }
})
