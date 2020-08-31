/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { format } from 'date-fns'
import p2d from '../../../src/expand/tool/p2d'
import Icon from 'react-native-vector-icons/Entypo'

export default class DressingProductCard extends PureComponent {
  _getIamgeView = isAccessory => {
    const products = this._reSortProduct(isAccessory)
    if (!products.length) return null
    return (
      <View style={styles.productView}>
        {products.map((item, index) => {
          return (
            <Image
              key={index}
              blurRadius={!item.isFocus ? 5 : 0}
              style={styles.productsImage}
              source={{ uri: item.product.catalogue_photos[0].full_url }}
            />
          )
        })}
      </View>
    )
  }

  _reSortProduct = (isAccessory = false) => {
    const { toteProducts } = this.props
    const currentProducts = this._sortToteProducts(toteProducts) //分离衣服和配饰
    const { clothing, accessory } = currentProducts
    const ids = this._getCustomerPhotoProduceIds()
    let currentData = []
    const array = isAccessory ? accessory : clothing
    array.map(item => {
      if (ids.includes(item.product.id)) {
        //在晒单里面的衣服或者配饰，排在前面
        item.isFocus = true
        currentData.unshift(item)
      } else {
        item.isFocus = false
        currentData.push(item)
      }
    })
    if (isAccessory) {
      if (currentData.length > 4) currentData = currentData.slice(0, 4) //配饰最多4个
    } else {
      if (currentData.length > 6) currentData = currentData.slice(0, 6) // 衣服最多6件
    }
    return currentData
  }

  _sortToteProducts = array => {
    if (!array || array.length === 0 || !array[0].product.category) return array
    const clothing = [],
      accessory = []
    array.forEach(item => {
      if (item.product.category.accessory === false) {
        clothing.push(item)
      } else {
        accessory.push(item)
      }
    })
    return { clothing, accessory }
  }

  _getCustomerPhotoProduceIds = () => {
    const { customerPhotos } = this.props
    let ids = []
    customerPhotos.map(
      item => item && item.products.map(v => ids.push(v.product.id))
    )
    //晒单的衣服或者配饰
    return ids
  }
  render() {
    const clothingImageView = this._getIamgeView(false)
    const accesorryImageView = this._getIamgeView(true)
    const { lockedAt } = this.props
    const lockedText = format(lockedAt, 'YYYY-MM-DD')
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.leftText}>{'最近衣箱'}</Text>
          <Text style={styles.rightText}>{lockedText}</Text>
        </View>
        <View style={styles.productView}>
          <View>{clothingImageView}</View>
          <View style={styles.icon}>
            <Icon name={'plus'} size={12} color={'#979797'} />
          </View>
          <View>{accesorryImageView}</View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FDFDFD',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F3F3',
    marginBottom: 16,
    marginTop: 8,
    marginHorizontal: 16,
    paddingVertical: 20,
    paddingHorizontal: 13
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  leftText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500'
  },
  rightText: {
    fontSize: 11,
    color: '#333'
  },
  productsImage: {
    width: p2d(25),
    height: p2d(39),
    marginRight: p2d(5)
  },
  productView: {
    flexDirection: 'row'
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: p2d(5)
  }
})
