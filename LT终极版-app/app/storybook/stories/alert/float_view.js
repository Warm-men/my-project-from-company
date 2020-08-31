/* @flow */

import React, { PureComponent } from 'react'
import { StyleSheet, Animated, TouchableOpacity } from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'

export default class FloatView extends PureComponent {
  _didSelectedFloat = () => {
    const { didSelectedFloat, data } = this.props
    didSelectedFloat && didSelectedFloat(data)
  }
  render() {
    const { data, style } = this.props
    return (
      <Animated.View style={[styles.floatView, style]}>
        <TouchableOpacity onPress={this._didSelectedFloat}>
          <Image style={styles.image} source={{ uri: data.logo }} />
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  floatView: {
    position: 'absolute',
    right: p2d(16),
    bottom: p2d(24),
    width: p2d(60),
    height: p2d(60),
    zIndex: 1
  },
  image: {
    width: p2d(60),
    height: p2d(60)
  }
})
