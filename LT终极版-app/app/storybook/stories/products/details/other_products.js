/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native'
import Image from '../../image'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'
import Icons from 'react-native-vector-icons/Ionicons'
import { updateViewableItemStatus } from '../../../../src/expand/tool/daq'
import SwiperFlatList from 'react-native-swiper-flatlist'
import p2d from '../../../../src/expand/tool/p2d'
export const { width, height } = Dimensions.get('window')

export default class OtherProducts extends PureComponent {
  _didSelectedItem = (item, index) => {
    const { navigation, inSwap } = this.props
    const column = Column.Outfits
    navigation.push('Details', { item, column, inSwap })

    const attributes = { column, index }
    const id = item.id
    updateViewableItemStatus(id, { id, pushToDetail: true }, attributes)
  }
  render() {
    const { otherProducts } = this.props
    if (!otherProducts || !otherProducts.length) {
      return null
    }
    let data = []
    for (let i = 0, len = otherProducts.length; i < len; i += 3) {
      data.push(otherProducts.slice(i, i + 3))
    }
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.detailsSubTitle}>{'模特穿搭'}</Text>
        </View>

        {data.length === 1 && data[0].length === 1 ? (
          data[0].map((item, index) => {
            return (
              <OtherProductsItem
                swiper={false}
                item={item}
                key={index}
                index={index}
                didSelectedItem={this._didSelectedItem}
              />
            )
          })
        ) : (
          <SwiperFlatList
            showPagination={data.length !== 1}
            paginationActiveColor="#242424"
            paginationDefaultColor="#D8D8D8"
            paginationStyleItem={styles.pagination}
            windowSize={2}>
            {data.map((list, index) => {
              return (
                <ProductsPage
                  swiper={true}
                  data={list}
                  key={index}
                  didSelectedItem={this._didSelectedItem}
                />
              )
            })}
          </SwiperFlatList>
        )}
      </View>
    )
  }
}
class ProductsPage extends PureComponent {
  render() {
    const { data, swiper, didSelectedItem } = this.props
    return (
      <View style={styles.page}>
        {data.map((item, index) => {
          return (
            <SwiperItem
              swiper={swiper}
              item={item}
              key={index}
              index={index}
              didSelectedItem={didSelectedItem}
            />
          )
        })}
      </View>
    )
  }
}

class OtherProductsItem extends PureComponent {
  _didSelectedItem = () => {
    const { item, index, didSelectedItem } = this.props
    didSelectedItem(item, index)
  }
  render() {
    const { item } = this.props
    return (
      <TouchableOpacity
        style={styles.listView}
        activeOpacity={0.65}
        onPress={this._didSelectedItem}>
        <View style={styles.row}>
          <Image
            style={styles.productImage}
            source={{
              uri: item.catalogue_photos[0]
                ? item.catalogue_photos[0].medium_url
                : ''
            }}
          />
          <View style={styles.description}>
            <Text numberOfLines={1} style={styles.name}>
              {item.brand.name}
            </Text>
            <Text numberOfLines={1} style={styles.productTitle}>
              {item.title}
            </Text>
          </View>
        </View>
        <Icons name={'ios-arrow-forward'} size={20} color={'#ccc'} />
      </TouchableOpacity>
    )
  }
}

class SwiperItem extends PureComponent {
  _didSelectedItem = () => {
    const { item, index, didSelectedItem } = this.props
    didSelectedItem(item, index)
  }
  render() {
    const { item } = this.props
    return (
      <TouchableOpacity
        style={styles.swiperContainer}
        activeOpacity={0.65}
        onPress={this._didSelectedItem}>
        <View style={styles.column}>
          <Image
            style={styles.swiperImage}
            source={{
              uri: item.catalogue_photos[0]
                ? item.catalogue_photos[0].medium_url
                : ''
            }}
          />
          <View style={styles.descriptionColumn}>
            <Text numberOfLines={1} style={styles.swiperName}>
              {item.brand.name}
            </Text>
            <Text numberOfLines={1} style={styles.swiperProductTitle}>
              {item.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 10,
    marginHorizontal: p2d(16),
    borderBottomColor: '#f3f3f3',
    borderBottomWidth: 1
  },
  titleView: { paddingTop: 32, paddingBottom: 24, flexDirection: 'row' },
  detailsSubTitle: {
    fontSize: 18,
    color: '#242424',
    fontWeight: '600',
    marginRight: 10
  },
  productImage: { width: p2d(80), height: p2d(120) },
  listView: {
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: {
    flexDirection: 'column',
    width: p2d(104)
  },
  description: {
    justifyContent: 'center',
    marginLeft: 15
  },
  descriptionColumn: {
    justifyContent: 'center'
  },
  name: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10
  },
  productTitle: { fontSize: 12, color: '#666' },
  pagination: {
    width: 6,
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: p2d(10),
    marginRight: -2
  },
  page: {
    flexDirection: 'row',
    width: width - p2d(32)
  },
  swiperImage: {
    width: p2d(103),
    height: p2d(156)
  },
  swiperProductTitle: {
    fontSize: 10,
    color: '#666'
  },
  swiperName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6
  },
  swiperContainer: {
    marginRight: p2d(16),
    marginBottom: p2d(30)
  }
})
