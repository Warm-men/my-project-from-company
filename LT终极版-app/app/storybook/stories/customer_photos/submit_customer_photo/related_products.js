/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Image from '../../image'
import ImageCollection from '../../image_collection'

export default class RelatedProducts extends PureComponent {
  _renderItem = item => {
    const { catalogue_photos } = item
    return (
      <Image
        style={styles.imageItem}
        source={{ uri: catalogue_photos && catalogue_photos[0].medium_url }}
      />
    )
  }

  _sortRelatedProducts = () => {
    const { relatedProducts, lockProduct } = this.props
    let isAccessoryFirst = false
    if (lockProduct) {
      return relatedProducts
    }
    if (relatedProducts && relatedProducts.length) {
      isAccessoryFirst = relatedProducts[0].category.accessory
    }
    let array = []
    const clothings = relatedProducts.filter(function(product) {
      return product.category.accessory === false
    })
    const accessorys = relatedProducts.filter(function(product) {
      return product.category.accessory === true
    })
    if (isAccessoryFirst) {
      array = [...accessorys, ...clothings]
    } else {
      array = [...clothings, ...accessorys]
    }
    return array
  }

  render() {
    const { lockProduct, isStylist } = this.props
    const relatedProducts = this._sortRelatedProducts()
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Image
            style={styles.iconImage}
            source={require('../../../../assets/images/customer_photos/related_product_icon.png')}
          />
          <Text style={styles.title}>关联单品</Text>
        </View>

        <ImageCollection
          disabled={true}
          lockCollectionItem={lockProduct}
          array={relatedProducts}
          renderItem={this._renderItem}
          maxLength={-1}
          isStylist={isStylist}
          wrapperStyle={styles.wrapperStyle}
          itemStyle={{ width: 40, height: 60 }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 20
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconImage: {
    width: 14,
    height: 14,
    marginRight: 8
  },
  title: {
    fontSize: 14,
    color: '#989898',
    lineHeight: 45
  },
  imageItem: {
    width: 40,
    height: 60,
    borderWidth: 0.5,
    borderColor: '#f3f3f3'
  },
  wrapperStyle: {
    paddingLeft: 22
  }
})
