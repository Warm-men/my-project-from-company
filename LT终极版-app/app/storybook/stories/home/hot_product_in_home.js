/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import ProductItem from '../products/experiment/product_list_item'
import { Column } from '../../../src/expand/tool/add_to_closet_status'

export default class HotProductsItem extends PureComponent {
  _didSelectedItem = item => {
    const { navigation } = this.props
    navigation.push('Details', {
      item,
      column: Column.RecentHotCollection,
      hasFeedAnimation: true
    })
  }

  render() {
    const { index, items, getReportData } = this.props

    const width = Dimensions.get('window').width / 2
    const height = Math.round(width * 1.9 + 40)

    const leftIndex = index * 2
    const rightIndex = index * 2 + 1

    return (
      <View style={styles.container}>
        <ProductItem
          isViewableFeed
          style={{ width, height }}
          index={leftIndex}
          currentKey={items[0].id}
          product={items[0]}
          didSelectedItem={this._didSelectedItem}
          getReportData={getReportData}
        />
        {items[1] ? (
          <ProductItem
            isViewableFeed
            style={{ width, height }}
            index={rightIndex}
            currentKey={items[0].id}
            product={items[1]}
            didSelectedItem={this._didSelectedItem}
            getReportData={getReportData}
          />
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row' }
})
