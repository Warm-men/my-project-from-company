import React, { PureComponent } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import Image from '../../../../image'

const config = { toValue: 1, duration: 1000, useNativeDriver: true }
const valueConfig = {
  image1: { inputRange: [0, 1], outputRange: [1, 0] },
  image2: { inputRange: [0, 1], outputRange: [0, 1] }
}

export default class Container extends PureComponent {
  constructor(props) {
    super(props)

    this.animated = new Animated.Value(0)

    this.animationIndex = 0

    this.onLoadSecondImage = false
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this._startAnimation()
    }, 1000)
  }

  componentWillUnmount() {
    this.didUnmount = true
    this.timer = null
  }

  _onLoadSecondImage = () => {
    this.onLoadSecondImage = true
    this._startAnimation()
  }

  _startAnimation = () => {
    if (this.didUnmount || !this.onLoadSecondImage) return
    Animated.timing(this.animated, config).start(this._onFinishedAnimation)
  }

  _onFinishedAnimation = () => {
    const { onFinished } = this.props
    onFinished && onFinished()
  }

  render() {
    const { style, data } = this.props

    return (
      <View style={[styles.container, style]}>
        <Animated.View
          style={[
            styles.view,
            { opacity: this.animated.interpolate(valueConfig.image1) }
          ]}>
          <Image style={style} source={{ uri: data[0] }} />
        </Animated.View>
        <Animated.View
          style={[
            styles.view,
            { opacity: this.animated.interpolate(valueConfig.image2) }
          ]}>
          <Image
            style={style}
            source={{ uri: data[1] }}
            onLoad={this._onLoadSecondImage}
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
