/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Animated, FlatList, Text } from 'react-native'
import ProductItem from './tote_preview_item'
import { sortToteProducts } from '../../../../src/expand/tool/totes'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

export default class ToteList extends PureComponent {
  _extractUniqueKey = (item, index) => {
    return index.toString()
  }
  _renderItem = ({ item, index }) => {
    const { didSelectedItem } = this.props
    return (
      <ProductItem
        toteItem={item}
        key={index}
        didSelectedItem={didSelectedItem}
      />
    )
  }

  _listHeaderComponent = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>为你准备的新衣箱</Text>
      </View>
    )
  }

  _getRef = ref => {
    ref &&
      ref._component &&
      ref._component._listRef &&
      (ref._component._listRef._fillRateHelper._enabled = true)
    this.props.ref && this.props.ref(ref)
  }

  render() {
    const { products } = this.props
    const sortProducts = sortToteProducts(products)
    return (
      <View style={styles.container}>
        <AnimatedFlatList
          ref={this._getRef}
          keyExtractor={this._extractUniqueKey}
          data={sortProducts}
          renderItem={this._renderItem}
          ListHeaderComponent={this._listHeaderComponent}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingLeft: 15,
    paddingTop: 10
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 20,
    color: '#333',
    lineHeight: 40
  }
})
