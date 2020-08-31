import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Image from '../../image'
export default class SearchProductItem extends PureComponent {
  _didSelectedItem = () => {
    const { selectProduct, item } = this.props
    selectProduct && selectProduct(item)
  }

  render() {
    const { item, products } = this.props
    const uri = item.catalogue_photos[0].full_url
    const isSelected = products.find(i => item.id === i.id)
    return (
      <View style={styles.itemView}>
        <Image style={styles.itemImage} source={{ uri }} />
        <View style={{ flex: 1 }}>
          <Text testID="brand-name" numberOfLines={1} style={styles.itemBrand}>
            {item.brand.name}
          </Text>
          <Text testID="title" numberOfLines={1} style={styles.itemTitle}>
            {item.title}
          </Text>
        </View>
        <TouchableOpacity
          disabled={!!isSelected}
          onPress={this._didSelectedItem}
          style={[styles.itemButton, !!isSelected && { borderColor: '#ccc' }]}>
          <Text
            testID="itemButtonText"
            style={[styles.itemButtonText, !!isSelected && { color: '#ccc' }]}>
            {!!isSelected ? '已添加' : '添加'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemView: {
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F2F2F2',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemImage: { width: 60, height: 90, marginRight: 28 },
  itemBrand: { fontSize: 15, color: '#333', marginBottom: 7 },
  itemTitle: { fontSize: 12, color: '#999' },
  itemButton: {
    height: 28,
    width: 60,
    marginLeft: 15,
    borderWidth: 0.5,
    borderColor: '#E85C40',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemButtonText: { fontSize: 12, color: '#E85C40' }
})
