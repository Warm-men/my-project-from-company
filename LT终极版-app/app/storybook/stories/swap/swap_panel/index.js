/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import TopView from './swap_top_view'
import Products from './swap_product_list'
import BottomView from './swap_action_buttons'

export default class SwapPanel extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedProducts: [] }

    this.categoryProducts = []
    this.otherProducts = this.props.toteProducts

    this._getCategoryInfo()
  }

  _getCategoryInfo = () => {
    const { currentProduct, toteProducts, isOnboarding } = this.props
    if (currentProduct.category_rule) {
      const { slug, swap_ban_threshold } = currentProduct.category_rule

      this.slug = slug
      this.maxLength = swap_ban_threshold

      this.categoryProducts = toteProducts.filter(({ product }) => {
        return product.category_rule && product.category_rule.slug === slug
      })

      this.otherProducts = toteProducts.filter(({ product }) => {
        return !product.category_rule || product.category_rule.slug !== slug
      })

      this.isThreshold = this.categoryProducts.length >= this.maxLength
    }
  }

  _updateSelectedProducts = selectedProducts => {
    if (!this.isThreshold) {
      this.setState({ selectedProducts })
      return
    }
    const selected = selectedProducts.filter(({ product }) => {
      return product.category_rule && product.category_rule.slug === this.slug
    })

    if (this.categoryProducts.length - selected.length < this.maxLength) {
      this.setState({ selectedProducts })
    } else {
      this.setState({ selectedProducts: selected })
    }
  }

  _getProductsWithCategory = () => {
    const products = [...this.categoryProducts, ...this.otherProducts]
    let array = this._getCurrentProductsStatus(products, true)

    if (!this.isThreshold) return array

    //onboarding Tote 限制
    if (this.props.isOnboarding) {
      if (this.categoryProducts.length >= this.maxLength) {
        array = this._getCurrentProductsStatus(products)
      }
      return array
    }

    // TODO: 新衣箱的品类限制
    let selectedSlots = 0

    const selected = this.state.selectedProducts.filter(item => {
      const { product, slot } = item
      if (product.category_rule && product.category_rule.slug === this.slug) {
        if (slot) selectedSlots = selectedSlots + slot
        return true
      }
      return false
    })
    array = this._getCurrentProductsStatus(products)
    //不超过品类限制
    if (this.categoryProducts.length - selected.length < this.maxLength) {
      const { voidCount, currentProduct } = this.props
      if (
        selectedSlots + voidCount < currentProduct.tote_slot ||
        selected.length > 1
      ) {
        //当前选中的限制品类商品的衣位，和衣箱剩余的衣位，不满足替换，剩下的全部都可以选择
        //已经选择一件限制商品后，剩下的全部都可以选择
        array = this._getCurrentProductsStatus(products, true)
      }
    }
    return array
  }

  _getCurrentProductsStatus = (products, unlock) => {
    const { currentProduct } = this.props
    const array = products.map(data => {
      const { product } = data

      const bool = unlock
        ? product.category.accessory === currentProduct.category.accessory
        : product.category_rule && product.category_rule.slug === this.slug
      return { data, disabled: !bool }
    })
    return array
  }

  render() {
    const {
      currentProduct,
      currentProductSize,
      swapCurrentTote,
      voidCount,
      isOnboarding,
      cancel
    } = this.props
    const toteSlot = currentProduct.tote_slot

    const array = this._getProductsWithCategory()

    return (
      <View style={styles.container}>
        <TopView
          cancel={cancel}
          isOnboarding={isOnboarding}
          currentProduct={currentProduct}
          isThreshold={this.isThreshold}
        />
        {!!array && (
          <Products
            isOnboarding={isOnboarding}
            voidCount={voidCount}
            selectedProducts={this.state.selectedProducts}
            currentProduct={currentProduct}
            updateSelectedProducts={this._updateSelectedProducts}
            products={array}
          />
        )}
        <BottomView
          voidCount={voidCount}
          currentProduct={currentProduct}
          currentProductSize={currentProductSize}
          selectedProducts={this.state.selectedProducts}
          swapCurrentTote={swapCurrentTote}
          isOnboarding={isOnboarding}
        />
      </View>
    )
  }
}
SwapPanel.defaultProps = {
  voidCount: 0
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingLeft: 15,
    backgroundColor: '#fff'
  }
})
