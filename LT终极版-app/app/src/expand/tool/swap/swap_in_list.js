import React from 'react'
import SwapActions from './'
import { SERVICE_TYPES, QNetwork } from '../../services/services'
import Stores from '../../../stores/stores'

import ChooseSizePanel from '../../../../storybook/stories/swap/choose_size_panel'
import SwapPanel from '../../../../storybook/stories/swap/swap_panel'
/*
  获取当前单品的尺码信息
*/
const getProductSizeAndRecomendedSizeWithProductId = (
  id,
  successCallback,
  errorCallback
) => {
  QNetwork(
    SERVICE_TYPES.products.QUERY_PANEL_PRODUCT_SIZES,
    { id },
    response => {
      const {
        product,
        realtime_product_recommended_size_and_product_sizes
      } = response.data

      let fitMessages, lockMessage, recommendedSize

      if (realtime_product_recommended_size_and_product_sizes) {
        const {
          recommended_size,
          product_sizes,
          recommended_message
        } = realtime_product_recommended_size_and_product_sizes

        fitMessages = product_sizes
        lockMessage = recommended_message

        const hasStylesForRecommend = Stores.currentCustomerStore.hasStylesForRecommend()
        recommendedSize = hasStylesForRecommend ? recommended_size : null
      }

      successCallback &&
        successCallback({ recommendedSize, fitMessages, lockMessage, product })
    },
    () => {
      errorCallback && errorCallback()
    }
  )
}

const addToToteCartInList = (product, reportData) => {
  // 统计参数
  Stores.toteCartStore.updateReportData(reportData)
  getProductSizeAndRecomendedSizeWithProductId(product.id, data => {
    const inToteProduct = SwapActions.inCurrentToteCart(
      product.id,
      Stores.toteCartStore.toteCart
    )
    const { recommendedSize, fitMessages, lockMessage } = data
    const newProduct = { ...product, ...data.product }
    Stores.panelStore.show(
      <ChooseSizePanel
        product={newProduct}
        didFinished={didFinished}
        inToteProduct={inToteProduct}
        fitMessages={fitMessages}
        recommendedSize={recommendedSize}
        lockMessage={lockMessage}
      />
    )
  })
}

const didFinished = (product, selectedSize) => {
  const cart = Stores.toteCartStore
  SwapActions.canAddToToteCart(product, selectedSize, cart, callback => {
    const { status } = callback
    switch (status) {
      case SwapActions.ADD_TO_TOTE_CART_STATUS.OK:
        SwapActions.addProductToToteCart(selectedSize.id, () => {
          Stores.appStore.showToastWithOpacity('加入成功')
        })
        break
      case SwapActions.ADD_TO_TOTE_CART_STATUS.REPLACE_SAME_PRODUCT:
        updateProductSizeInToteCart(product, selectedSize)
        break
      case SwapActions.ADD_TO_TOTE_CART_STATUS.NEED_SWAP_DIFFERENT_PRODUCT:
        setTimeout(() => {
          showSwapPanel(product, selectedSize)
        }, 500)

        break
      default:
        // 不处理
        break
    }
  })
}

const updateProductSizeInToteCart = (product, selectedSize) => {
  const inToteProduct = SwapActions.inCurrentToteCart(
    product.id,
    Stores.toteCartStore.toteCart
  )
  const updateProductSize = true
  replaceForToteCart(selectedSize, [inToteProduct], updateProductSize)
}

const showSwapPanel = (product, selectedSize) => {
  const { toteProducts, voidCount } = SwapActions.getCartItemsAndVoidCount(
    product,
    Stores.toteCartStore
  )
  Stores.panelStore.show(
    <SwapPanel
      cancel={Stores.panelStore.hide}
      currentProduct={product}
      currentProductSize={selectedSize}
      toteProducts={toteProducts}
      voidCount={voidCount}
      swapCurrentTote={swapCurrentTote}
    />
  )
}

const swapCurrentTote = (toteProducts, product, currentSize, voidCount) => {
  if (
    SwapActions.canSwapWithProductInToteCart([product], toteProducts, voidCount)
  ) {
    replaceForToteCart(currentSize, toteProducts)
  }
}

const replaceForToteCart = (currentSize, toteProducts, updateProductSize) => {
  const ids = [currentSize.id]
  const oldIds = []
  toteProducts.forEach(item => {
    oldIds.push(item.product_size.id)
  })
  SwapActions.replaceForToteCart(ids, oldIds, () => {
    Stores.panelStore.hide()
    Stores.appStore.showToastWithOpacity(
      updateProductSize ? '换码成功' : '换装成功'
    )
  })
}

export default { addToToteCartInList }
