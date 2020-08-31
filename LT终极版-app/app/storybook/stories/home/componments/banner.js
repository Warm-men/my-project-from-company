/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../../image'
import Carousel from 'react-native-letote-looped-carousel'
export default class Banner extends PureComponent {
  _bannerOnPress = link => {
    this.props.bannerOnPress(link)
  }
  render() {
    const { banners, style, wrapStyle } = this.props
    return (
      <View style={[styles.container, wrapStyle]}>
        {!!banners.length && (
          <View>
            <Carousel
              delay={5000}
              autoplay
              showIndicator={banners.length > 1}
              indicatorCircleWidth={4}
              indicatorDefaultColor={'rgba(255,255,255,0.5)'}
              style={style}
              indicatorActiveColor={'#FFFFFF'}>
              {banners.map((item, index) => {
                return (
                  <BannerItem
                    bannerOnPress={this._bannerOnPress}
                    link={item.link}
                    item={item}
                    style={style}
                    key={index.toString()}
                  />
                )
              })}
            </Carousel>
          </View>
        )}
      </View>
    )
  }
}

class BannerItem extends PureComponent {
  _bannerOnPress = () => {
    const { link, bannerOnPress } = this.props
    bannerOnPress(link)
  }
  render() {
    const { item, style } = this.props
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        delayPressIn={100}
        onPress={this._bannerOnPress}>
        <Image
          description={'Banner' + item.logo}
          style={style}
          source={{ uri: item.logo }}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
