/* @flow weak */

import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
const ProductDetailsDescription = ({ description }) => (
  <View style={styles.container}>
    <View style={styles.buyer}>
      <Text style={styles.detailsSubTitle}>商品描述</Text>
    </View>
    <Text style={styles.description}>{description}</Text>
  </View>
)

export default ProductDetailsDescription

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 7,
    borderBottomColor: '#f7f7f7'
  },
  buyer: {
    marginBottom: 20,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headImage: {
    width: 40,
    height: 40
  },
  detailsSubTitle: { color: '#242424', fontSize: 18, fontWeight: '600' },
  identity: {
    color: '#999',
    fontSize: 12
  },
  description: {
    fontWeight: '400',
    fontSize: 14,
    color: '#666',
    lineHeight: 26,
    marginBottom: 20
  }
})
