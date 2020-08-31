/* @flow */

import React, { PureComponent } from 'react'
import { TouchableOpacity, Animated, Easing, Image } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'

export default class FreeServiceBanner extends PureComponent {
  constructor(props) {
    super(props)
    this.animatedOpacityValue = new Animated.Value(0)
    this.animatedHeightValue = new Animated.Value(0)
  }

  componentDidMount() {
    this.startAnimated()
  }
  startAnimated = () => {
    Animated.parallel([
      Animated.timing(this.animatedOpacityValue, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear
      }),
      Animated.timing(this.animatedHeightValue, {
        toValue: p2d(45),
        duration: 200,
        easing: Easing.linear
      })
    ]).start()
  }
  render() {
    const { onPress } = this.props
    return (
      <Animated.View
        style={{
          height: this.animatedHeightValue,
          opacity: this.animatedOpacityValue
        }}>
        <TouchableOpacity onPress={onPress}>
          <Image
            style={{ width: p2d(375), height: p2d(45) }}
            source={require('../../../../assets/images/product_detail/product_free_service.png')}
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }
}
