/* @flow */

import React from 'react'
import { inject, observer } from 'mobx-react'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import {
  QNetwork,
  SERVICE_TYPES,
  Mutate
} from '../../expand/services/services.js'
import { Column } from '../../expand/tool/add_to_closet_status'
import {
  View,
  StyleSheet,
  Animated,
  DeviceEventEmitter,
  Platform
} from 'react-native'
import {
  ProductList,
  ButtonFilters,
  ProductListHeader,
  ScrollToTopButton,
  AllLoadedFooter,
  EmptyProduct,
  ProductSizeFilterButton,
  ProductSizeFilterAlert,
  ProductSizeFilterTiroGuid,
  SeasonGuide,
  ProductsListCollection
} from '../../../storybook/stories/products'
import { SafeAreaView } from '../../../storybook/stories/navigationbar'
import AuthenticationComponent from '../../components/authentication'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import Statistics from '../../expand/tool/statistics'
import { filterNewFilterTerms } from '../../expand/tool/filter'
import onScrollForAnimation from '../../expand/tool/onScrollForAnimation'
import { initViewableItemsOnFocus } from '../../expand/tool/daq'
import _ from 'lodash'
@inject(
  'productsClothingStore',
  'currentCustomerStore',
  'closetStore',
  'UIScreen',
  'modalStore',
  'appStore',
  'guideStore',
  'viewableStore',
  'abTestStore'
)
@observer
class Products extends AuthenticationComponent {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      showFilter: false,
      filtersRefresh: false
    }
    this.isLoading = false
    this.scrollY = new Animated.Value(0)
    /*
     * We attach style opacity for iOS to workaround
     * https://github.com/facebook/react-native/issues/18347
     * opacity: Animated.add(1, Animated.multiply(0, this.scrollY))
     */
    this._styleFixNativeAnimation = Platform.select({
      ios: {
        opacity: Animated.add(1, Animated.multiply(0, this.scrollY))
      },
      android: {}
    })
    this.listeners = []
    this.idCounter = null
    this.isPlayAnimatedItem = this._checkAnimatedStatus()
  }
  componentDidMount() {
    this._addObservers()
    this._cleanFiltersAndRefresh(true)
  }
  componentWillUnmount() {
    super.componentWillUnmount()
    this.scrollY.removeAllListeners()
    this.listeners.map(item => {
      item.remove()
    })
  }
  onSignIn() {
    this._cleanFiltersAndRefresh(true)
    this.isPlayAnimatedItem = this._checkAnimatedStatus()
  }
  onSignOut() {
    this._cleanFiltersAndRefresh()
    this.isPlayAnimatedItem = this._checkAnimatedStatus()
  }

  _checkAnimatedStatus = () => {
    const { currentCustomerStore, abTestStore } = this.props
    return (
      Platform.OS === 'ios' &&
      (currentCustomerStore.isSubscriber ||
        abTestStore.on_scroll_animated_list === 2)
    )
  }

  _getComponentRefData = () => {
    const headerLength = this._productList._component._listRef._headerLength
    const averageCellLength = this._productList._component._listRef
      ._averageCellLength
    let rowLength = this._productList._component._getItem.length
    const refsData = {
      headerLength,
      averageCellLength,
      rowLength
    }
    return refsData
  }

  _onScrollForAnimation = value => {
    const {
      viewableStore,
      productsClothingStore: { productHybird }
    } = this.props
    const differentValue =
      value - this.preValue > 0 ? value - this.preValue : this.preValue - value
    this.preValue = value
    //限制滑动速度，小于100/100ms才触发onScrollForAnimation，updateOnfocusIndex
    if (differentValue > 100) {
      return
    }
    if (this.isPlayAnimatedItem) {
      if (!this.componentRefsData) {
        this.componentRefsData = this._getComponentRefData()
      }
      const index = onScrollForAnimation(value, this.componentRefsData)
      const currentId =
        productHybird.length && productHybird[index] && productHybird[index].id
      viewableStore.updateOnfocusIndex(currentId)
    }
  }

  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      _.debounce(this._onScrollForAnimation, 100)(value)

      const height = this._productList._component._listRef._headerLength || 224

      if (value > height && !this.state.showFilter) {
        this.setState({ showFilter: true })
      }
      if (value < height && this.state.showFilter) {
        this.setState({ showFilter: false })
      }
    })
    this.listeners.push(
      DeviceEventEmitter.addListener('onRefreshProductsClothing', data => {
        if (data && data.filters) {
          const { filters } = data
          const { productsClothingStore } = this.props
          productsClothingStore.filters.filter_terms = filters.filter_terms
          productsClothingStore.filters.color_families = filters.color_families
          productsClothingStore.filters.temperature = filters.temperature
          productsClothingStore.filter_selections = filters.filter_selections
          productsClothingStore.secondFilterTerms = filters.secondFilterTerms
        }
        this._filtersRefresh(true)
      })
    )
    this.listeners.push(
      DeviceEventEmitter.addListener('toggleProductSizeFilter', data => {
        this._toggleProductSizeFilter(data)
      })
    )
    const { navigation } = this.props
    this.listeners.push(
      navigation.addListener('willFocus', () => {
        this._showProductSizeFilterTiroGuid()
        initViewableItemsOnFocus(this.viewableItems)
      })
    )
  }

  _getReportData = index => {
    const { navigation, productsClothingStore } = this.props
    const { routeName } = navigation.state
    const variables = this._getQueryVariables()
    variables.filters.page--

    let column
    const { __typename } = productsClothingStore.productHybird[index]
    switch (__typename) {
      case 'Product':
        column = Column.ClothingProduct
        break
      case 'BrowseCollection':
        column = Column.ClothingCollection
        break
      case 'Look':
        column = Column.ClothingLookBook
        break
      case 'CustomerPhotoV2':
        column = Column.ClothingCustomerPhoto
        break
      default:
        column = Column.Clothing
        break
    }
    return { variables, column, index, router: routeName }
  }

  _getQueryVariables = () => {
    const { currentCustomerStore, productsClothingStore } = this.props
    const {
      filters,
      filter_selections,
      secondFilterTerms
    } = productsClothingStore

    const { search_context, filter_terms } = filterNewFilterTerms(
      filters,
      secondFilterTerms,
      filter_selections
    )
    let newFilters = {
      ...filters,
      filter_terms,
      in_stock_in_my_size: !!currentCustomerStore.productsSizeFilter
    }
    const variables = { filters: newFilters, search_context }
    if (currentCustomerStore.isSubscriber) {
      variables.filters.sort = 'fashion_recommended_for_customer_group'
    }
    if (currentCustomerStore.season_sort_switch.selected_option) {
      variables.sorts = {
        season: currentCustomerStore.season_sort_switch.selected_option
      }
    }
    return variables
  }

  _getProductListData = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { currentCustomerStore, productsClothingStore } = this.props
    const {
      filters,
      cleanProducts,
      addProducts,
      addPreProducts
    } = productsClothingStore
    const { isSubscriber } = currentCustomerStore
    const variables = this._getQueryVariables()
    this.idCounter = QNetwork(
      isSubscriber
        ? SERVICE_TYPES.products.QUERY_PRODUCTS_HYBRID
        : SERVICE_TYPES.products.QUERY_PRODUCTS,
      variables,
      response => {
        if (response.idCounter && this.idCounter !== response.idCounter) {
          return
        }
        this.isLoading = false
        filters.page++
        if (this.state.filtersRefresh || this.state.refreshing) {
          cleanProducts()
          this._scrollToOffset()
        }
        isSubscriber
          ? addProducts(response.data.product_hybrid)
          : addPreProducts(response.data.products)
        this.setState({ filtersRefresh: false, refreshing: false })
      },
      () => {
        this.setState({ filtersRefresh: false, refreshing: false })
        this.isLoading = false
      }
    )
  }
  _scrollToOffset = () => {
    if (this.scrollY._value > this.props.UIScreen.window.height) {
      this._productList._component.scrollToOffset({
        x: 0,
        y: 0,
        animated: false
      })
    }
  }
  _cleanFiltersAndRefresh = refresh => {
    const { productsClothingStore } = this.props
    productsClothingStore.resetProducts()
    refresh && this._getProductListData()
  }
  _updateFilters = (type, item) => {
    const { updateFilters } = this.props.productsClothingStore
    updateFilters(type, item)
  }
  _productListEmptyComponent = () => {
    return this.props.productsClothingStore.isMore &&
      !this.state.filtersRefresh ? (
      <View style={styles.emptyView}>
        <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
      </View>
    ) : (
      <EmptyProduct />
    )
  }
  //加载
  _onEndReached = () => {
    this.props.productsClothingStore.isMore && this._getProductListData()
  }
  //刷新
  _onRefresh = () => {
    this.props.productsClothingStore.refreshProducts()
    this.setState({ refreshing: true }, () => {
      this._getProductListData()
    })
  }
  _filtersRefresh = isRefresh => {
    const {
      refreshProducts,
      filters,
      filter_selections,
      secondFilterTerms
    } = this.props.productsClothingStore
    refreshProducts && refreshProducts()
    this.setState({ filtersRefresh: true })
    DeviceEventEmitter.emit('currentFilterTerms', {
      productType: 'clothing',
      filters: { ...filters, filter_selections, secondFilterTerms }
    })
    this.isLoading = false
    this._getProductListData()
  }
  _didSelectedItem = item => {
    const { navigate } = this.props.navigation
    switch (item.__typename) {
      case 'BrowseCollection':
        if (item.collection_type === 'link') {
          navigate('WebPage', {
            uri: item.link,
            shareThumbImage: item.banner_photo_url,
            title: item.title,
            actions: item.website_render_actions
          })
        } else {
          navigate('Collection', {
            collection: item,
            type: 'collection',
            column: Column.ClothingCollection
          })
        }
        break
      case 'Look':
        navigate('ProductLooks', { id: item.id })
        break
      case 'CustomerPhotoV2':
        navigate('CustomerPhotoDetails', { id: item.id, data: item })
        break
      default:
        navigate('Details', {
          item,
          column: Column.ClothingProduct,
          hasFeedAnimation: true
        })
    }
  }
  _productListHeader = () => {
    const {
      filters,
      filter_selections,
      secondFilterTerms
    } = this.props.productsClothingStore
    const currentFilters = {
      ...filters,
      filter_selections
    }

    return (
      <View>
        <ProductsListCollection
          bannerType={'clothing_list_top'}
          navigation={this.props.navigation}
        />
        <ProductListHeader
          openFilterView={this._openFilterView}
          onRefresh={this._filtersRefresh}
          filterType={'clothing'}
          filters={currentFilters}
          secondFilterTerms={secondFilterTerms}
          updateFilters={this._updateFilters}
        />
      </View>
    )
  }

  _openFilterView = () => {
    const {
      filters,
      filter_selections,
      secondFilterTerms
    } = this.props.productsClothingStore
    DeviceEventEmitter.emit('currentFilterTerms', {
      productType: 'clothing',
      filters: { ...filters, filter_selections, secondFilterTerms }
    })
    this.props.navigation.openDrawer()
  }
  _getRef = ref => {
    this._productList = ref
  }
  _productListFooter = () => {
    const { productsClothingStore } = this.props
    return productsClothingStore.productHybird.length > 4 ? (
      <AllLoadedFooter
        isMore={productsClothingStore.isMore}
        filtersRefresh={this.state.filtersRefresh}
      />
    ) : null
  }

  _toggleProductSizeFilter = (data, openProductSizeFilter) => {
    if (this.isProductSizeFilterLoading) {
      return
    }
    this.isProductSizeFilterLoading = true
    const { currentCustomerStore, appStore } = this.props
    const { productsSizeFilter } = currentCustomerStore
    if (productsSizeFilter) {
      Statistics.onEvent({
        id: 'close_products_size_filter',
        label: '关闭智能选码'
      })
    }
    let input = {
      products_size_filter: openProductSizeFilter
        ? openProductSizeFilter
        : !productsSizeFilter
    }
    Mutate(
      SERVICE_TYPES.products.CREATE_CUSTOMER_PRODUCTS_SIZE_FILTER,
      { input },
      response => {
        this.isProductSizeFilterLoading = false
        const {
          products_size_filter,
          is_reminded_with_size_filter,
          errors
        } = response.data.CreateCustomerProductsSizeFilter
        this.props.currentCustomerStore.productsSizeFilter = products_size_filter
        this.props.currentCustomerStore.isRemindedWithSizeFilter = is_reminded_with_size_filter
        if (errors) {
          this._showProductSizeFilterAlert(errors)
          return
        }
        this._onRefresh()
        if (products_size_filter) {
          if (data.isFinishedStyleEdit) {
            appStore.showToast('正在比对尺码预计3分钟后生效', 'success', 3000)
          } else {
            !openProductSizeFilter &&
              appStore.showToast('已隐藏不合身商品', 'success', 1500)
          }
        } else {
          appStore.showToast('已显示全部商品', 'success', 1500)
        }
      },
      () => {
        this.isProductSizeFilterLoading = false
      }
    )
  }

  _showProductSizeFilterTiroGuid = () => {
    const { modalStore, currentCustomerStore, guideStore } = this.props
    if (
      currentCustomerStore.isRemindedWithSizeFilter &&
      !this.state.showFilter
    ) {
      currentCustomerStore.isRemindedWithSizeFilter = false
      modalStore.show(
        <ProductSizeFilterTiroGuid
          onPress={this._hideProductSizeFilterTiroGuid}
        />
      )
    } else if (
      currentCustomerStore.season_change_prompt &&
      !guideStore.productSeasonGuide
    ) {
      modalStore.show(
        <SeasonGuide
          nickname={currentCustomerStore.nickname}
          seasonChangePrompt={currentCustomerStore.season_change_prompt}
          hideSeasonGuide={this.hideSeasonGuide}
        />
      )
    }
  }

  hideSeasonGuide = () => {
    const { modalStore, guideStore } = this.props
    modalStore.hide()
    guideStore.productSeasonGuide = true
  }

  _hideProductSizeFilterTiroGuid = () => {
    let data = {}
    let openProductSizeFilter = true
    this._toggleProductSizeFilter(data, openProductSizeFilter)
    this.props.modalStore.setModalVisible(false)
  }

  _completeStyle = () => {
    Statistics.onEvent({
      id: 'complete_style',
      label: '点击弹窗完成尺码'
    })
    this.props.navigation.navigate('OnlyStyle', {
      styleIncomplete: true,
      openProductsSizeFilter: true
    })
  }

  _showProductSizeFilterAlert = errors => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        title={'智能选码'}
        messageComponent={<ProductSizeFilterAlert message={errors} />}
        cancel={{ title: '我知道了', type: 'normal' }}
        other={[
          { type: 'highLight', title: '去填写', onClick: this._completeStyle }
        ]}
      />
    )
  }

  _onViewableItems = array => {
    this.viewableItems = array
  }

  render() {
    const { productsClothingStore, currentCustomerStore } = this.props
    const { isSubscriber, productsSizeFilter } = currentCustomerStore
    return (
      <SafeAreaView style={styles.container}>
        {this.state.showFilter == true ? (
          <ButtonFilters
            openFilterView={this._openFilterView}
            productsStore={productsClothingStore}
          />
        ) : null}
        {this.state.showFilter === true ? (
          <ScrollToTopButton component={this._productList} />
        ) : (
          isSubscriber && (
            <ProductSizeFilterButton
              toggleProductSizeFilter={this._toggleProductSizeFilter}
              bottunState={productsSizeFilter}
            />
          )
        )}
        <ProductList
          isViewableFeed
          isViewableImageAnimated
          onViewableItems={this._onViewableItems}
          getReportData={this._getReportData}
          getRef={this._getRef}
          data={productsClothingStore.productHybird}
          extraData={productsClothingStore.filters}
          didSelectedItem={this._didSelectedItem}
          onEndReached={this._onEndReached}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          ListEmptyComponent={this._productListEmptyComponent}
          ListHeaderComponent={this._productListHeader}
          ListFooterComponent={this._productListFooter}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            { useNativeDriver: true, isInteraction: false }
          )}
        />
        {!!this.state.filtersRefresh && (
          <View style={styles.loadingView} pointerEvents={'none'}>
            <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
          </View>
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  }
})

export default Products
