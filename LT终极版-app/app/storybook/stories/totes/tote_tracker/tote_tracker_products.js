/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import ProductItem from './tote_tracker_product_item'
import ActivityItem from './activity_item'
import ClothesCouponItem from './clothes_coupon_Item'

export default class Products extends Component {
  _extractUniqueKey = item => {
    return item.id.toString()
  }

  _renderItem = ({ item, index }) => {
    if (item.id === 'activity' && item.value === true) {
      const { didSelectedActivityItem } = this.props
      return (
        <ActivityItem
          didSelectedActivityItem={didSelectedActivityItem}
          key={index}
          index={index}
        />
      )
    } else if (item.id === 'clothesCoupon' && item.value === true) {
      const { products } = this.props
      if (products[0] && !products[0].customer_coupon_id) {
        const { useCoupon } = this.props
        return (
          <ClothesCouponItem useCoupon={useCoupon} index={index} key={index} />
        )
      }
    } else if (item.product) {
      const {
        didSelectedItem,
        removeCouponToTote,
        inTote,
        state,
        column
      } = this.props

      //已经被购买的商品
      const isPurchased =
        item.product_item && item.product_item.state === 'purchased'
      //是否显示已购买标识
      const showPurchasedIcon = column === 'ToteReturn' && isPurchased
      return (
        <ProductItem
          showPurchasedIcon={showPurchasedIcon}
          product={item.product}
          didSelectedItem={didSelectedItem}
          customerCouponId={item.customer_coupon_id}
          removeCouponToTote={removeCouponToTote}
          key={index}
          index={index}
          inTote={inTote}
          state={state}
        />
      )
    }
  }

  render() {
    const {
      products,
      style,
      hasSummerPlanActivity,
      hasClothesCoupon
    } = this.props
    let data = []
    let findIndex = products.findIndex(function(item) {
      return !!item.customer_coupon_id
    })
    if (hasSummerPlanActivity && hasClothesCoupon && findIndex === -1) {
      data = [
        { id: 'activity', value: hasSummerPlanActivity },
        { id: 'clothesCoupon', value: hasClothesCoupon },
        ...products
      ]
    } else if (hasSummerPlanActivity) {
      data = [{ id: 'activity', value: hasSummerPlanActivity }, ...products]
    } else if (hasClothesCoupon && findIndex === -1) {
      data = [{ id: 'clothesCoupon', value: hasClothesCoupon }, ...products]
    } else {
      data = products
    }
    return (
      <View style={[styles.container, style]}>
        <FlatList
          keyExtractor={this._extractUniqueKey}
          data={data}
          horizontal={true}
          renderItem={this._renderItem}
          showsHorizontalScrollIndicator={false}
          bounces={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    paddingLeft: 8
  }
})
