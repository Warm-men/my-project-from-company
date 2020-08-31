/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text
} from 'react-native'
import Image from '../../image'
import PartsView from './part_view'
export default class ProductList extends PureComponent {
  render() {
    const { style, data, onPress } = this.props
    return (
      <View style={style || styles.container}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {data.map((item, index) => {
            return (
              <ProductItem
                style={index !== 0 ? { marginLeft: 5 } : null}
                key={index}
                onPress={onPress}
                product={item.product}
                amount={item.amount}
                productItem={item.product_item}
              />
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

class ProductItem extends PureComponent {
  openDetail = () => {
    const { product, onPress } = this.props
    onPress && onPress(product)
  }
  render() {
    //有价格需要付款
    const { amount } = this.props
    return amount ? this.renderItemInHand() : this.renderItemReturned()
  }
  openProdctDetail = () => {
    this.props.didSelectedItem(this.props.data)
  }

  renderItemInHand = () => {
    const { amount, product, style } = this.props
    return (
      <TouchableOpacity
        onPress={this.openDetail}
        activeOpacity={0.65}
        style={{ width: 92 }}>
        <View style={[style, styles.noRefund]}>
          <Image
            style={styles.imageViewItem}
            source={{
              uri: product.catalogue_photos[0]
                ? product.catalogue_photos[0].full_url
                : ''
            }}
          />
          <View style={styles.viewContainer}>
            <Text style={styles.price}>￥{amount}</Text>
            <Text style={styles.retailPrice}>￥{product.full_price}</Text>
          </View>
        </View>
        <PartsView
          parts={product.parts}
          partViewStyle={[styles.partView, style]}
          block
        />
      </TouchableOpacity>
    )
  }

  renderItemReturned = () => {
    const { product, style, productItem } = this.props
    const purchased = productItem && productItem.state === 'purchased'
    return (
      <TouchableOpacity
        style={[style, styles.refunded]}
        activeOpacity={0.65}
        onPress={this.openDetail}>
        <Image
          style={styles.imageViewItemRefunded}
          source={{
            uri: product.catalogue_photos[0]
              ? product.catalogue_photos[0].full_url
              : ''
          }}
        />
        <Image
          style={styles.tag}
          source={
            purchased
              ? require('../../../../assets/images/account/purchased.png')
              : require('../../../../assets/images/account/refunded.png')
          }
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  imageViewItem: {
    flex: 1,
    alignItems: 'center',
    width: 86,
    height: 129
  },
  imageViewItemRefunded: {
    alignItems: 'center',
    width: 86,
    height: 129,
    opacity: 0.6
  },
  tag: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
    width: 48,
    height: 16
  },
  viewContainer: {
    justifyContent: 'center',
    width: 86,
    height: 50,
    alignItems: 'center'
  },
  price: {
    color: '#E85C40',
    fontSize: 14
  },
  retailPrice: {
    fontSize: 11,
    color: '#989898',
    marginTop: 5,
    textDecorationLine: 'line-through'
  },
  refunded: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 129
  },
  noRefund: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 179,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E9E9E9'
  },
  partView: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#F7F7F7',
    borderRadius: 1,
    marginRight: 2,
    marginBottom: 2,
    marginTop: 6
  }
})
