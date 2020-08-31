/* @flow */

import React, { Component } from 'react'
import { FlatList } from 'react-native'
import ProductItem from './tote_tracker_product_item'

export default class Products extends Component {
  _extractUniqueKey = item => {
    return item.id.toString()
  }

  _renderItem = ({ item, index }) => {
    const { didSelectedItem, disabled } = this.props
    return (
      <ProductItem
        product={item.product}
        didSelectedItem={didSelectedItem}
        disabled={disabled}
        key={index}
      />
    )
  }

  render() {
    const { products, flatListStyle } = this.props
    return (
      <FlatList
        style={flatListStyle}
        keyExtractor={this._extractUniqueKey}
        numColumns={4}
        data={products}
        renderItem={this._renderItem}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      />
    )
  }
}
