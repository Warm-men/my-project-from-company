import React, { PureComponent } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import Image from '../../../../image'

const animatedConfig = {
  first: [
    { toValue: 1, duration: 600, useNativeDriver: true },
    { toValue: 2, duration: 2000, delay: 0, useNativeDriver: true }
  ],
  last: [
    { toValue: 3, duration: 300, useNativeDriver: true },
    { toValue: 1, duration: 300, useNativeDriver: true },
    { toValue: 2, duration: 1500, useNativeDriver: true },
    { toValue: 2, delay: 500, useNativeDriver: true }
  ]
}

const valueConfig = {
  image1: { opacity: { inputRange: [0, 1, 2], outputRange: [1, 0, 0] } },
  image2: {
    opacity: { inputRange: [0, 1, 2, 3], outputRange: [0, 1, 1, 0] },
    scale: { inputRange: [0, 1, 2, 3], outputRange: [1.35, 1.35, 1, 1] }
  },
  image3: {
    opacity: { inputRange: [0, 1], outputRange: [0, 1] },
    transX: { inputRange: [0, 1, 2], outputRange: [-20, -20, 0] },
    scale: { inputRange: [0, 1, 2], outputRange: [1.2, 1.2, 1] }
  }
}

export default class Container extends PureComponent {
  constructor(props) {
    super(props)

    this.firstAnimated = new Animated.Value(0)
    this.lastAnimated = new Animated.Value(0)

    this.animationIndex = 0

    this.onLoadSecondImage = false
    this.onLoadThreeImage = false
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.animationIndex = 1
      this._firstAnimation()
    }, 1000)
  }

  componentWillUnmount() {
    this.didUnmount = true
    this.timer = null
  }

  _onLoadSecondImage = () => {
    this.onLoadSecondImage = true
    if (this.animationIndex === 1) {
      this._firstAnimation()
    }
  }
  _onLoadThreeImage = () => {
    this.onLoadThreeImage = true
    if (this.animationIndex === 2) {
      this._lastAnimation()
    }
  }

  _firstAnimation = () => {
    if (this.didUnmount || !this.onLoadSecondImage) return
    const array = animatedConfig.first.map(config => {
      return Animated.timing(this.firstAnimated, config)
    })
    const animated = Animated.sequence(array)
    animated.start(this._lastAnimation)
  }

  _lastAnimation = () => {
    this.animationIndex = 2

    if (this.didUnmount || !this.onLoadThreeImage) return
    const array = animatedConfig.last.map((config, index) => {
      if (index === 0) {
        return Animated.timing(this.firstAnimated, config)
      }
      return Animated.timing(this.lastAnimated, config)
    })

    const animated = Animated.sequence(array)
    animated.start(this._onFinishedAnimation)
  }

  _onFinishedAnimation = () => {
    const { onFinished } = this.props
    onFinished && onFinished()
  }

  render() {
    const { style, data } = this.props

    const opacity1 = this.firstAnimated.interpolate(valueConfig.image1.opacity)

    const opacity2 = this.firstAnimated.interpolate(valueConfig.image2.opacity)
    const scale2 = this.firstAnimated.interpolate(valueConfig.image2.scale)

    const opacity3 = this.lastAnimated.interpolate(valueConfig.image3.opacity)
    const transX = this.lastAnimated.interpolate(valueConfig.image3.transX)
    const scale3 = this.lastAnimated.interpolate(valueConfig.image3.scale)

    return (
      <View style={[styles.container, style]}>
        <Animated.View style={[styles.view, { opacity: opacity1 }]}>
          <Image style={style} source={{ uri: data[0] }} />
        </Animated.View>
        <Animated.View
          style={[
            styles.view,
            { opacity: opacity2, transform: [{ scale: scale2 }] }
          ]}>
          <Image
            style={style}
            source={{ uri: data[1] }}
            onLoad={this._onLoadSecondImage}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.view,
            {
              opacity: opacity3,
              transform: [{ translateX: transX }, { scale: scale3 }]
            }
          ]}>
          <Image
            style={style}
            source={{ uri: data[2] }}
            onLoad={this._onLoadThreeImage}
          />
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', position: 'relative' },
  view: { position: 'absolute' }
})
