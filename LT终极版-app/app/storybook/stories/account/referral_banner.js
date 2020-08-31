import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import Image from '../image'

export default class ReferralBanner extends PureComponent {
  returnUrl = () => {
    const { referralBanner, column } = this.props
    if (referralBanner) {
      if (column === 'account') {
        return {
          uri: referralBanner.referred_program_entry_banner_url
        }
      } else {
        return {
          uri: referralBanner.referral_program_banner_url
        }
      }
    } else {
      if (column === 'account') {
        return require('../../../assets/images/account/referralStrip.png')
      } else {
        return require('../../../assets/images/account/referralBanner.png')
      }
    }
  }

  returnStyle = () => {
    const { referralBanner, column } = this.props
    if (referralBanner) {
      if (column === 'account') {
        const {
          referral_entry_banner_height,
          referral_entry_banner_width
        } = referralBanner
        let bannerwidth = p2d(335)
        let bannerHeight =
          (referral_entry_banner_height / referral_entry_banner_width) *
          bannerwidth
        return {
          width: bannerwidth,
          height: bannerHeight
        }
      } else {
        const { referral_banner_height, referral_banner_width } = referralBanner
        let bannerwidth = Dimensions.get('window').width
        let bannerHeight =
          (referral_banner_height / referral_banner_width) * bannerwidth
        return {
          width: bannerwidth,
          height: bannerHeight
        }
      }
    } else {
      if (column === 'account') {
        return styles.referralImage
      } else {
        return styles.bannerImageView
      }
    }
  }

  render() {
    const { onPress, column, disabled } = this.props
    const url = this.returnUrl()
    const referralStyle = this.returnStyle()
    return (
      <TouchableOpacity
        style={column === 'account' && styles.referralView}
        onPress={onPress}
        disabled={disabled}>
        <Image style={referralStyle} source={url} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  referralView: {
    paddingLeft: p2d(20),
    paddingRight: p2d(20),
    paddingBottom: p2d(24),
    backgroundColor: '#FFF'
  },
  referralImage: {
    width: p2d(335),
    height: p2d(100)
  },
  bannerImageView: {
    width: p2d(375),
    height: p2d(231)
  }
})
