/* @flow */

import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../image'

export default class ScrollToTopButton extends PureComponent {
  _scrollToTop = () => {
    this.props.component._component.scrollToOffset({
      x: 0,
      y: 0,
      animated: true
    })
  }
  render() {
    return (
      <TouchableOpacity
        style={this.props.style || styles.container}
        activeOpacity={0.8}
        onPress={this._scrollToTop}>
        <Image
          source={require('../../../assets/images/product_list/back_to_top.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    zIndex: 2,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonImage: { height: 56, width: 56 }
})
