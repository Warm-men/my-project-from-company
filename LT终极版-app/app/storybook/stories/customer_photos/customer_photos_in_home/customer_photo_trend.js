/* @flow */

import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import Image from '../../image'

export default class ParticipateButton extends PureComponent {
  _onClick = () => {
    const { onClick } = this.props
    onClick && onClick()
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={this._onClick}>
        <Image
          source={require('../../../../assets/images/home/customer_photo_like_banner.png')}
          style={styles.banner}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 11,
    left: p2d(15)
  },
  banner: {
    width: p2d(345),
    height: p2d(50)
  }
})
