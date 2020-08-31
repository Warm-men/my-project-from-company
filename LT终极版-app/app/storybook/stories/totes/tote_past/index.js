/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, Animated, FlatList } from 'react-native'
import PastTote from './tote_past_item'
import EmptyProduct from '../../products/empty_product'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

export default class PastTotes extends Component {
  _getRef = ref => {
    ref &&
      ref._component &&
      ref._component._listRef &&
      (ref._component._listRef._fillRateHelper._enabled = true)
    this.props.ref && this.props.ref(ref)
  }

  _extractUniqueKey(item) {
    return item.id.toString()
  }

  _getItemLayout = (_, index) => {
    return { length: 208, offset: 208 * index, index }
  }

  _listEmptyComponent = () => {
    return <EmptyProduct />
  }

  _renderItem = ({ item }) => {
    const { didSelectedItem, rateTote } = this.props
    const { display_rate_incentive_guide } = item
    return (
      <PastTote
        tote={item}
        displayRateIncentiveGuide={display_rate_incentive_guide}
        didSelectedItem={didSelectedItem}
        rateTote={rateTote}
        navigation={this.props.navigation}
      />
    )
  }

  render() {
    const { totes, ListFooterComponent, style } = this.props
    return (
      <View style={[styles.container, style]}>
        <AnimatedFlatList
          ref={this._getRef}
          windowSize={2}
          keyExtractor={this._extractUniqueKey}
          data={totes}
          renderItem={this._renderItem}
          ListEmptyComponent={this._listEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          onEndReached={this.props.onEndReached}
          onEndReachedThreshold={0.2}
          getItemLayout={this._getItemLayout}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafc'
  }
})
