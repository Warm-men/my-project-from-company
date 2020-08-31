/* @flow */

import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Image from '../../image'
export default class FloatHover extends PureComponent {
  _onClick = () => {
    const { navigation, data } = this.props
    navigation.navigate('WebPage', {
      uri: data.url,
      hideShareButton: true
    })
  }
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this._onClick}>
        <Image
          style={styles.image}
          source={require('../../../../assets/images/home/float_hover_b.gif')}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 16
  },
  image: {
    width: 60,
    height: 60
  }
})
