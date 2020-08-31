/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import TotePastProductItem from './tote_past_product_item'

export default class Products extends Component {
  _extractUniqueKey = (item, index) => {
    return index.toString()
  }

  goToteBuyClothesDetails = (product, toteId) => {
    this.props.navigation.navigate('ToteBuyClothesDetails', {
      toteProduct: product,
      toteId,
      order: product.order
    })
  }

  _renderItem = ({ item, index }) => {
    const { didSelectedItem, toteId } = this.props
    return (
      <TotePastProductItem
        didSelectedItem={didSelectedItem}
        key={index}
        toteProduct={item}
        goToteBuyClothesDetails={this.goToteBuyClothesDetails}
        toteId={toteId}
      />
    )
  }
  render() {
    const { products } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={this._extractUniqueKey}
          data={products}
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
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F3F3F3',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F3F3'
  }
})
