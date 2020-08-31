/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, FlatList, StyleSheet, AppState } from 'react-native'

import CataloguePhotosItem from './catalogue_photo_item'
import ProductFeeds from '../feed'

import p2d from '../../../../../src/expand/tool/p2d'
import _ from 'lodash'

const ITEM_WIDTH = p2d(375)
const ITEM_HEIGHT = p2d(480)

export default class CataloguePhotos extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { currentIndex: 0, animatedActive: true }
  }
  _extractUniqueKey(_, index) {
    return index.toString()
  }
  _renderItem = ({ item, index }) => {
    const { data } = this.props
    return (
      <CataloguePhotosItem
        style={styles.photo}
        item={item}
        index={index}
        data={data}
      />
    )
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.setState({ animatedActive: true })
    } else {
      this.setState({ animatedActive: false })
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  onScrollEnd = e => {
    let contentOffset = e.nativeEvent.contentOffset
    let viewSize = e.nativeEvent.layoutMeasurement
    let pageNum = Math.floor((contentOffset.x + 1) / viewSize.width)
    this.setState({ currentIndex: pageNum < 0 ? 0 : pageNum })
  }
  render() {
    const { data, feeds, hiddenImage } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          onMomentumScrollEnd={this.onScrollEnd}
          style={styles.contentView}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={1}
          keyExtractor={this._extractUniqueKey}
          data={data}
          renderItem={this._renderItem}
        />
        <View style={styles.pagingIndicator}>
          <Text style={styles.pagingText}>
            {this.state.currentIndex + 1}/{data.length}
          </Text>
        </View>
        {!hiddenImage && this.state.animatedActive ? (
          <ProductFeeds feeds={feeds} />
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  contentView: { width: ITEM_WIDTH },
  photo: { width: ITEM_WIDTH, height: ITEM_HEIGHT },
  pagingIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingLeft: 9,
    paddingRight: 7,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pagingText: { fontSize: 12, color: '#fff', letterSpacing: 2, lineHeight: 20 }
})
