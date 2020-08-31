/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { l10nForSize } from '../../../../src/expand/tool/product_l10n'

export default class ProductItem extends Component {
  _didSelectedItem = () => {
    const { toteItem, didSelectedItem } = this.props
    didSelectedItem && didSelectedItem(toteItem.product)
  }
  render() {
    const { toteItem } = this.props
    const { product, product_size, reason_in_tote } = toteItem

    const cataloguePhotos = product.catalogue_photos[0]
    return (
      <TouchableOpacity
        onPress={this._didSelectedItem}
        activeOpacity={0.65}
        style={styles.container}>
        <View style={styles.leftView}>
          <Image
            source={{ uri: cataloguePhotos ? cataloguePhotos.medium_url : '' }}
            style={styles.cataloguePhotos}
            resizeMode="cover"
          />
        </View>
        <View style={styles.rightView}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.brand}>
              {product.brand && product.brand.name}
            </Text>
            <Text style={styles.size}>
              {l10nForSize(product_size.size_abbreviation)}
            </Text>
            <Text style={styles.reason}>{reason_in_tote}</Text>
            <View style={styles.closet}>
              <Image
                source={require('../../../../assets/images/closet/inCloset.png')}
              />
              <Text style={styles.closetCount}>{product.closet_count}</Text>
            </View>
          </View>
          <MaterialIcons size={26} color={'#333'} name="keyboard-arrow-right" />
        </View>
      </TouchableOpacity>
    )
  }
}

const Dimensions = require('Dimensions') //获取屏幕尺寸
const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 15
  },
  leftView: {
    width: (width - 30) * 0.4
  },
  rightView: {
    width: (width - 30) * 0.6,
    paddingLeft: 15,
    flexDirection: 'row'
  },
  cataloguePhotos: {
    width: (width - 30) * 0.4,
    height: (width - 30) * 0.4 * 1.5
  },
  brand: {
    paddingTop: 8,
    fontWeight: '400',
    fontSize: 12,
    color: '#989898'
  },
  title: {
    paddingTop: 20,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 20,
    color: '#242424'
  },
  size: {
    paddingTop: 15,
    paddingBottom: 15,
    color: '#ccc'
  },
  reason: {
    fontWeight: '400',
    fontSize: 12,
    color: '#989898'
  },
  closet: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center'
  },
  closetCount: {
    paddingLeft: 10,
    fontWeight: '400',
    fontSize: 12,
    color: '#242424'
  }
})
