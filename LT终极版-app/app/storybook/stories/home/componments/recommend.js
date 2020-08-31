import React, { PureComponent } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  FlatList
} from 'react-native'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
import ImageView from '../../image'
import AddToClosetButton from '../../../../src/containers/closet/add_to_closet_button'
import p2d from '../../../../src/expand/tool/p2d'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'

export default class Recommend extends PureComponent {
  _renderItem = ({ item, index }) => {
    const { didSelectedItem } = this.props
    return (
      <RecommendItem
        item={item}
        index={index}
        getReportData={this._getReportData}
        didSelectedItem={didSelectedItem}
      />
    )
  }
  _getReportData = index => {
    const { navigation } = this.props
    return {
      index,
      variables: { slug: 'trending_near_you' },
      column: Column.Recommend,
      router: navigation.state.routeName
    }
  }
  getItemLayout = (_, index) => {
    return {
      length: p2d(136),
      offset: p2d(136 * index),
      index
    }
  }
  _extractUniqueKey(item) {
    return item.id.toString()
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
    return (
      <AnimatedFlatList
        ref={this._getRef}
        style={styles.container}
        keyExtractor={this._extractUniqueKey}
        data={products}
        renderItem={this._renderItem}
        getItemLayout={this.getItemLayout}
        windowSize={2}
        horizontal={true}
        initialNumToRender={3}
        showsHorizontalScrollIndicator={false}
        {...Platform.select({
          ios: {
            removeClippedSubviews: false
          },
          android: {
            removeClippedSubviews: true
          }
        })}
      />
    )
  }
}

class RecommendItem extends PureComponent {
  _onPress = () => {
    const { item } = this.props
    this.props.didSelectedItem(item)
  }
  _getReportData = () => {
    const { index, getReportData } = this.props
    return getReportData && getReportData(index)
  }
  render() {
    const { item } = this.props
    return (
      <TouchableOpacity
        style={styles.touch}
        activeOpacity={0.6}
        onPress={this._onPress}>
        <ImageView
          style={styles.imageViewItem}
          source={{
            uri: item.catalogue_photos[0]
              ? item.catalogue_photos[0].full_url
              : ''
          }}
        />
        <AddToClosetButton
          buttonStyle={styles.closetButton}
          product={item}
          getReportData={this._getReportData}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8
  },
  imageViewItem: {
    width: p2d(128),
    height: p2d(192),
    marginTop: 1
  },
  touch: {
    marginTop: 4,
    marginRight: p2d(8)
  },
  closetButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    transform: [{ scale: 0.8 }]
  }
})
