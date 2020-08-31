/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../../image'
import { getProductAbnormalStatus } from '../../../../src/expand/tool/product_l10n'
import ToteSlot from '../../products/tote_slot'
export default class ProductItem extends PureComponent {
  _didSelectedItem = () => {
    const { didSelectedItem, toteProduct, disable } = this.props
    if (!disable) {
      didSelectedItem && didSelectedItem(toteProduct)
    }
  }

  render() {
    const { toteProduct, disable, isSelected, isOnboarding } = this.props
    const { product, product_size } = toteProduct
    const photo = product.catalogue_photos[0]
      ? product.catalogue_photos[0].medium_url
      : ''
    const iconUrl = isSelected
      ? require('../../../../assets/images/me_style/focus_button.png')
      : require('../../../../assets/images/me_style/blur_button.png')
    const showToteSlot = toteProduct.slot >= 2
    const tips = getProductAbnormalStatus(product, product_size)
    return (
      <TouchableOpacity
        style={styles.contentView}
        activeOpacity={disable ? 0.4 : 0.8}
        onPress={this._didSelectedItem}>
        <Image
          source={{ uri: photo }}
          style={styles.cataloguePhotos}
          resizeMode="cover"
        />
        {!disable && <Image style={styles.icon} source={iconUrl} />}
        {disable && <View style={styles.disableView} />}
        {showToteSlot && !isOnboarding && (
          <ToteSlot
            testID="tote-slot"
            style={styles.toteSlot}
            slotNum={toteProduct.slot}
            type={product.type}
          />
        )}
        {tips && (
          <View style={styles.swappableView}>
            <View style={styles.swappableTips}>
              <Text style={styles.swappableTipsTitle}>{tips}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  icon: { position: 'absolute', right: 8, top: 2, height: 18, width: 18 },
  contentView: {
    height: 150,
    marginRight: 5
  },
  disableView: {
    width: 100,
    height: 150,
    opacity: 0.6,
    position: 'absolute',
    backgroundColor: 'white'
  },
  cataloguePhotos: {
    width: 100,
    height: 150
  },
  toteSlot: {
    position: 'absolute',
    top: 0
  },
  swappableView: {
    position: 'absolute',
    width: 100,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  swappableTips: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#333',
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  swappableTipsTitle: {
    color: '#FFF',
    fontSize: 11
  }
})
