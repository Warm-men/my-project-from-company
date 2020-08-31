/* @flow */

import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
export default class NonReturnedItem extends PureComponent {
  setSelectProduct = () => {
    const { product, setSelectProduct } = this.props
    setSelectProduct && setSelectProduct(product)
  }

  render() {
    const { photoUrl, iconUrl, index, product } = this.props
    return (
      <TouchableOpacity
        onPress={this.setSelectProduct}
        disabled={!index}
        style={[styles.container, !!!index && { marginLeft: 12 }]}>
        <Image
          source={{ uri: photoUrl }}
          style={styles.nonReturnedItemPhotos}
          resizeMode="cover"
        />
        {!!index && <Image source={iconUrl} style={styles.selectedIcon} />}

        <Text style={styles.price}>
          ¥{product.transition_info.modified_price}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    alignItems: 'center',
    marginVertical: 16
  },
  nonReturnedItemPhotos: {
    width: 72,
    height: 106
  },
  selectedIcon: {
    width: 14,
    height: 14,
    position: 'absolute',
    right: 0
  },
  price: {
    fontSize: 14,
    color: '#333',
    marginTop: 10
  }
})
