/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import { NonMemberCommonTitle } from '../titleView'

export default class ActivityBanner extends PureComponent {
  render() {
    const { extraData, imageStyle, titleText, bannerOnPress } = this.props
    return (
      <View style={styles.activityBannerView}>
        <NonMemberCommonTitle title={titleText} />
        <View style={styles.imageView}>
          {extraData &&
            extraData.map((item, index) => {
              return (
                <BannerItem
                  item={item}
                  key={index}
                  bannerOnPress={bannerOnPress}
                  imageStyle={imageStyle}
                  link={item.link}
                />
              )
            })}
        </View>
      </View>
    )
  }
}

class BannerItem extends PureComponent {
  _onPress = () => {
    const { bannerOnPress, link } = this.props
    bannerOnPress && bannerOnPress(link)
  }
  render() {
    const { item, imageStyle } = this.props
    return (
      <TouchableOpacity
        onPress={this._onPress}
        delayPressIn={100}
        activeOpacity={0.85}>
        <Image
          description={'Activity-' + item.logo}
          source={{ uri: item.logo }}
          style={imageStyle}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  activityBannerView: {
    marginTop: p2d(34)
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
