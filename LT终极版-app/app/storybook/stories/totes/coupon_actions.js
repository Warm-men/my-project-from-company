import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'

export default class CouponActions extends PureComponent {
  onPress = () => {
    const { item, onPress } = this.props
    onPress(item)
  }

  focusReturn = () => {
    const { item, nowPromoCode } = this.props
    if (!nowPromoCode) {
      return false
    }
    if (item && item.code) {
      return item.code === nowPromoCode.code
    } else {
      return item.customer_coupon_id === nowPromoCode.customer_coupon_id
    }
  }

  render() {
    const { item, isUse } = this.props
    const { status, type } = item
    if (isUse) {
      const focus = this.focusReturn()
      let url = focus
        ? require('../../../assets/images/me_style/focus_button.png')
        : require('../../../assets/images/me_style/blur_button.png')
      return (
        <TouchableOpacity onPress={this.onPress} style={styles.actionsImage}>
          <Image source={url} resizeMode="cover" />
        </TouchableOpacity>
      )
    }
    if (type !== 'MemberPromoCode' && status === 'Valid') {
      return null
    } else if (status) {
      if (status === 'Valid') {
        return (
          <TouchableOpacity onPress={this.onPress} style={styles.nowUseButton}>
            <Text style={styles.nowUseButtonText}>去使用</Text>
          </TouchableOpacity>
        )
      } else {
        let url =
          status === 'Used'
            ? require('../../../assets/images/account/usedImg.png')
            : require('../../../assets/images/account/expired.png')
        return (
          <Image style={styles.tailImage} source={url} resizeMode="cover" />
        )
      }
    }
  }
}

const styles = StyleSheet.create({
  actionsImage: {
    width: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15
  },
  nowUseButton: {
    height: p2d(28),
    width: p2d(65),
    borderColor: '#EA5C39',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginRight: 15
  },
  nowUseButtonText: {
    fontSize: 11,
    color: '#EA5C39'
  },
  tailImage: {
    height: p2d(64),
    width: p2d(64)
  }
})
