/* @flow */

import React, { PureComponent } from 'react'
import { Animated, FlatList, Platform, Dimensions } from 'react-native'
import ProductItem from './experiment/product_list_item'
import {
  CollectionItem,
  CustomerPhotoItem,
  LookbookItem
} from './external_items/index.js'
import { inject } from 'mobx-react'
import {
  viewableItemsChanged,
  isEnableTrackScreen,
  updateViewableItemStatus,
  getCurrentItemKey,
  DAQ_TYPE
} from '../../../src/expand/tool/daq'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

@inject('currentCustomerStore', 'modalStore', 'daqStore', 'viewableStore')
class Products extends PureComponent {
  constructor(props) {
    super(props)
    const { numColumns } = props
    this.itemWidth = Dimensions.get('window').width / numColumns

    this.viewabilityConfigCallbackPairs = [
      {
        viewabilityConfig: {
          itemVisiblePercentThreshold: 75,
          minimumViewTime: 1000
        },
        onViewableItemsChanged: this._onViewableItemsChanged
      }
    ]
  }

  _getReportData = index => {
    const { getReportData } = this.props
    return getReportData && getReportData(index)
  }

  _didSelectedItem = (item, index) => {
    const { didSelectedItem } = this.props
    didSelectedItem && didSelectedItem(item)

    //DAQ
    const reportData = this._getReportData(index)
    const { id } = item
    const currentKey = getCurrentItemKey(id, index)

    let type
    switch (item.__typename) {
      case 'BrowseCollection':
        type = DAQ_TYPE.Collection
        break
      case 'Look':
        type = DAQ_TYPE.Look
        break
      case 'CustomerPhotoV2':
        type = DAQ_TYPE.CustomerPhoto
        break
      default:
        type = DAQ_TYPE.Products
    }
    const data = { ...reportData, type }

    updateViewableItemStatus(currentKey, { id, pushToDetail: true }, data)
  }

  _renderItem = ({ item, index }) => {
    const {
      extraData,
      addShoppingCarButton,
      toteCartAddProduct,
      currentCustomerStore,
      isViewableFeed,
      renderStickyHeaders,
      isViewableImageAnimated,
      isViewableSeasonSample
    } = this.props
    if (!item.__typename) {
      return renderStickyHeaders ? renderStickyHeaders(index) : null
    }
    const style = { width: this.itemWidth, height: this.itemHeight }
    const currentKey = getCurrentItemKey(item.id, index)
    let itemView
    switch (item.__typename) {
      case 'BrowseCollection':
        itemView = (
          <CollectionItem
            index={index}
            data={item}
            isSubscriber={currentCustomerStore.isSubscriber}
            numColumns={this.props.numColumns}
            style={style}
            getReportData={this._getReportData}
            didSelectedItem={this._didSelectedItem}
          />
        )
        break
      case 'Look':
        itemView = (
          <LookbookItem
            data={item}
            style={style}
            index={index}
            numColumns={this.props.numColumns}
            isSubscriber={currentCustomerStore.isSubscriber}
            getReportData={this._getReportData}
            didSelectedItem={this._didSelectedItem}
          />
        )
        break
      case 'CustomerPhotoV2':
        itemView = (
          <CustomerPhotoItem
            currentKey={currentKey}
            data={item}
            style={style}
            index={index}
            numColumns={this.props.numColumns}
            isSubscriber={currentCustomerStore.isSubscriber}
            getReportData={this._getReportData}
            didSelectedItem={this._didSelectedItem}
          />
        )
        break
      default:
        itemView = (
          <ProductItem
            currentKey={currentKey}
            product={item}
            didSelectedItem={this._didSelectedItem}
            style={style}
            index={index}
            hiddenImage={extraData && extraData.hiddenImage}
            isSubscriber={currentCustomerStore.isSubscriber}
            numColumns={this.props.numColumns}
            getReportData={this._getReportData}
            isViewableFeed={isViewableFeed}
            isViewableImageAnimated={isViewableImageAnimated}
            isViewableSeasonSample={isViewableSeasonSample}
            addShoppingCarButton={addShoppingCarButton}
            toteCartAddProduct={toteCartAddProduct}
          />
        )
    }
    return itemView
  }
  _getItemLayout = (_, index) => {
    return { length: this.itemHeight, offset: this.itemHeight * index, index }
  }
  _extractUniqueKey = (item, index) => {
    return getCurrentItemKey(item.id, index)
  }

  _getRef = ref => {
    ref &&
      ref._component &&
      ref._component._listRef &&
      (ref._component._listRef._fillRateHelper._enabled = true)
    this.props.getRef && this.props.getRef(ref)
  }

  _onEndReached = () => {
    const { onEndReached, data } = this.props
    data.length && onEndReached && onEndReached()
  }

  _onViewableItemsChanged = ({ changed, viewableItems }) => {
    const {
      modalStore,
      getReportData,
      daqStore,
      navigation,
      onViewableItems
    } = this.props

    if (navigation && navigation.state.routeName !== modalStore.currentRoute) {
      return
    }
    const array = viewableItems.map(a => a.item)
    daqStore.viewableArray = array
    onViewableItems(array)

    const enableTrack = isEnableTrackScreen(modalStore.currentRoute)
    if (enableTrack) {
      viewableItemsChanged(changed, getReportData)
    }
  }

  render() {
    const {
      data,
      extraData,
      onRefresh,
      refreshing,
      onScroll,
      ListEmptyComponent,
      ListHeaderComponent,
      ListFooterComponent,
      scrollEventThrottle,
      numColumns,
      currentCustomerStore,
      stickyHeaderIndices,
      columnWrapperStyle,
      renderStickyHeaders
    } = this.props
    this.itemHeight = currentCustomerStore.isSubscriber
      ? Math.round(this.itemWidth * 1.9)
      : Math.round(this.itemWidth * 1.9 + 40)
    return (
      <AnimatedFlatList
        stickyHeaderIndices={stickyHeaderIndices}
        style={{ overflow: 'hidden', ...this.props.style }}
        overScrollMode="always"
        keyExtractor={this._extractUniqueKey}
        ref={this._getRef}
        initialNumToRender={4}
        columnWrapperStyle={
          columnWrapperStyle || {
            width: this.itemWidth,
            height: this.itemHeight
          }
        }
        windowSize={15}
        renderItem={this._renderItem}
        removeClippedSubviews={Platform.OS === 'android'}
        getItemLayout={!renderStickyHeaders ? this._getItemLayout : null}
        numColumns={numColumns}
        onEndReachedThreshold={2}
        scrollEventThrottle={scrollEventThrottle ? scrollEventThrottle : 16}
        data={data}
        extraData={extraData}
        onEndReached={this._onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        onScroll={onScroll}
        viewabilityConfigCallbackPairs={this.viewabilityConfigCallbackPairs}
      />
    )
  }
}

Products.defaultProps = {
  numColumns: Platform.isPad ? 4 : 2,
  onViewableItems: () => {}
}
export default Products
