/* @flow */

import React, { PureComponent } from 'react'
import { Animated } from 'react-native'
import Image from '../../image'

export default class AddToCartAnimated extends PureComponent {
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
  }
  componentDidMount() {
    this._startAnimated()
  }
  _startAnimated() {
    Animated.sequence([
      Animated.spring(this.animatedValue, { toValue: 1, friction: 30 }),
      Animated.timing(this.animatedValue, { toValue: 2, duration: 300 })
    ]).start(() => {
      const { finishedAnimated } = this.props
      finishedAnimated && finishedAnimated()
    })
  }
  render() {
    const { height, width, imageUrl } = this.props
    const paddingLeft = (width - 60) / 2
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: this.animatedValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, paddingLeft, 100]
          }),
          top: this.animatedValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, paddingLeft, height - 100]
          }),
          width: this.animatedValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [width, 60, 40]
          }),
          height: this.animatedValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [width, 60, 40]
          }),
          overflow: 'hidden',
          opacity: this.animatedValue.interpolate({
            inputRange: [0, 1, 1.8, 2],
            outputRange: [0, 1, 0.9, 0]
          }),
          borderRadius: this.animatedValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, width / 2, 60]
          })
        }}>
        <Image style={{ flex: 1 }} source={{ uri: imageUrl }} />
      </Animated.View>
    )
  }
}
