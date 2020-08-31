import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../../../storybook/stories/image'
import p2d from '../../../../src/expand/tool/p2d'

export default class FreeServiceBanner extends PureComponent {
  render() {
    const {
      autoRenewDiscount,
      autoRenewDiscountAmount,
      isSelected,
      didSelectedFreeService
    } = this.props
    const url = isSelected
      ? require('../../../../assets/images/me_style/focus_button.png')
      : require('../../../../assets/images/me_style/blur_button.png')
    if (!!autoRenewDiscountAmount) {
      // 有免密开通提醒
      return (
        <TouchableOpacity
          style={styles.container}
          onPress={didSelectedFreeService}>
          <Image source={url} style={styles.selectedIcon} />
          <View>
            <Text style={styles.text}>
              开通自动续费，
              <Text style={{ color: '#d7a33f' }}>
                每月直减¥{autoRenewDiscountAmount}
              </Text>
            </Text>
            <Text style={styles.smallText}>到期自动续费，可随时关闭</Text>
          </View>
        </TouchableOpacity>
      )
    } else if (!!autoRenewDiscount) {
      // 有开通免密优惠提醒
      return (
        <View style={styles.container}>
          <Text style={styles.openingText}>
            已开通自动续费，已减¥{autoRenewDiscount}
          </Text>
        </View>
      )
    } else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: p2d(18),
    paddingRight: p2d(15),
    paddingLeft: p2d(5),
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: '#d9d9d9',
    paddingVertical: 16,
    marginTop: -13,
    backgroundColor: '#fdfbf6',
    marginBottom: 10
  },
  selectedIcon: {
    marginHorizontal: p2d(8),
    width: 20,
    height: 20
  },
  text: {
    fontSize: 14,
    color: '#242424',
    fontWeight: '400'
  },
  smallText: {
    fontSize: 12,
    color: '#989898',
    marginTop: 7,
    fontWeight: '400'
  },
  openingText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5e5e5e',
    paddingLeft: 10
  },
  button: {
    height: 26,
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EA5C39',
    borderRadius: 2
  },
  openContractText: {
    fontSize: 13,
    color: '#EA5C39'
  },
  value: {
    fontSize: 14,
    color: '#EA5C39'
  }
})
