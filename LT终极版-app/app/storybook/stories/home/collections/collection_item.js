import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import ImageView from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import AddToClosetButton from '../../../../src/containers/closet/add_to_closet_button'
import MoreView from '../moreView'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'

class CollectionItem extends PureComponent {
  _didSelectedCollection = () => {
    const { didSelectedCollection, collection, newestId } = this.props
    collection.newestId = newestId
    didSelectedCollection && didSelectedCollection(collection)
  }

  sortCollectionProducts = products => {
    if (products && products[0] && products[0].category) {
      const clothings = products.filter(function(product) {
        return product.category.accessory === false
      })
      const accessorys = products.filter(function(product) {
        return product.category.accessory === true
      })
      return [...clothings, ...accessorys]
    } else {
      return products
    }
  }
  _getReportData = index => {
    const { getReportData, type, collection } = this.props
    if (getReportData && type && collection) {
      return getReportData(index, type, collection)
    }
  }
  _getColumn = type => {
    let column
    if (type === 'hot') {
      column = Column.RecentHotCollection
    } else if (type === 'newest') {
      column = Column.NewArrivalCollection
    } else if (type === 'collection') {
      column = Column.Collection
    }
    return column
  }
  render() {
    const {
      collection,
      didSelectedProductItem,
      showCollectionItem,
      bannerStyle,
      type
    } = this.props
    const products = this.sortCollectionProducts(collection.products)
    const column = this._getColumn(type)
    const description = column + '-' + collection.title
    return (
      <View
        style={[
          this.props.style || styles.container,
          !showCollectionItem && { marginTop: 0, marginBottom: 24 }
        ]}>
        <TouchableOpacity
          activeOpacity={0.6}
          delayPressIn={100}
          onPress={this._didSelectedCollection}>
          <ImageView
            description={description}
            resizeMode="cover"
            source={{
              uri: collection.banner_photo_url
            }}
            style={bannerStyle}
          />
        </TouchableOpacity>
        {showCollectionItem && (
          <ScrollView
            style={styles.scrollView}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {products.map((item, index) => {
              return (
                <ProductItem
                  column={column}
                  key={index}
                  index={index}
                  data={item}
                  getReportData={this._getReportData}
                  didSelectedItem={didSelectedProductItem}
                />
              )
            })}
            {products.length === 6 && (
              <TouchableOpacity
                style={styles.more}
                activeOpacity={0.6}
                delayPressIn={100}
                onPress={this._didSelectedCollection}>
                <MoreView />
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
    )
  }
}

class ProductItem extends PureComponent {
  _getReportData = () => {
    const { index, getReportData } = this.props
    return getReportData && getReportData(index)
  }
  render() {
    const { data, column } = this.props
    const description = column + '-' + data.title
    return (
      <TouchableOpacity
        style={styles.touch}
        activeOpacity={0.6}
        delayPressIn={100}
        onPress={this._onPress}>
        <ImageView
          description={description}
          style={styles.imageViewItem}
          source={{
            uri: data.catalogue_photos[0]
              ? data.catalogue_photos[0].full_url
              : ''
          }}
        />
        <AddToClosetButton
          buttonStyle={styles.closetButton}
          getReportData={this._getReportData}
          product={data}
          updateClosetStatus={updateClosetStatus}
        />
      </TouchableOpacity>
    )
  }
  _onPress = () => {
    this.props.didSelectedItem(this.props.data)
  }
}
const styles = StyleSheet.create({
  container: {
    marginLeft: 0,
    marginRight: 0
  },
  imageViewItem: {
    width: p2d(128),
    height: p2d(192),
    marginTop: 1
  },
  view: {
    width: 3,
    height: 120
  },
  touch: {
    marginTop: 8,
    marginRight: 8
  },
  scrollView: {
    paddingLeft: 8
  },
  closetButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    transform: [{ scale: 0.8 }]
  },
  more: {
    width: p2d(128),
    height: p2d(192),
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 9,
    marginRight: 8
  }
})

export default CollectionItem
