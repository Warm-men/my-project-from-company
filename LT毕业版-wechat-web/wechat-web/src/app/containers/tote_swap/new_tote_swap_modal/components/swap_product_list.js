/* @flow */

import React, { PureComponent } from 'react'
import ProductItem from './swap_product_item'

import Swiper from 'react-id-swiper'

import 'react-id-swiper/lib/styles/css/swiper.css'
import 'src/app/components/custom_components/swiper.scss'

export default class Products extends PureComponent {
  constructor(props) {
    super(props)

    this.options = {
      lazy: true,
      freeMode: true,
      spaceBetween: 6,
      preloadImages: false,
      slidesPerView: 'auto',
      paginationClickable: true,
      freeModeMinimumVelocity: 0.1,
      observer: true
    }
  }

  _renderItem = item => {
    const { selectedProducts, isOnboarding } = this.props
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
  /**
   * 替换弹窗中点击商品处理逻辑
   *
   * @memberof Products
   */
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
        array.pop()
        array.push(item)
        updateSelectedProducts && updateSelectedProducts(array)
      } else {
        //判断衣位容量 是否可以添加
        const count = array.length ? this.getToteSlot(array) + voidCount : 0
        const maxCount = currentProduct.tote_slot
        //检查是否可以继续选择被替换的单品
        if (count < maxCount) {
          array.push(item)
          updateSelectedProducts && updateSelectedProducts(array)
        }
      }
    }
  }

  getToteSlot = cartItems => {
    let currentCount = 0
    cartItems &&
      cartItems.forEach(item => {
        currentCount = currentCount + item.product.tote_slot
      })
    return currentCount
  }

  render() {
    const { products } = this.props
    return (
      <div>
        <Swiper
          slideClass="custom-swiper-slide"
          wrapperClass="custom-swiper-wrapper"
          {...this.options}
        >
          {_.map(products, (item, index) => {
            return <div key={index}>{this._renderItem(item)}</div>
          })}
        </Swiper>
      </div>
    )
  }
}
