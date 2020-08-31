/* @flow */

import React, { PureComponent } from 'react'
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import Image from '../../../../storybook/stories/image'
import p2d from '../../../expand/tool/p2d'

export default class ProductsCard extends PureComponent {
  productsItem = () => {
    const { toteProducts, didSelectedItem } = this.props
    let productsItem = []
    toteProducts.map((item, index) => {
      const photo = item.product.catalogue_photos[0]
      const photoUrl = photo
        ? photo.thumb_url
          ? photo.thumb_url
          : photo.full_url
        : ''
      productsItem.push(
        <TouchableOpacity
          onPress={() => {
            didSelectedItem(item.product)
          }}
          key={index}
          style={styles.productsItem}>
          <Image style={styles.productsItemImage} source={{ uri: photoUrl }} />
        </TouchableOpacity>
      )
    })
    return productsItem
  }

  render() {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        showsVerticalScrollIndicator
        style={styles.productsSrollView}>
        <View style={styles.productsItemCard}>{this.productsItem()}</View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  productsSrollView: {
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 16,
    flexGrow: 0,
    width: p2d(311),
    height: p2d(90)
  },
  productsItemCard: {
    paddingVertical: p2d(15),
    paddingLeft: p2d(8),
    paddingRight: p2d(15),
    flexDirection: 'row'
  },
  productsItem: {
    borderRadius: 2,
    marginLeft: p2d(8)
  },
  productsItemImage: {
    width: p2d(40),
    height: p2d(60)
  }
})
