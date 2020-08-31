/* @flow */

import React, { PureComponent } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native'
import Image from '../image'

const { height } = Dimensions.get('window')
export default class ProductSizeFilterButton extends PureComponent {
  render() {
    const { toggleProductSizeFilter, bottunState } = this.props
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={toggleProductSizeFilter}>
        {bottunState ? (
          <Image
            source={require('../../../assets/images/product_list/size_filter_on.png')}
            style={styles.buttonImage}
          />
        ) : (
          <Image
            source={require('../../../assets/images/product_list/size_filter_off.png')}
            style={styles.buttonImage}
          />
        )}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? (height >= 812 ? 40 : 40) : 40,
    right: 20,
    zIndex: 2
  },
  buttonImage: { height: 56, width: 56 }
})
