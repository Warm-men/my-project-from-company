/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Image from '../../image'

export default class UserInfo extends PureComponent {
  render() {
    const { shareCustomerPhoto, customer } = this.props
    const { avatar, city, height_inches, nickname, roles } = customer
    const is_stylist = roles.find(item => {
      return item.type === 'stylist'
    })
    const image = avatar
      ? { uri: avatar }
      : require('../../../../assets/images/account/customer_avatar.png')
    return (
      <View style={styles.container}>
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
            <Text style={[styles.title, is_stylist && { color: '#E8A046' }]}>
              {nickname}
            </Text>
            <Text style={styles.subTitle}>
              {city}
              {height_inches && ` | ${height_inches}cm`}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={shareCustomerPhoto}>
          <Image
            style={styles.shareIcon}
            source={require('../../../../assets/images/product_detail/share.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

UserInfo.defaultProps = {
  customer: {
    avatar: '头像地址',
    nickname: '昵称',
    city: '城市',
    height_inches: 0
  }
}

UserInfo.propTypes = {
  customer: PropTypes.object
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 4
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  stylistTip: {
    width: 18,
    height: 18,
    position: 'absolute',
    right: -2,
    bottom: -2
  },
  customer: { flexDirection: 'row', flex: 1 },
  textView: { marginLeft: 10, flex: 1, justifyContent: 'center' },
  title: {
    fontWeight: '500',
    fontSize: 15,
    color: '#242424',
    lineHeight: 24
  },
  subTitle: { fontWeight: '400', fontSize: 12, color: '#989898' },
  shareIcon: { width: 20, height: 20, marginRight: 3 }
})
