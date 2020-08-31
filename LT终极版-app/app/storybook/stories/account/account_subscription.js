/* @flow */

import React, { PureComponent } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
export default class SubscriptionBar extends PureComponent {
  getStatusMessage = () => {
    const {
      isValidSubscriber,
      status,
      promoCode,
      subscriptionDate
    } = this.props

    var text = ''
    if (isValidSubscriber || status === 'active') {
      text = `会员有效期至${subscriptionDate}`
    } else {
      if (status === 'cancelled') {
        if (promoCode === 'LTCN_FREE_TOTE') {
          text = '你的体验已结束'
        } else if (promoCode === 'LTCN_FREE_TOTE_79') {
          text = '你的7天体验会员已结束'
        } else {
          text = '你的会员已过期'
        }
      }
    }
    return text
  }
  render() {
    const { joinMember, promoCode } = this.props
    const statusMessage = this.getStatusMessage()
    return (
      <View style={styles.dateView}>
        <Text style={styles.dateText}>{statusMessage}</Text>
        <TouchableOpacity style={styles.payButton} onPress={joinMember}>
          <Text style={styles.renewText}>
            {promoCode === 'LTCN_FREE_TOTE' || promoCode === 'LTCN_FREE_TOTE_79'
              ? '加入会员'
              : '立即续费'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dateView: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: 7
  },
  dateText: {
    paddingLeft: 20,
    fontWeight: '600',
    fontSize: 12,
    color: '#333'
  },
  renewText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14
  },
  payButton: {
    width: 90,
    height: 32,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
