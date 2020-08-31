/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import BuyProductItem from './tote_tracker_buy_product_item_b'
import { sortToteProducts } from '../../../../src/expand/tool/totes'

export default class Products extends Component {
  _extractUniqueKey = (item, index) => {
    return index.toString()
  }

  _renderItem = ({ item, index }) => {
    const { didSelectedItem, toteId } = this.props
    return (
      <BuyProductItem
        product={item.product}
        didSelectedItem={didSelectedItem}
        key={index}
        index={index}
        state={item.product_item.state}
        toteProduct={item}
        toteId={toteId}
      />
    )
  }

  render() {
    const { products, style, hasSummerPlanActivity } = this.props
    const sortProducts = sortToteProducts(products)
    let data = []
    if (hasSummerPlanActivity) {
      data = [{ activity: true }, ...sortProducts]
    } else {
      data = sortProducts
    }
    return (
      <View style={[styles.container, style]}>
        <FlatList
          keyExtractor={this._extractUniqueKey}
          extraData={[...data]}
          data={data}
          horizontal={true}
          renderItem={this._renderItem}
          showsHorizontalScrollIndicator={false}
          bounces={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20
  }
})
