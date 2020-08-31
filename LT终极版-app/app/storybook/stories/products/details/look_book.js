/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icons from 'react-native-vector-icons/Ionicons'
import LookbookProducts from '../../lookbook/lookbook_products'
import p2d from '../../../../src/expand/tool/p2d'
import {
  DAQ_TYPE,
  updateViewableItemStatus
} from '../../../../src/expand/tool/daq'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'

export default class LookBook extends PureComponent {
  _openLookBookDetail = () => {
    const { navigation, inSwap, data } = this.props
    const id = data.id
    const column = Column.ProductLookBook

    navigation.push('LookbookDetail', { id, inSwap, column })

    const attributes = { column, type: DAQ_TYPE.Look }
    updateViewableItemStatus(id, { id, pushToDetail: true }, attributes)
  }
  render() {
    const { data } = this.props
    if (!data) {
      return null
    }
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this._openLookBookDetail}>
        <View style={styles.row}>
          <View style={styles.row}>
            <Text style={styles.textTitle}>主题穿搭</Text>
          </View>
          <Icons name={'ios-arrow-forward'} size={20} color={'#ccc'} />
        </View>
        <View style={styles.contentView}>
          <LookbookProducts
            style={{ justifyContent: 'flex-start' }}
            data={data}
            hideDesc={true}
            mainProduct={styles.mainProduct}
            accessories={styles.accessories}
            collocationProduct={styles.collocationProduct}
          />
          <View style={styles.textContainer}>
            <Text style={styles.productDesc} numberOfLines={2}>
              {data.name}
            </Text>
            <ProductName data={data.primary_product} />
            <ProductName data={data.default_second_binding_product} />
            <ProductName data={data.default_first_binding_product} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

class ProductName extends PureComponent {
  render() {
    const { data } = this.props
    if (!data) {
      return null
    }
    const { title, brand } = data
    return (
      <View>
        <Text numberOfLines={1} style={styles.productName}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.brand}>
          {brand ? brand.name : ''}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f3f3',
    marginHorizontal: 15,
    paddingRight: 9,
    paddingVertical: 24
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
  textTitle: {
    fontWeight: '600',
    fontSize: 18,
    color: '#242424'
  },
  mainProduct: {
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(115),
    height: p2d(172)
  },

  collocationProduct: {
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(77),
    height: p2d(115)
  },
  accessories: {
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(50),
    height: p2d(76)
  },
  productDesc: {
    color: '#242424',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10
  },
  productName: {
    marginTop: 12,
    color: '#242424',
    fontSize: 12
  },
  brand: {
    marginTop: 5,
    color: '#5E5E5E',
    fontSize: 10
  },
  textContainer: { width: p2d(132) }
})
