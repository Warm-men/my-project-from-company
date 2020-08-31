import React, { PureComponent } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  FlatList
} from 'react-native'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
import ImageView from '../../image'

export default class BrandsItroduceList extends PureComponent {
  _renderItem = ({ item }) => {
    const { didSelectedBrandItem, imageStyle } = this.props
    return (
      <BrandsItroduceItem
        imageStyle={imageStyle}
        data={item}
        didSelectedBrandItem={didSelectedBrandItem}
      />
    )
  }
  getItemLayout = (_, index) => {
    return {
      length: 273,
      offset: 273 * index,
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
    const { data } = this.props
    return (
      <AnimatedFlatList
        ref={this._getRef}
        style={styles.container}
        keyExtractor={this._extractUniqueKey}
        data={data}
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

class BrandsItroduceItem extends PureComponent {
  _onPress = () => {
    const { link } = this.props.data
    this.props.didSelectedBrandItem(link)
  }
  render() {
    const { data, imageStyle } = this.props
    const url =
      typeof data.image_url === 'number'
        ? data.image_url
        : { uri: data.image_url }
    return (
      <TouchableOpacity
        style={styles.touch}
        activeOpacity={0.6}
        onPress={this._onPress}>
        <ImageView
          description={Column.Brand + '-' + data.id}
          style={imageStyle}
          source={url}
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
    width: 150,
    height: 200,
    marginTop: 1
  },
  touch: {
    marginTop: 4,
    marginRight: 8
  }
})
