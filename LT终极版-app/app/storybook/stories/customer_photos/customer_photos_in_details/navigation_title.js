/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Image from '../../image'

export default class NavigationTitle extends PureComponent {
  render() {
    const { avatar, city, height_inches, nickname, roles } = this.props.customer
    const is_stylist = roles.find(item => {
      return item.type === 'stylist'
    })
    const image = avatar
      ? { uri: avatar }
      : require('../../../../assets/images/account/customer_avatar.png')
    return (
      <View style={styles.customer}>
        <View style={styles.avatar}>
          <Image circle={true} style={styles.avatar} source={image} />
          {is_stylist && (
            <Image
              style={styles.stylistTip}
              source={require('../../../../assets/images/customer_photos/stylist_tip.png')}
            />
          )}
        </View>
        <View style={styles.textView}>
          <Text
            numberOfLines={1}
            style={[styles.title, is_stylist && { color: '#E8A046' }]}>
            {nickname}
          </Text>
          <Text style={styles.subTitle}>
            {city}
            {height_inches && ` | ${height_inches}cm`}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  avatar: { width: 30, height: 30, borderRadius: 15 },
  stylistTip: {
    width: 14,
    height: 14,
    position: 'absolute',
    right: -2,
    bottom: -2
  },
  customer: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  textView: { marginLeft: 10, flex: 1, justifyContent: 'center' },
  title: { fontWeight: '500', fontSize: 13, color: '#242424', lineHeight: 20 },
  subTitle: { fontWeight: '400', fontSize: 10, color: '#989898' }
})
