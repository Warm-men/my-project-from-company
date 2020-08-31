/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icons from 'react-native-vector-icons/Ionicons'
import { isValidCustomerName } from '../../../../src/expand/tool/userInfo_inspect'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Image from '../../image'

class ToteReturnExpressInfoCardBooking extends PureComponent {
  render() {
    const { title, description, hasBottomLine, message, onPress } = this.props
    return (
      <View style={styles.container}>
        {!!message ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.cardView, hasBottomLine && styles.hasBottomLine]}>
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.cardRightView}>
              <Text
                style={[
                  styles.descriptionText,
                  !!message && styles.messageText
                ]}>
                {message ? message : description}
              </Text>
              <Icons
                style={styles.IconsArrowRight}
                name={'ios-arrow-forward'}
                size={15}
                color={'#333'}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.cardView, hasBottomLine && styles.hasBottomLine]}>
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.cardRightView}>
              <Text style={[styles.descriptionText]}>{description}</Text>
              <Icons
                style={styles.IconsArrowRight}
                name={'ios-arrow-forward'}
                size={15}
                color={'#333'}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

class ToteReturnExpressInfoCardAddress extends PureComponent {
  render() {
    const { title, description, hasBottomLine, message, onPress } = this.props
    const _isValidCustomerName =
      message && message.full_name && isValidCustomerName(message.full_name)
    return (
      <View style={[styles.container, styles.containerBottomBorder]}>
        {!!message ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.cardView, hasBottomLine && styles.hasBottomLine]}>
            <View style={styles.addressViewLeft}>
              <View style={styles.flexDirection}>
                <Text style={styles.fullName}>{message.full_name}</Text>
                <Text style={styles.fullName}>{message.telephone}</Text>
              </View>
              <Text style={styles.fullAddress}>
                {message.state}
                {message.city}
                {message.district}
                {message.address_1}
              </Text>
              {!_isValidCustomerName && (
                <View style={styles.badNameView}>
                  <EvilIcons
                    name={'exclamation'}
                    size={22}
                    style={styles.badNameIcon}
                    color={'#E85C40'}
                  />
                  <Text style={styles.badNameText}>
                    {'根据国家主管部门要求实行实名收寄，请填写真实姓名'}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.justifyContent}>
              <Icons
                style={styles.IconsArrowRight}
                name={'ios-arrow-forward'}
                size={15}
                color={'#333'}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.cardView, hasBottomLine && styles.hasBottomLine]}>
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.cardRightView}>
              <Text style={[styles.descriptionText]}>{description}</Text>
              <Icons
                style={styles.IconsArrowRight}
                name={'ios-arrow-forward'}
                size={15}
                color={'#333'}
              />
            </View>
          </TouchableOpacity>
        )}
        <Image
          source={require('../../../../assets/images/totes/address_line.png')}
          style={styles.addressLine}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerBottomBorder: {
    borderBottomWidth: 7,
    borderBottomColor: '#F7F7F7'
  },
  cardView: {
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 24,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  titleText: {
    fontSize: 15,
    color: '#333'
  },
  hasBottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2'
  },
  descriptionText: {
    marginRight: 12,
    color: '#CCC',
    fontSize: 14
  },
  messageText: {
    marginRight: 12,
    color: '#666'
  },
  cardRightView: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  IconsArrowRight: {
    color: '#CCC'
  },
  addressViewLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15
  },
  flexDirection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  fullName: {
    fontSize: 15,
    color: '#333',
    marginRight: 15
  },
  telephone: {
    fontSize: 14,
    color: '#333'
  },
  fullAddress: {
    marginTop: 10,
    fontSize: 13,
    color: '#999',
    lineHeight: 20
  },
  justifyContent: {
    justifyContent: 'center'
  },
  badNameView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  badNameIcon: {
    marginTop: 2,
    marginRight: 2
  },
  badNameText: {
    color: '#E85C40',
    fontSize: 12
  },
  addressLine: {
    flex: 1,
    marginHorizontal: 2
  }
})

export { ToteReturnExpressInfoCardBooking, ToteReturnExpressInfoCardAddress }
