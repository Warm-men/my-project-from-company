/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'
import dateFns from 'date-fns'

export default class ReferralItem extends PureComponent {
  render() {
    const { item } = this.props

    const time = dateFns.format(
      new Date(item.friend_subscription_started_on),
      'YYYY.MM.DD'
    )
    const uri = item.avatar_url
      ? { uri: item.avatar_url }
      : require('../../../assets/images/account/customer_avatar.png')
    return (
      <View style={styles.container}>
        <View
          style={{
            width: p2d(102),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
          <Image
            style={{
              height: p2d(40),
              width: p2d(40),
              borderRadius: p2d(20),
              marginRight: p2d(10)
            }}
            source={uri}
          />
          <Text
            numberOfLines={1}
            style={[styles.fontS14, styles.color6, { width: p2d(52) }]}>
            {item.nickname}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          style={[
            styles.fontS14,
            styles.color6,
            { width: p2d(142), textAlign: 'center' }
          ]}>
          {time}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.fontS14, styles.color6, { width: p2d(86) }]}>
          {item.redeemed_at ? '已获得奖励' : '等待发放奖励'}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%'
  },
  fontS12: {
    fontSize: p2d(12)
  },
  fontS14: {
    fontSize: p2d(14)
  },
  fontS16: {
    fontSize: p2d(16)
  },
  fontS18: {
    fontSize: p2d(18)
  },
  color3: {
    color: '#333'
  },
  color6: {
    color: '#666'
  }
})
