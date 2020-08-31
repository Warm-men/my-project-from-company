/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { l10nForSize } from '../../../../src/expand/tool/product_l10n'
import Image from '../../image'

export default class RelatedToteProductItem extends PureComponent {
  _didSelectedItem = () => {
    const { didSelectedItem, toteProduct } = this.props
    didSelectedItem(toteProduct)
  }
  render() {
    const { toteProduct, isSelected } = this.props
    const { product, product_size } = toteProduct
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this._didSelectedItem}>
        <View style={styles.selectedStatus}>
          {isSelected ? (
            <Image
              source={require('../../../../assets/images/account/select.png')}
            />
          ) : (
            <Image
              source={require('../../../../assets/images/account/unselect.png')}
            />
          )}
        </View>
        <Image
          style={styles.itemImage}
          source={{ uri: product.catalogue_photos['0'].medium_url }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>{product.brand.name}</Text>
          <Text style={styles.text}>{product.title}</Text>
          {!!product_size && (
            <Text style={styles.text}>
              {l10nForSize(product_size.size_abbreviation)}
            </Text>
          )}
        </View>
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
  selectedStatus: { width: 50, alignItems: 'center', justifyContent: 'center' },
  itemImage: { width: 76, height: 109, marginRight: 20 },
  brand: { fontSize: 15, color: '#333', lineHeight: 20 },
  text: { fontSize: 12, color: '#999', lineHeight: 20 }
})
