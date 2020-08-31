/* @flow weak */

import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import Image from '../../image'
const ProductDetailsBrand = ({ pushToBrandDetail, brand }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={pushToBrandDetail}
    activeOpacity={0.85}>
    <View style={styles.brand}>
      {brand && brand.image_url ? (
        <View style={styles.image}>
          <Image
            style={styles.image}
            resizeMode="cover"
            source={{ uri: brand.image_url }}
          />
        </View>
      ) : (
        <Icon size={20} name="cloud-download" style={styles.brandIcon} />
      )}
      <Text style={styles.name}>{brand && brand.name}</Text>
    </View>
    <View style={styles.brand}>
      <Text style={styles.more}>MORE</Text>
      <Icon size={8} name="arrow-right" style={styles.icon} />
    </View>
  </TouchableOpacity>
)

export default ProductDetailsBrand

const styles = StyleSheet.create({
  container: {
    height: 85,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 7,
    borderBottomColor: '#f7f7f7'
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    overflow: 'hidden'
  },
  name: {
    color: '#666',
    fontSize: 14
  },
  more: {
    color: '#999',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 4
  },
  brandIcon: {
    marginRight: 10
  },
  icon: {
    color: '#999'
  }
})
