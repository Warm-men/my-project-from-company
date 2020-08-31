/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { l10nForSize } from '../../../../src/expand/tool/product_l10n'
import Image from '../../image'

export default class ToteProductItem extends PureComponent {
  _goProductCustomerPhotos = () => {
    const {
      goProductCustomerPhotos,
      toteProducts,
      toteProduct,
      toteId,
      isLatest
    } = this.props
    goProductCustomerPhotos(toteProducts, toteProduct, toteId, isLatest)
  }
  render() {
    const { didSelectedItem, toteProduct } = this.props
    const { customer_photos_v2, product_size } = toteProduct
    const isDone =
      customer_photos_v2.length && customer_photos_v2[0].photos.length
        ? true
        : false
    return (
      <View style={styles.container}>
        <TouchImage onPress={didSelectedItem} product={toteProduct.product} />
        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>{toteProduct.product.brand.name}</Text>
          <Text style={styles.text}>{toteProduct.product.title}</Text>
          {product_size && (
            <Text style={styles.text}>
              {l10nForSize(toteProduct.product_size.size_abbreviation)}
            </Text>
          )}
        </View>
        <ItemButton onPress={this._goProductCustomerPhotos} isDone={isDone} />
      </View>
    )
  }
}

export class TouchImage extends PureComponent {
  goDetails = () => {
    const { onPress, product } = this.props
    onPress(product)
  }

  render() {
    const { product } = this.props
    return (
      <TouchableOpacity onPress={this.goDetails}>
        <Image
          style={styles.itemImage}
          source={{ uri: product.catalogue_photos['0'].medium_url }}
          resizeMode="cover"
        />
        {product.disabled && (
          <View style={[styles.itemImage, styles.abnormalStatus]}>
            <View style={styles.abnormalStatusView}>
              <Text style={styles.abnormalStatusTitle}>已下架</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    )
  }
}

export class ItemButton extends PureComponent {
  _goProductCustomerPhotos = () => {
    const { onPress } = this.props
    onPress && onPress()
  }

  render() {
    const { isDone } = this.props
    return (
      <TouchableOpacity
        style={[
          styles.itemButton,
          isDone ? styles.doneItemButton : styles.unDoneItemButton
        ]}
        onPress={this._goProductCustomerPhotos}>
        <Text
          style={[
            styles.buttonTitle,
            isDone ? styles.doneItemButtonText : styles.unDoneItemButtonText
          ]}>
          {isDone ? '查看晒单' : '去晒单'}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingTop: 16,
    paddingBottom: 16
  },
  itemImage: { width: 76, height: 109, marginRight: 20 },
  brand: { fontSize: 15, color: '#333', lineHeight: 20 },
  text: { fontSize: 12, color: '#999', lineHeight: 20 },
  itemButton: {
    width: 75,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  doneItemButton: {
    backgroundColor: '#fff',
    borderRadius: 2,
    borderColor: '#333',
    borderWidth: 1
  },
  unDoneItemButton: {
    backgroundColor: '#EA5C39'
  },
  buttonTitle: { fontSize: 11 },
  doneItemButtonText: {
    color: '#333'
  },
  unDoneItemButtonText: {
    color: '#FFF'
  },
  emptyPhotoText: {
    marginTop: 24,
    fontSize: 16,
    color: '#999'
  },
  abnormalStatus: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  abnormalStatusView: {
    height: 18,
    width: 50,
    backgroundColor: 'rgba(51,51,51,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  abnormalStatusTitle: {
    fontSize: 11,
    color: '#fff'
  }
})
