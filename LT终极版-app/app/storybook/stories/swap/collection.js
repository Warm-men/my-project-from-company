/* @flow */

import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  FlatList,
  TouchableHighlight,
  Text
} from 'react-native'
import Image from '../image'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

export default class Collection extends Component {
  _extractUniqueKey(item, index) {
    return index.toString()
  }
  _renderItem = ({ item, index }) => {
    const { didSelectedProduct } = this.props
    return (
      <CollectionItem
        didSelectedProduct={didSelectedProduct}
        product={item}
        index={index}
      />
    )
  }

  _listEmptyComponent = () => {
    return <Text>empty</Text>
  }

  _getRef = ref => {
    ref &&
      ref._component &&
      ref._component._listRef &&
      (ref._component._listRef._fillRateHelper._enabled = true)
    this.props.ref && this.props.ref(ref)
  }

  render() {
    const { collection } = this.props
    // TODO: FlatList 性能优化
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{collection.title}</Text>
          <AnimatedFlatList
            ref={this._getRef}
            horizontal={true}
            keyExtractor={this._extractUniqueKey}
            data={collection.products}
            renderItem={this._renderItem}
            ListEmptyComponent={this._listEmptyComponent}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    paddingLeft: 15,
    paddingTop: 24,
    paddingBottom: 16,
    fontWeight: '400',
    fontSize: 14,
    color: '#333'
  },
  itemContent: {
    marginRight: 6
  },
  productImageView: { width: 100, height: 150 }
})

class CollectionItem extends PureComponent {
  _didSelectedProduct = () => {
    const { didSelectedProduct, product } = this.props
    didSelectedProduct(product)
  }
  render() {
    const { product, index } = this.props
    return (
      <TouchableHighlight
        style={[styles.itemContent, !index && { paddingLeft: 15 }]}
        onPress={this._didSelectedProduct}>
        <Image
          resizeMode="cover"
          style={styles.productImageView}
          source={{
            uri: product.catalogue_photos[0]
              ? product.catalogue_photos[0].medium_url
              : ''
          }}
        />
      </TouchableHighlight>
    )
  }
}
