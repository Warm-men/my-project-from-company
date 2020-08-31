/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Image from '../../../image'

export default class UserInfo extends PureComponent {
  render() {
    const { customer, subscriberDescrition } = this.props
    const { avatar, city, nickname, occupation } = customer
    const image = avatar
      ? { uri: avatar }
      : require('../../../../../assets/images/account/customer_avatar.png')
    return (
      <View style={styles.container}>
        <View style={styles.customer}>
          <View style={styles.avatar}>
            <Image circle={true} style={styles.avatar} source={image} />
          </View>
          <View style={styles.textView}>
            <Text style={styles.title}>{nickname}</Text>
            <Text style={styles.subTitle}>
              {city}
              {occupation && `  |  ${occupation}`}
              {`  |  ${subscriberDescrition}`}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

UserInfo.defaultProps = {
  customer: {
    avatar: '头像地址',
    nickname: '昵称',
    city: '城市',
    occupation: '全职妈妈'
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  customer: {
    flexDirection: 'row',
    flex: 1
  },
  textView: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: '#242424',
    lineHeight: 24
  },
  subTitle: {
    fontSize: 12,
    color: '#989898'
  },
  shareIcon: {
    width: 20,
    height: 20,
    marginRight: 3
  }
})
