import React, { PureComponent } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
export default class CouponAndPromoCode extends PureComponent {
  render() {
    const { balance, promoCode, coupon, customerBonus } = this.props
    return (
      <View style={styles.view}>
        <TouchableOpacity
          onPress={customerBonus}
          style={[
            styles.containerView,
            { borderRightWidth: 1, borderRightColor: '#F3F3F3' }
          ]}>
          <View style={styles.overDraft}>
            <Text style={styles.numText}>{balance}</Text>
            {balance < 0 && (
              <View style={styles.remindMessageContainer}>
                <Text style={styles.remindMessage}>有欠款</Text>
              </View>
            )}
          </View>
          <Text style={styles.titleText}>信用账户(元)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={coupon} style={styles.containerView}>
          <Text style={styles.numText}>{promoCode}</Text>
          <Text style={styles.titleText}>优惠券(张)</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    height: p2d(55),
    paddingLeft: p2d(20),
    paddingRight: p2d(20),
    paddingTop: p2d(-8),
    paddingBottom: p2d(16),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  containerView: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    height: p2d(55)
  },
  numText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700'
  },
  titleText: {
    fontSize: 12,
    color: '#666',
    marginTop: p2d(6)
  },
  remindMessageContainer: {
    position: 'absolute',
    right: -30,
    top: 0,
    backgroundColor: '#E85C40',
    borderRadius: 7,
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  overDraft: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  remindMessage: {
    color: '#FFFFFF',
    fontSize: 9
  }
})
