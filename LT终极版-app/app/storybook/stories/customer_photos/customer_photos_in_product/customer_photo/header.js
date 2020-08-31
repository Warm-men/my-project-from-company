/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Image from '../../../image'
import LikeButton from '../../../../../src/containers/customer_photos/like'
import { l10nForSize } from '../../../../../src/expand/tool/product_l10n'

export default class Header extends PureComponent {
  _getSizeAbbreviation = () => {
    const { products } = this.props
    let sizeString
    if (products && products.length && products[0].product_size) {
      sizeString = products[0].product_size.size_abbreviation
    }
    return l10nForSize(sizeString)
  }
  render() {
    const { id, customer } = this.props
    const { avatar, city, height_inches, nickname, roles } = customer
    const is_stylist = roles.find(item => {
      return item.type === 'stylist'
    })
    const image = avatar
      ? { uri: avatar }
      : require('../../../../../assets/images/account/customer_avatar.png')
    const sizeString = this._getSizeAbbreviation()
    return (
      <View style={styles.container}>
        <View style={styles.customer}>
          <View style={styles.avatar}>
            <Image circle={true} style={styles.avatar} source={image} />
            {is_stylist && (
              <Image
                style={styles.stylistTip}
                source={require('../../../../../assets/images/customer_photos/stylist_tip.png')}
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
              {!!sizeString && ` | ${sizeString}`}
            </Text>
          </View>
        </View>
        <LikeButton id={id} />
      </View>
    )
  }
}

Header.defaultProps = {
  id: 0,
  liked: false,
  customer: {
    avatar: '头像地址',
    nickname: '昵称',
    city: '城市',
    height_inches: 0
  },
  products: []
}

Header.propTypes = {
  customer: PropTypes.object,
  id: PropTypes.number,
  liked: PropTypes.bool,
  products: PropTypes.array
}

const styles = StyleSheet.create({
  container: {
    height: 68,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15
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
    fontWeight: '400',
    fontSize: 15,
    color: '#242424',
    lineHeight: 24
  },
  subTitle: { fontWeight: '400', fontSize: 12, color: '#989898' },
  shareIcon: { width: 20, height: 20 }
})
