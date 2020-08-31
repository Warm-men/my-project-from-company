/* @flow */

import React from 'react'
import { View, StyleSheet, Dimensions, Animated } from 'react-native'
import AuthenticationComponent from '../../components/authentication'
import {
  QNetwork,
  Mutate,
  SERVICE_TYPES
} from '../../expand/services/services.js'
import { inject, observer } from 'mobx-react'
import SwapActions from '../../expand/tool/swap'
import { LookBook, SimilarProducts, ProductShare } from './details'
import {
  ProductDetailsSize,
  ProductDescription,
  DetailsBottomBar,
  DetailsNonMemberBottomBar,
  OtherProducts,
  Swiper,
  ProductDetailsTitleView,
  AddToCartAnimated,
  ProductDetailFreeservice,
  ServiceIntroduction
} from '../../../storybook/stories/products/details'
import ProductItem from '../../../storybook/stories/products/experiment/product_list_item'
import {
  ScrollToTopButton,
  AllLoadedFooter
} from '../../../storybook/stories/products'
import SwapPanel from '../../../storybook/stories/swap/swap_panel'
import ChooseSizePanel from '../../../storybook/stories/swap/choose_size_panel'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import GuideView from '../common/GuideView'
import StatisticsActions from '../../expand/statistics'
import Statistics from '../../expand/tool/statistics'
import {
  viewableDetails,
  viewableItemsInProductDetails,
  updateViewableItemStatus
} from '../../expand/tool/daq'
import p2d from '../../expand/tool/p2d'
import OperationGuideView from '../../../storybook/stories/alert/operation_guide_view'
import ProductCustomerPhotos from '../customer_photos/customer_photos_in_product'
import _ from 'lodash'
import { Column } from '../../expand/tool/add_to_closet_status'
import { onClickJoinMember } from '../../expand/tool/plans/join_member'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')
const CATALOGUE_PHOTO_HEIGHT = p2d(480)
const hiddenContentOffsetY = (CATALOGUE_PHOTO_HEIGHT * 3) / 4

@inject(
  'totesStore',
  'currentCustomerStore',
  'toteCartStore',
  'modalStore',
  'panelStore',
  'appStore',
  'guideStore'
)
@observer
class Details extends AuthenticationComponent {
  constructor(props) {
    super(props)
    const { currentCustomerStore, navigation } = props
    if (currentCustomerStore.id) {
      //判断style是否更新，如果更新需要刷新product更新推荐尺码
      this.styleUpdatedAt = currentCustomerStore.style.updated_at
    }

    const { item, inSwap, column } = navigation.state.params
    this.productId = item.id
    this.inSwap =
      currentCustomerStore.isSubscriber && currentCustomerStore.displayCartEntry
        ? true
        : inSwap
    this.column = column ? column : '' //记录栏位

    const { inToteProduct } = this._getCurrentToteAndProductStatus()
    this.state = {
      inToteProduct,
      currentSize: inToteProduct ? inToteProduct.product_size : null,
      isAccessory: item.category.accessory,
      product: {}, // 商品详情
      requestedRealtimeSize: false,
      realtimeRecommendedSize: null,
      realtimeFitMessages: [],
      hiddenScrollToTopButton: true,
      similarProducts: [],
      showFreeServiceBanner: false
    }
    this.listeners = []
    this.scrollY = new Animated.Value(0)
    this.hasPermission = this._hasSharePermission()
    this.listConfig = [
      'CataloguePhotos',
      'Title',
      'Sizes',
      'FreeService',
      'OtherProducts',
      'Look',
      'ServiceIntroduction',
      'Description',
      'CustomerPhotos',
      'SimilarProducts'
    ]
  }

  _hasSharePermission = () => {
    const { isSubscriber, subscription } = this.props.currentCustomerStore
    return isSubscriber &&
      subscription.promo_code !== 'LTCN_FREE_TOTE' &&
      subscription.promo_code !== 'LTCN_FREE_TOTE_79'
      ? true
      : false
  }

  componentDidMount() {
    this._getProductDetailData()
    this._addObservers()
  }
  componentWillUnmount() {
    super.componentWillUnmount()
    this.scrollY.removeAllListeners()
    this.listeners.map(item => {
      item.remove()
    })
  }
  _addObservers = () => {
    const { navigation, currentCustomerStore } = this.props

    this.listeners.push(
      navigation.addListener('willFocus', () => {
        const { id, style } = currentCustomerStore
        if (id && style.updated_at !== this.styleUpdatedAt) {
          this._getRealtimeRecommendedSizeAndSizeFitMessage()
        }

        const { inToteProduct } = this._getCurrentToteAndProductStatus()
        this.setState({ inToteProduct })
      })
    )
    this.listeners.push(
      navigation.addListener('willBlur', () => {
        this.setState({ showFreeServiceBanner: false })
      })
    )
  }

  /*
    用户登录状态
    */
  _login = () => {
    this.props.currentCustomerStore.setLoginModalVisible(true)
  }
  onSignIn() {
    this._getProductDetailData()
    const { inToteProduct } = this._getCurrentToteAndProductStatus()
    const { isSubscriber, displayCartEntry } = this.props.currentCustomerStore
    if (isSubscriber && displayCartEntry) {
      this.inSwap = true
    }
    this.setState({
      inToteProduct,
      currentSize: inToteProduct ? inToteProduct.product_size : null
    })
  }
  onSignOut() {}

  /*
    更新是否是onboarding
    获取当前商品是否在ToteCart中
    */
  _getCurrentToteAndProductStatus = () => {
    const { currentCustomerStore, totesStore, toteCartStore } = this.props
    // 判断是否是 onboarding
    const { finishedOnboardingQuestions, isSubscriber } = currentCustomerStore
    this.isOnboarding = finishedOnboardingQuestions === 'ALL' && !isSubscriber
    let cart
    if (this.isOnboarding) {
      cart = SwapActions.formatOnboardingTote(
        totesStore.latest_rental_tote,
        this.isOnboarding
      )
    } else {
      // 购物车
      cart = toteCartStore
    }
    const id = this.productId
    const inToteProduct = SwapActions.inCurrentToteCart(id, cart.toteCart)
    return { cart, inToteProduct }
  }

  /*
    页面数据请求
  */
  _getProductDetailData = () => {
    const id = this.productId
    QNetwork(SERVICE_TYPES.products.QUERY_PRODUCT_DETAIL, { id }, response => {
      viewableDetails(id, this.column)
      const { product } = response.data
      this.setState({ product, isAccessory: product.category.accessory })

      this._getRealtimeRecommendedSizeAndSizeFitMessage()

      StatisticsActions.productDetails.reportVisitProduct(product, this.column)

      setTimeout(this.showGuide, 100)
    })
  }

  showGuide = () => {
    const { currentCustomerStore, guideStore, modalStore } = this.props
    if (modalStore.currentRoute !== 'Details') {
      return
    }
    if (
      !guideStore.productGuideShowed &&
      currentCustomerStore.displayCartEntry
    ) {
      modalStore.show(
        <OperationGuideView
          column={'productDetails'}
          onFinishedGuide={() => {
            guideStore.productGuideShowed = true
          }}
        />
      )
    }
  }

  _getRealtimeRecommendedSizeAndSizeFitMessage = () => {
    QNetwork(
      SERVICE_TYPES.products.QUERY_REALTIME_RECOMMENDED_SIZE_AND_PRODUCT_SIZES,
      { id: this.productId },
      response => {
        const {
          realtime_product_recommended_size_and_product_sizes
        } = response.data
        let recommendedSize, productSizes, lockMessage
        if (realtime_product_recommended_size_and_product_sizes) {
          const {
            recommended_size,
            product_sizes,
            recommended_message
          } = realtime_product_recommended_size_and_product_sizes
          recommendedSize = recommended_size
          productSizes = product_sizes
          lockMessage = recommended_message
        }
        this._handleProductRecommendedSize(
          recommendedSize,
          productSizes,
          lockMessage
        )
      },
      () => {
        this.setState({ requestedRealtimeSize: true })
      }
    )
  }
  _handleProductRecommendedSize = (
    realtimeRecommendedSize,
    realtimeFitMessages,
    lockMessage
  ) => {
    const { currentCustomerStore } = this.props
    const hasStylesForRecommend = currentCustomerStore.hasStylesForRecommend()
    this.setState({
      lockMessage,
      requestedRealtimeSize: true,
      realtimeRecommendedSize: hasStylesForRecommend
        ? realtimeRecommendedSize
        : null,
      realtimeFitMessages
    })
    if (!realtimeRecommendedSize || !hasStylesForRecommend) {
      return
    }

    SwapActions.initSelectedSize(
      realtimeRecommendedSize,
      this.state.product.product_sizes,
      currentSize => {
        if (!this.state.currentSize && !this.state.inToteProduct) {
          this.setState({ currentSize })
        }
        //上报有库存状态
        StatisticsActions.productDetails.reportProductStockStatus(
          this.state.product,
          currentSize
        )
      }
    )
  }

  _extractUniqueKey(item, index) {
    return index.toString()
  }

  _goBack = () => {
    this.props.navigation.pop(1)
  }
  //跳转到品牌详情列表页面
  _pushToBrandDetail = () => {
    const { navigation } = this.props
    const brand = this.state.product.brand || navigation.state.params.item.brand
    if (brand) {
      const { id, image_url } = brand
      navigation.push('Brand', { brandId: id, bannerUrl: image_url })
    }
  }

  _pendingToAddToTote = () => {
    const { modalStore, currentCustomerStore } = this.props
    if (!currentCustomerStore.id) {
      this._login()
      return
    }
    const { rent_warn } = this.state.product
    if (!!rent_warn) {
      modalStore.show(
        <CustomAlertView
          message={rent_warn}
          cancel={{ title: '取消', type: 'highLight' }}
          other={[
            {
              title: '确定',
              type: 'highLight',
              onClick: this._addToTote
            }
          ]}
        />
      )
    } else {
      this._addToTote()
    }
  }

  _addToTote = () => {
    const { toteCartStore } = this.props
    const { cart } = this._getCurrentToteAndProductStatus()

    const reportData = {
      variables: { id: this.state.product.id },
      column: this.column,
      router: 'Details'
    }
    toteCartStore.updateReportData(reportData)

    SwapActions.canAddToToteCart(
      this.state.product,
      this.state.currentSize,
      cart,
      callback => {
        const { status } = callback
        switch (status) {
          case SwapActions.ADD_TO_TOTE_CART_STATUS.OK:
            {
              this._addProductToToteCart()
            }
            break
          case SwapActions.ADD_TO_TOTE_CART_STATUS.REPLACE_SAME_PRODUCT:
            {
              //直接替换单品的尺码
              this._updateProductSizeInToteCart()
            }
            break
          case SwapActions.ADD_TO_TOTE_CART_STATUS.NEED_SWAP_DIFFERENT_PRODUCT:
            {
              //显示换装模块
              setTimeout(() => {
                this._showSwapPanel()
              }, 500)
            }
            break
          case SwapActions.ADD_TO_TOTE_CART_STATUS.NEED_CHOOSE_SIZE:
            {
              // 去选择尺码
              this._needChooesSize()
            }
            break
          default:
            // 不处理
            break
        }
      }
    )
  }

  _addProductToToteCart = () => {
    SwapActions.addProductToToteCart(this.state.currentSize.id, () => {
      this._showAddToCartAnimated()
      const { inToteProduct } = this._getCurrentToteAndProductStatus()
      this.setState({ inToteProduct })
    })
  }

  _showSwapPanel = () => {
    const { product, currentSize } = this.state
    const { cart } = this._getCurrentToteAndProductStatus()
    const { toteProducts, voidCount } = SwapActions.getCartItemsAndVoidCount(
      product,
      cart
    )
    this.props.panelStore.show(
      <SwapPanel
        cancel={this._popPanelHide}
        currentProduct={product}
        currentProductSize={currentSize}
        toteProducts={toteProducts}
        voidCount={voidCount}
        swapCurrentTote={this._swapNewToteProduct}
        isOnboarding={this.isOnboarding}
      />
    )
  }

  // 未选择尺码 点击换衣 默认选择推荐尺码
  _needChooesSize = () => {
    const { product, realtimeRecommendedSize } = this.state
    if (!product.product_sizes) return

    SwapActions.initSelectedSize(
      realtimeRecommendedSize,
      product.product_sizes,
      currentSize => {
        const { panelStore } = this.props
        if (currentSize) {
          this.setState({ currentSize }, () => {
            this._showSwapPanel()
          })
        } else {
          const { realtimeFitMessages, inToteProduct } = this.state
          panelStore.show(
            <ChooseSizePanel
              product={product}
              didFinished={this._didFinished}
              inToteProduct={inToteProduct}
              fitMessages={realtimeFitMessages}
              recommendedSize={realtimeRecommendedSize}
              lockMessage={this.state.lockMessage}
            />
          )
        }
      }
    )
  }

  _didFinished = (product, selectedSize) => {
    this.setState({ currentSize: selectedSize }, () => {
      this._pendingToAddToTote()
    })
  }
  /*
   *** 替换当前已经在ToteCart中的单品的尺码
   */
  _updateProductSizeInToteCart = () => {
    const { currentSize, product, inToteProduct } = this.state
    if (this.isOnboarding) {
      this._swapNewToteProduct([inToteProduct], product, currentSize, 0)
    } else {
      const updateProductSize = true
      this._replaceForToteCart(currentSize, [inToteProduct], updateProductSize)
    }
  }

  // 换新的衣服或者饰品
  _swapNewToteProduct = (toteProducts, product, currentSize, voidCount) => {
    let item
    if (this.isOnboarding) {
      item = toteProducts[0]
      const sizeChange = item.product.id === product.id
      this._swapToteProduct(
        item.id,
        product.id,
        currentSize.size.name,
        sizeChange
      )
    } else {
      //检查衣位是否匹配
      if (
        SwapActions.canSwapWithProductInToteCart(
          [product],
          toteProducts,
          voidCount
        )
      ) {
        const updateProductSize = false
        this._replaceForToteCart(currentSize, toteProducts, updateProductSize)
      }
    }
  }

  /*
   *** ToteCart 换装
   */
  _replaceForToteCart = (currentSize, toteProducts) => {
    const ids = [currentSize.id]
    const oldIds = []
    toteProducts.forEach(item => {
      oldIds.push(item.product_size.id)
    })
    SwapActions.replaceForToteCart(ids, oldIds, () => {
      const { inToteProduct } = this._getCurrentToteAndProductStatus()
      this._showAddToCartAnimated()
      this.setState({ inToteProduct })
      this._popPanelHide()
    })
  }
  /*
   *** onboarding 换装
   */
  _swapToteProduct = (tote_product_id, product_id, size_string, sizeChange) => {
    const input = { tote_product_id, product_id, size_string }
    if (this.state.realtimeRecommendedSize) {
      input.recommended_size_string = this.state.realtimeRecommendedSize.name
    }
    const { appStore, totesStore } = this.props
    Mutate(
      SERVICE_TYPES.totes.MUTATION_TOTE_SWAP_PRODUCT,
      { input },
      response => {
        appStore.showToastWithOpacity(sizeChange ? '换码成功' : '换装成功')
        const { tote_product } = response.data.SwapToteProduct
        totesStore.swapToteProduct(tote_product_id, tote_product)

        const { inToteProduct } = this._getCurrentToteAndProductStatus()
        this.setState({ inToteProduct })
        this._popPanelHide()
      },
      error => {
        appStore.showToast(error, 'error')
      }
    )
  }

  _popPanelHide = () => {
    this.props.panelStore.hide()
  }

  _showAddToCartAnimated = () => {
    const { modalStore } = this.props
    const cataloguePhotos = this.state.product.catalogue_photos
    if (!cataloguePhotos) {
      return
    }
    const imageUrl = cataloguePhotos[0].zoom_url || cataloguePhotos[0].full_url
    if (!imageUrl) {
      return
    }
    modalStore.show(
      <AddToCartAnimated
        height={deviceHeight}
        width={deviceWidth}
        style={styles.cataloguePhotos}
        imageUrl={imageUrl}
        finishedAnimated={() => {
          if (this.bottomBar && this.bottomBar._animatedToteCartIcon) {
            this.bottomBar._animatedToteCartIcon()
          }
          modalStore.hide()

          //检查是否需要弹出自在选banner
          this._displayFreeServiceBanner()
        }}
      />
    )
  }

  _pushToSizeChart = () => {
    const { navigation } = this.props
    const { realtimeRecommendedSize, product } = this.state
    navigation.navigate('SizeChart', {
      productSizes: product.product_sizes,
      category: product.category,
      realtimeRecommendedSize: realtimeRecommendedSize,
      id: navigation.state.params.item.id
    })
  }
  //选择尺码
  _onSelectProductSize = currentSize => {
    this.setState({ currentSize })
  }
  _onSelectProductSizeInPanel = currentSize => {
    this._popPanelHide()
    setTimeout(() => {
      this.setState({ currentSize }, () => {
        this._pendingToAddToTote()
      })
    }, 500)
  }

  //废弃
  _pushToBasicSize = () => {
    if (!this.props.currentCustomerStore.id) {
      this._login()
      return
    }
    this.props.navigation.navigate('BasicSize', { isRecommend: true })
  }

  _pushToStyle = () => {
    if (this.props.currentCustomerStore.id) {
      this.props.navigation.navigate('OnlyStyle', { styleIncomplete: true })
    } else {
      this._login()
    }
  }
  _share = () => {
    const { panelStore, navigation } = this.props
    const product = this.state.product.id
      ? this.state.product
      : navigation.state.params.item

    panelStore.show(<ProductShare product={product} navigation={navigation} />)
  }

  _joinMember = () => {
    const { navigation, currentCustomerStore } = this.props
    onClickJoinMember(navigation)
    if (currentCustomerStore.id) {
      navigation.navigate('JoinMember')
    } else {
      this._login()
    }
  }

  goShoppingCar = () => {
    this.props.navigation.push('ShoppingCar')
  }

  _rhytidectomyTricks = () => {
    this.props.navigation.navigate('WebPage', {
      uri: 'https://static.letote.cn/pages/iron_clothes_tip/index.html',
      hideShareButton: true
    })
  }

  _extractUniqueKey = (item, index) => {
    return index.toString()
  }
  _renderItem = ({ item }) => {
    const { navigation, currentCustomerStore, modalStore } = this.props
    const { params } = navigation.state
    const product = this.state.product.id ? this.state.product : params.item

    const hasStylesForRecommend = currentCustomerStore.hasStylesForRecommend()
    const hasCompleteSizes = currentCustomerStore.hasCompleteSizes()
    const { freeService } = currentCustomerStore
    const inSwap = this.inSwap
    const id = this.productId

    let hiddenImage = false
    if (modalStore && modalStore.currentRoutes && navigation) {
      const index = modalStore.currentRoutes.findIndex(i => {
        return i.key === navigation.state.key
      })

      if (index !== -1) {
        const maxIndex = modalStore.currentRoutes.length - 1
        hiddenImage = maxIndex - index > 1
      }
    }

    switch (item) {
      case 'CataloguePhotos':
        const { swappable, disabled } = product
        const abnormal = !swappable || disabled

        const feeds =
          params.hasFeedAnimation && !abnormal && this.state.product
            ? this.state.product.feed
            : null
        return (
          <Swiper
            feeds={feeds}
            data={product.catalogue_photos}
            hiddenImage={hiddenImage}
          />
        )
        break
      case 'Title':
        return (
          <ProductDetailsTitleView product={product} navigation={navigation} />
        )
        break
      case 'Sizes':
        return product.product_sizes && this.state.requestedRealtimeSize ? (
          <ProductDetailsSize
            style={!this.state.isAccessory && { minHeight: 123 }}
            productSizes={product.product_sizes}
            realtimeRecommendedSize={this.state.realtimeRecommendedSize}
            realtimeFitMessages={this.state.realtimeFitMessages}
            lockMessage={this.state.lockMessage}
            inToteProduct={this.state.inToteProduct}
            currentSize={this.state.currentSize}
            onSelect={this._onSelectProductSize}
            pushToSizeChart={this._pushToSizeChart}
            isSubscriber={currentCustomerStore.isSubscriber}
            hasStylesForRecommend={hasStylesForRecommend}
            hasCompleteSizes={hasCompleteSizes}
            pushToStyle={this._pushToStyle}
            shouldShowReasons={this.state.isAccessory ? false : true}
          />
        ) : (
          <View style={{ height: 123 }} />
        )
        break
      case 'FreeService':
        return (
          <ProductDetailFreeservice
            isAccessory={this.state.isAccessory}
            navigation={navigation}
            freeService={freeService}
          />
        )
      case 'OtherProducts':
        return (
          <OtherProducts
            navigation={navigation}
            inSwap={inSwap}
            otherProducts={product.other_products_in_catalog_photos}
          />
        )
        break
      case 'Look':
        return (
          <LookBook
            id={id}
            inSwap={inSwap}
            navigation={navigation}
            looks={product.primary_looks}
          />
        )
        break
      case 'ServiceIntroduction':
        return <ServiceIntroduction navigation={navigation} />
        break
      case 'Description':
        return (
          <ProductDescription
            product={product}
            pushToBrandDetail={this._pushToBrandDetail}
            rhytidectomyTricks={this._rhytidectomyTricks}
          />
        )
        break
      case 'CustomerPhotos':
        return <ProductCustomerPhotos id={id} navigation={navigation} />
        break
      case 'SimilarProducts':
        return (
          <SimilarProducts
            id={id}
            updateSimilarProducts={this._updateSimilarProducts}
          />
        )
        break
      default:
        {
          const isString = typeof item === 'string'
          if (isString) {
            return null
          } else {
            const { key, index, items } = item
            if (key === 'SimilarProduct') {
              const width = deviceWidth / 2,
                height = currentCustomerStore.isSubscriber
                  ? Math.round(width * 1.9)
                  : Math.round(width * 1.9 + 40)

              const leftIndex = index * 2
              const rightIndex = index * 2 + 1
              return (
                <View style={{ flexDirection: 'row' }}>
                  <ProductItem
                    style={{ width, height }}
                    index={leftIndex}
                    currentKey={items[0].id}
                    product={items[0]}
                    didSelectedItem={this._didSelectedSimilarProductsItem}
                    hiddenImage={hiddenImage}
                    isSubscriber={currentCustomerStore.isSubscriber}
                    getReportData={this._getReportData}
                  />
                  {items[1] ? (
                    <ProductItem
                      style={{ width, height }}
                      index={rightIndex}
                      currentKey={items[0].id}
                      product={items[1]}
                      didSelectedItem={this._didSelectedSimilarProductsItem}
                      hiddenImage={hiddenImage}
                      isSubscriber={currentCustomerStore.isSubscriber}
                      getReportData={this._getReportData}
                    />
                  ) : null}
                </View>
              )
            } else {
              return null
            }
          }
        }
        break
    }
  }

  _getReportData = index => {
    const { routeName } = this.props.navigation.state
    const variables = { id: this.productId }
    const column = Column.SimilarProducts
    return { variables, column, index, router: routeName }
  }

  _updateSimilarProducts = similarProducts => {
    this.setState({ similarProducts })
  }

  _didSelectedSimilarProductsItem = (item, index) => {
    const column = Column.SimilarProducts
    const { navigation } = this.props
    const inSwap = this.inSwap
    navigation.push('Details', { item, column, inSwap })

    const id = item.id
    const data = this._getReportData(index)
    updateViewableItemStatus(id, { id, pushToDetail: true }, data)
  }

  _listFooterComponent = () => {
    return this.state.similarProducts.length > 2 ? (
      <AllLoadedFooter isMore={false} />
    ) : null
  }

  _onViewableItemsChanged = ({ viewableItems, changed }) => {
    const data = _.minBy(viewableItems, item => {
      return item.index
    })
    if (data) {
      this.setState({ hiddenScrollToTopButton: data.index < 3 })
      viewableItemsInProductDetails(changed, this.state.product)
    }
  }

  _displayFreeServiceBanner = () => {
    const { currentCustomerStore, toteCartStore } = this.props
    const { toteCart, nowClothingCount } = toteCartStore
    const { product } = this.state
    if (!toteCart || !product) return

    if (product.type === 'Clothing') {
      if (nowClothingCount === toteCart.max_clothing_count) {
        if (
          toteCart.nth_tote === 2 &&
          !toteCart.with_free_service &&
          currentCustomerStore.inFirstMonthAndMonthlySubscriber
        ) {
          this.setState({ showFreeServiceBanner: true })
        }
      }
    }
  }

  goFreeService = () => {
    const { navigation } = this.props
    Statistics.onEvent({ id: 'freeservice_product' })
    navigation.navigate('OpenFreeService')
  }

  render() {
    const { currentCustomerStore, navigation, modalStore } = this.props
    const { item, inJoinMemberList } = navigation.state.params
    const product = this.state.product.id ? this.state.product : item

    const inSwap = this.inSwap

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <NavigationBar
            isAnimated={true}
            style={[
              styles.navigationBar,
              {
                opacity: this.scrollY.interpolate({
                  inputRange: [0, hiddenContentOffsetY, CATALOGUE_PHOTO_HEIGHT],
                  outputRange: [0, 0, 1]
                })
              }
            ]}
            title={product.title}
            // titleView={
            //   <View style={styles.titleView}>
            //     <Text style={styles.titleText}>{product.title}</Text>
            //     <Text style={styles.brandText}>
            //       {product.brand && product.brand.name}
            //     </Text>
            //   </View>
            // }
          />
          <Animated.FlatList
            ref={flatlist => (this._theFlatList = flatlist)}
            keyExtractor={this._extractUniqueKey}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            extraData={modalStore.currentRoutes}
            data={[...this.listConfig, ...this.state.similarProducts]}
            renderItem={this._renderItem}
            onViewableItemsChanged={this._onViewableItemsChanged}
            scrollEventThrottle={16}
            style={styles.scrollView}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
              {
                useNativeDriver: true,
                isInteraction: false
              }
            )}
            ListFooterComponent={this._listFooterComponent}
          />
          <BarButtonItem
            onPress={this._goBack}
            style={styles.barButtonItem}
            buttonType={'back'}
          />
          <BarButtonItem
            onPress={this._share}
            style={[styles.barButtonItem, styles.shareButton]}
            buttonType={'share'}
          />
          {!this.state.hiddenScrollToTopButton && (
            <ScrollToTopButton
              style={styles.scrollToTopButton}
              component={this._theFlatList}
            />
          )}
          {currentCustomerStore.isSubscriber || inSwap || inJoinMemberList ? (
            <DetailsBottomBar
              ref={bottomBar => (this.bottomBar = bottomBar)}
              addToTote={this._pendingToAddToTote}
              column={this.column}
              inSwap={inSwap}
              product={product}
              inToteProduct={this.state.inToteProduct}
              selectedSize={this.state.currentSize}
              isSubscriber={currentCustomerStore.isSubscriber}
              goShoppingCar={this.goShoppingCar}
              displayCartEntry={currentCustomerStore.displayCartEntry}
              showFreeServiceBanner={this.state.showFreeServiceBanner}
              goFreeService={this.goFreeService}
            />
          ) : (
            <DetailsNonMemberBottomBar
              column={this.column}
              product={product}
              navigation={navigation}
              joinMember={this._joinMember}
            />
          )}
          {!!this.hasPermission && <GuideView />}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navigationBar: { position: 'absolute' },
  barButtonItem: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: 'rgba(255, 255, 255,0)'
  },
  shareButton: { paddingLeft: 0, right: 0 },
  titleView: { alignItems: 'center' },
  titleText: { fontSize: 14 },
  brandText: { fontSize: 12, marginTop: 5 },
  scrollView: { backgroundColor: 'white', flex: 1 },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 100,
    right: 12,
    zIndex: 2,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cataloguePhotos: {
    width: deviceWidth,
    height: CATALOGUE_PHOTO_HEIGHT,
    overflow: 'hidden'
  }
})

export default Details
