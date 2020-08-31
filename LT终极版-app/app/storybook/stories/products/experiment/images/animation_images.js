import React, { PureComponent } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import Image from '../../../image'

import { One, Two, Three } from './animation_types'

const ENUM_ANIMATION_TYPE = {
  ONE: 1, // 衣服
  TWO: 2, // 饰品
  THREE: 3 // 饰品 两图
}

const getCurrentConfig = (imagas, category) => {
  const { accessory, name } = category

  const first = imagas[0].full_url

  if (name === 'scarves' || name === 'hats' || name === 'glasses') {
    // 帽子、眼镜、围巾   FR、第一张OM
    const array = [first]
    const om = imagas.find(i => i.full_url.indexOf('OM') !== -1)
    if (om) array.push(om.full_url)

    return {
      array,
      isOk: array.length === 2 && imagas.length > 1,
      type: ENUM_ANIMATION_TYPE.THREE
    }
  } else {
    // 顺序：FR、CU、第一张OM；缺少后两张图的情况下，不播放。
    const array = [first]
    const cu = imagas.find(i => i.full_url.indexOf('_CU') !== -1)
    if (cu) array.push(cu.full_url)
    const last = imagas[imagas.length - 1].full_url
    array.push(last)

    return {
      array,
      isOk: array.length === 3 && imagas.length > 2,
      type: accessory ? ENUM_ANIMATION_TYPE.TWO : ENUM_ANIMATION_TYPE.ONE
    }
  }
}

const animatedConfig = { toValue: 2, duration: 3000, useNativeDriver: true }
const valueConfig = { inputRange: [0, 1, 2], outputRange: [1, 0.3, 1] }

export default class Container extends PureComponent {
  constructor(props) {
    super(props)
    const { data, category } = props

    this.startAnimated = new Animated.Value(0)

    const { isOk, array, type } = getCurrentConfig(data, category)

    this.isOk = isOk
    this.type = type
    this.array = array
    this.image = array[0]
  }

  componentDidMount() {
    if (this.isOk) {
      this._startAnimation()
    }
  }

  componentWillUnmount() {
    this.loopAnimation && this.loopAnimation.stop()
  }

  _startAnimation = () => {
    const animated = Animated.timing(this.startAnimated, animatedConfig)
    this.loopAnimation = Animated.loop(animated)
    this.loopAnimation.start()
  }

  _onFinishedAnimation = () => {
    this.loopAnimation && this.loopAnimation.stop()
  }

  render() {
    const { style, showToteSlot } = this.props

    if (!this.isOk) {
      return <Image style={style} source={{ uri: this.image }} />
    }

    const opacity = this.startAnimated.interpolate(valueConfig)

    return (
      <View style={[styles.container, style]}>
        {this.type === ENUM_ANIMATION_TYPE.ONE ? (
          <One
            data={this.array}
            style={style}
            onFinished={this._onFinishedAnimation}
          />
        ) : null}
        {this.type === ENUM_ANIMATION_TYPE.TWO ? (
          <Two
            data={this.array}
            style={style}
            onFinished={this._onFinishedAnimation}
          />
        ) : null}
        {this.type === ENUM_ANIMATION_TYPE.THREE ? (
          <Three
            data={this.array}
            style={style}
            onFinished={this._onFinishedAnimation}
          />
        ) : null}
        <Animated.View
          style={[
            styles.spinner,
            { opacity },
            showToteSlot && styles.spinnerPosition
          ]}>
          <Image
            source={require('../../../../../assets/images/product_list/video.png')}
          />
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', position: 'relative' },
  spinner: { width: 30, height: 30, position: 'absolute', left: 5, top: 10 },
  spinnerPosition: { top: 28, left: 18 }
})
