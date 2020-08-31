/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Platform
} from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import LookbookProduct from '../lookbook_product'
import Image from '../../image'
import _ from 'lodash'
export default class Products extends PureComponent {
  render() {
    const {
      mainProduct,
      accessories,
      collocationProduct,
      hideDesc,
      showCloset,
      style,
      data,
      onPress,
      index,
      useLookMainPhoto,
      column,
      onPressAllowButton
    } = this.props
    const count =
      data.first_binding_products.length +
      data.second_binding_products.length +
      1
    return (
      <View style={style || styles.container}>
        <View style={styles.tag}>
          <Text style={styles.text}>{count}件搭配单品</Text>
        </View>
        <View style={styles.row}>
          <LookbookProduct
            index={index}
            navigation={this.props.navigation}
            onPress={onPress}
            column={column}
            data={data.primary_product}
            showCloset={showCloset}
            useLookMainPhoto={useLookMainPhoto}
            hideDesc={hideDesc}
            style={mainProduct || styles.mainProduct}
          />
          <View>
            <Item
              onPressAllowButton={onPressAllowButton}
              isAccessories={true}
              data={data.second_binding_products}
              onPress={onPress}
              index={index}
              column={column}
              hideDesc={hideDesc}
              accessories={accessories}
              showCloset={showCloset}
              style={styles.leftItem}
              navigation={this.props.navigation}
            />
            <Item
              onPressAllowButton={onPressAllowButton}
              data={data.first_binding_products}
              onPress={onPress}
              index={index}
              column={column}
              collocationProduct={collocationProduct}
              hideDesc={hideDesc}
              showCloset={showCloset}
              style={styles.rightItem}
              navigation={this.props.navigation}
            />
          </View>
        </View>
      </View>
    )
  }
}

class Item extends PureComponent {
  constructor(props) {
    super(props)
    const { data } = props
    this.count = 0
    this.state = {}
    this.pre = _.throttle(this.prePage, 200, {
      leading: true,
      trailing: false
    })
    this.next = _.throttle(this.nextPage, 200, {
      leading: true,
      trailing: false
    })
    this.list = []
    this._swiper = null
    this.currentIndex = data.length
    if (data && data.length === 1) {
      this.list = data
    } else {
      this.list.push(...data)
      this.list.push(data[0])
      this.list.push(data[1])
    }
    this.manualScroll = false
  }

  componentDidMount() {
    const { data } = this.props
    // remove setTimeout wrapper when https://github.com/facebook/react-native/issues/6849 is resolved.
    setTimeout(() => {
      this._swiper.scrollToOffset({
        animated: false,
        offset: data * p2d(160)
      })
    }, 0)
  }

  _renderItem = ({ item }) => {
    const {
      hideDesc,
      showCloset,
      onPress,
      index,
      column,
      isAccessories,
      style,
      navigation
    } = this.props

    return (
      <LookbookProduct
        index={index}
        navigation={navigation}
        onPress={onPress}
        column={column}
        data={item}
        showCloset={showCloset}
        hideDesc={hideDesc}
        style={isAccessories ? styles.accessories : styles.collocationProduct}
        isAccessories={isAccessories}
        containerStyle={[style, styles.viewContainer]}
      />
    )
  }

  prePage = () => {
    const { onPressAllowButton, data } = this.props
    onPressAllowButton && onPressAllowButton()
    this.currentIndex--
    if (!this.currentIndex) {
      this.currentIndex = data.length - 1
    }
    this._swiper.scrollToIndex({
      index: this.currentIndex,
      animated: false
    })
  }
  nextPage = () => {
    const { onPressAllowButton, data } = this.props
    this.currentIndex++
    onPressAllowButton && onPressAllowButton()
    if (this.currentIndex > data.length) {
      this.currentIndex = 1
    }
    this._swiper.scrollToIndex({
      index: this.currentIndex,
      animated: false
    })
  }
  _onMomentumScrollEnd = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / p2d(160))
    this.currentIndex = index
    if (index >= this.list.length - 1) {
      this._swiper.scrollToIndex({
        index: 1,
        animated: Platform.OS === 'ios' ? false : true
      })
    }
    if (index === 0) {
      this._swiper.scrollToIndex({
        index: this.list.length - 2,
        animated: false
      })
    }
  }
  _onLayout() {
    setTimeout(
      () =>
        this._swiper &&
        this._swiper.scrollToIndex({
          index: 1,
          animated: false
        }),
      0
    )
  }

  _extractUniqueKey(_, index) {
    return index.toString()
  }
  _getItemLayout = (_, index) => {
    return { length: p2d(160), offset: p2d(160) * index, index }
  }

  render() {
    const { style, data } = this.props
    return (
      <View onLayout={this._onLayout}>
        {data && data.length > 1 && (
          <TouchableOpacity
            style={styles.preButton}
            onPress={this.pre}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image
              source={require('../../../../assets/images/lookbook/pre.png')}
            />
          </TouchableOpacity>
        )}
        {data && data.length > 1 && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={this.next}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image
              source={require('../../../../assets/images/lookbook/next.png')}
            />
          </TouchableOpacity>
        )}
        <FlatList
          getItemLayout={this._getItemLayout}
          keyExtractor={this._extractUniqueKey}
          ref={ref => (this._swiper = ref)}
          data={this.list}
          windowSize={1}
          style={style}
          initialNumToRender={1}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          removeClippedSubviews={true}
          renderItem={this._renderItem}
          scrollEnabled={data && data.length > 1}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  mainProduct: {
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(191),
    height: p2d(287),
    marginTop: 15
  },
  accessories: {
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(76),
    height: p2d(114)
  },
  collocationProduct: {
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(116),
    height: p2d(174)
  },
  preButton: {
    position: 'absolute',
    left: 5,
    top: p2d(70),
    zIndex: 1000
  },
  nextButton: {
    position: 'absolute',
    right: 5,
    top: p2d(70),
    zIndex: 1000
  },
  tag: {
    backgroundColor: '#F3F3F3',
    width: p2d(85),
    height: p2d(22),
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    left: -2,
    zIndex: 10,
    position: 'absolute'
  },
  text: {
    fontSize: 11,
    color: '#989898'
  },
  leftItem: { width: p2d(160), height: p2d(166) },
  rightItem: { width: p2d(160), height: p2d(220) }
})
