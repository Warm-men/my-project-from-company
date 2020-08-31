/* @flow */

import React, { PureComponent } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Image from '../../image'
import { l10nForSize } from '../../../../src/expand/tool/product_l10n'
import PartsView from '../../account/payment_pending/part_view'
export default class SelectProductItem extends PureComponent {
  render() {
    const { toteProduct, photoUrl, size, modifiedPrice } = this.props
    const { brand, title, full_price, parts } = toteProduct.product
    return (
      <View activeOpacity={0.6} style={styles.productContainerView}>
        <Image
          source={{ uri: photoUrl }}
          style={styles.cataloguePhotos}
          resizeMode="cover"
        />
        <View style={styles.productView}>
          <Text style={styles.brandName}>{title}</Text>
          <Text style={styles.productTitle}>{brand.name}</Text>
          <Text style={styles.productTitle}>{l10nForSize(size)}</Text>
          <PartsView parts={parts} partViewStyle={styles.partView} />
        </View>
        <View style={styles.rightView}>
          <Text style={styles.fullPrice}>￥{full_price}</Text>
          <Text style={styles.hei14}>￥{modifiedPrice}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  productContainerView: {
    paddingVertical: 8,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2'
  },
  cataloguePhotos: {
    width: 72,
    height: 108
  },
  productView: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center'
  },
  brandName: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8
  },
  productTitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8
  },
  priceContainerView: {
    backgroundColor: 'white',
    marginTop: 7,
    paddingLeft: 16,
    paddingRight: 16
  },
  hei14: {
    fontSize: 14,
    color: '#333'
  },
  fullPrice: {
    fontSize: 12,
    color: '#D0D0D0',
    marginTop: 4,
    textDecorationLine: 'line-through'
  },
  rightView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  partView: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#F7F7F7',
    borderRadius: 1,
    marginRight: 2,
    marginBottom: 2
  }
})
