/* @flow */

import React, { PureComponent } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import SwapActions from '../../../../src/expand/tool/swap'
import ProductItem from './swap_product_item'

export default class Products extends PureComponent {
  _extractUniqueKey = (item, index) => {
    return index.toString()
  }
  _renderItem = ({ item }) => {
    const { currentProduct, selectedProducts, isOnboarding } = this.props
    const { data, disabled } = item
    //当前单品是否选中
    const isSelected = !!selectedProducts.find(i => i.id === data.id)

    return (
      <ProductItem
        disable={disabled}
        isSelected={isSelected}
        toteProduct={data}
        isOnboarding={isOnboarding}
        didSelectedItem={this._didSelectedItem}
      />
    )
  }
  _didSelectedItem = item => {
    const {
      currentProduct,
      updateSelectedProducts,
      selectedProducts,
      isOnboarding,
      voidCount
    } = this.props

    const array = [...selectedProducts]
    const index = selectedProducts.findIndex(product => {
      return product.id === item.id
    })

    if (index !== -1) {
      //选中的单品已经在衣箱中 点击取消选中状态
      array.splice(index, 1)
      updateSelectedProducts && updateSelectedProducts(array)
    } else {
      //选中的单品不在衣箱中
      if (isOnboarding) {
        //如果是onboarding Tote 只能替换一件
        if (!array.length) {
          array.push(item)
          updateSelectedProducts && updateSelectedProducts(array)
        }
      } else {
        //判断衣位容量 是否可以添加
        const count = array.length
          ? SwapActions.getToteSlot(array) + voidCount
          : 0
        const maxCount = currentProduct.tote_slot
        const ok = SwapActions.canSelectedCartItemForSwap(count, maxCount)
        if (ok) {
          array.push(item)
          updateSelectedProducts && updateSelectedProducts(array)
        }
      }
    }
  }

  render() {
    const { products, selectedProducts } = this.props
    return (
      <FlatList
        style={styles.container}
        keyExtractor={this._extractUniqueKey}
        extraData={selectedProducts}
        data={products}
        horizontal={true}
        renderItem={this._renderItem}
        showsHorizontalScrollIndicator={false}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20
  }
})
