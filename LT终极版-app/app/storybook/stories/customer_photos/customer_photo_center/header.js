import React, { PureComponent } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import { getCustomerName } from '../../../../src/expand/tool/userInfo_inspect'
import { inject, observer } from 'mobx-react'
import NumberTicker from '../ticker_num'
@inject('currentCustomerStore')
@observer
export default class CustomerPhotoCenterHeader extends PureComponent {
  _getUserInfo = () => {
    const { shippingAddress, style } = this.props.currentCustomerStore

    let city = '',
      height = '',
      line = ''
    if (shippingAddress) {
      city = shippingAddress.city
    }
    if (style.height_inches) {
      height = `${style.height_inches}cm`
    }
    if (city && height) {
      line = ' | '
    }
    return `${city}${line}${height}`
  }

  render() {
    const { popPanelShow, currentCustomerStore } = this.props
    const { avatarUrl, roles, nickname, telephone } = currentCustomerStore

    const is_stylist = roles.find(item => {
      return item.type === 'stylist'
    })

    const uri = avatarUrl
      ? { uri: avatarUrl }
      : require('../../../../assets/images/account/customer_avatar.png')

    const name = getCustomerName(nickname, telephone)
    const userInfo = this._getUserInfo()

    const {
      customer_photo_count,
      featured_count,
      liked_count
    } = currentCustomerStore.customer_photo
    return (
      <View>
        <Image
          style={styles.background}
          source={require('../../../../assets/images/customer_photos/customer_photo_center_banner.png')}
        />
        <View style={styles.headerViewCard}>
          <TouchableOpacity
            style={styles.headerImageView}
            onPress={popPanelShow}>
            <Image style={styles.headerImage} source={uri} />
            {!avatarUrl && (
              <View testID="camera_icon">
                <Image
                  style={styles.subscript}
                  source={require('../../../../assets/images/customer_photos/camera_icon.png')}
                />
              </View>
            )}
            {avatarUrl && is_stylist && (
              <View testID="stylist_tip">
                <Image
                  style={styles.subscript}
                  source={require('../../../../assets/images/customer_photos/stylist_tip.png')}
                />
              </View>
            )}
          </TouchableOpacity>
          {!avatarUrl && <Bubble testID="Bubble" />}
          <View style={styles.header}>
            <Text style={[styles.nickName, is_stylist && { color: '#E8A046' }]}>
              {name}
            </Text>
            <Text style={styles.userInfo}>{userInfo}</Text>
          </View>
          <View style={styles.itemsView}>
            <Column title={'晒单'} count={customer_photo_count} />
            <Column title={'精选'} count={featured_count} style={styles.line} />
            <Column title={'获赞'} count={liked_count} />
          </View>
        </View>
      </View>
    )
  }
}

export class Column extends PureComponent {
  _abbreviationNumber = () => {
    let number = this.props.count
    let value = number
    if (number > 999 && number < 9999) {
      value = (number / 1000).toFixed(1) + 'k'
    } else if (number > 9999) {
      value = (number / 10000).toFixed(1) + 'w'
    }
    return { number, value }
  }

  render() {
    const { style, title } = this.props
    const { value, number } = this._abbreviationNumber()
    return (
      <View style={[styles.column, style]}>
        {title === '获赞' && number >= 20 ? (
          <NumberTicker
            testID="NumberTicker"
            number={value}
            textSize={16}
            duration={1500}
            textStyle={styles.columnCount}
          />
        ) : (
          <Text style={styles.columnCount}>{value}</Text>
        )}
        <Text style={styles.columnTitle}>{title}</Text>
      </View>
    )
  }
}

class Bubble extends PureComponent {
  render() {
    return (
      <View style={styles.bubbleContainer}>
        <View style={styles.triangleView} />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>赶快来设置你的专属头像吧</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  background: { width: '100%' },
  headerViewCard: {
    alignSelf: 'center',
    width: p2d(343),
    paddingBottom: 14,
    backgroundColor: '#fff',
    marginTop: p2d(-114),
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.09,
    alignItems: 'center',
    elevation: 3
  },
  headerImageView: { marginTop: -29 },
  headerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff'
  },
  header: { marginTop: p2d(12), marginBottom: p2d(27), alignItems: 'center' },
  nickName: {
    fontSize: 20,
    color: '#242424',
    fontWeight: '600',
    marginBottom: 8
  },
  userInfo: { fontSize: 12, color: '#5e5e5e' },

  itemsView: { flexDirection: 'row' },
  column: { alignItems: 'center', flex: 1, height: 37 },
  columnCount: {
    fontSize: 16,
    color: '#242424',
    fontWeight: '600',
    lineHeight: 16
  },
  columnTitle: { fontSize: 12, color: '#999', marginTop: 6 },

  line: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#f3f3f3' },
  subscript: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20
  },
  bubble: {
    backgroundColor: '#242424',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 9
  },
  bubbleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3
  },
  triangleView: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderColor: 'transparent',
    borderBottomColor: '#242424'
  },
  bubbleText: { fontSize: 10, color: '#fff', lineHeight: 20 }
})
