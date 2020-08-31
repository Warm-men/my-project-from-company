import React from 'react'
import AuthenticationComponent from '../../components/authentication'
import {
  View,
  StyleSheet,
  DeviceEventEmitter,
  Animated,
  Platform
} from 'react-native'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { inject, observer } from 'mobx-react'
import { Column } from '../../expand/tool/add_to_closet_status'
import SwapActions from '../../expand/tool/swap/swap_in_list'
import { filterNewFilterTerms } from '../../expand/tool/filter'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
import {
  NavigationBar,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import NoClosetProduct from '../../../storybook/stories/closet/no_closet_product'
import {
  ProductList,
  AllLoadedFooter,
  EmptyProduct,
  ScrollToTopButton
} from '../../../storybook/stories/products'
import ShoppingCarIcon from '../../../storybook/stories/tote_cart/shopping_car_icon'

import p2d from '../../expand/tool/p2d'
import FilterHeader from '../../../storybook/stories/closet/filter_header'
import SatisfiedTitle from '../../../storybook/stories/closet/satisfied_title'

@inject(
  'currentCustomerStore',
  'UIScreen',
  'closetStore',
  'panelStore',
  'guideStore',
  'modalStore'
)
@observer
class MyCloset extends AuthenticationComponent {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      filtersRefresh: false,
      showFilter: false,
      selectedType: 'all',
      perfectClosetStats: null,
      inToggleSwitchOn: true
    }
    this.isLoading = false

    this.scrollY = new Animated.Value(0)
    this._styleFixNativeAnimation = Platform.select({
      ios: {
        opacity: Animated.add(1, Animated.multiply(0, this.scrollY))
      },
      android: {}
    })
    this.listeners = []
    this.idCounter = null
    this.isClickedFilter = false
  }
  componentDidMount() {
    if (this.props.currentCustomerStore.id) {
      this._getClosetListData()
      this._getSatisfiedCount()
    }
    this._addObservers()
  }

  _getSatisfiedCount = () => {
    QNetwork(
      SERVICE_TYPES.closet.QEURY_SATISFIED_COUNT,
      {},
      response => {
        this.setState({
          perfectClosetStats: response.data.me.perfect_closet_stats
        })
      },
      error => {}
    )
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.scrollY.removeAllListeners()
    this.listeners.map(item => {
      item.remove()
    })
  }
  onSignIn() {
    this._getSatisfiedCount()
    this._getClosetListData()
  }
  onSignOut() {
    // TODO: clean store
  }
  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      if (value > p2d(195) && !this.state.showFilter) {
        this.setState({ showFilter: true })
      }
      if (value < p2d(195) && this.state.showFilter) {
        this.setState({ showFilter: false })
      }
    })
    const { closetStore } = this.props
    this.listeners.push(
      DeviceEventEmitter.addListener(
        'onRefreshProductsCloset',
        ({ filters }) => {
          closetStore.filters.filter_terms = filters.filter_terms
          closetStore.filters.color_families = filters.color_families
          closetStore.filters.temperature = filters.temperature
          closetStore.filter_selections = filters.filter_selections
          closetStore.secondFilterTerms = filters.secondFilterTerms
          this._filtersRefresh()
        }
      )
    )

    this.listeners.push(
      DeviceEventEmitter.addListener('onRefreshSatisfiedProducts', () => {
        this._getSatisfiedCount()
      })
    )
  }
  _openFilterView = () => {
    const {
      filters,
      filter_selections,
      secondFilterTerms
    } = this.props.closetStore
    const { selectedType } = this.state
    const productType =
      selectedType === 'all' ? 'closet' : 'closet-' + selectedType
    //防止 drawbleFilter 默认选中重置
    const { filter_terms } = filters
    const filterTerm = filter_terms[0]
    const filter = {
      ...filters,
      filter_terms:
        filter_terms.length === 1 &&
        (filterTerm === 'all' ||
          filterTerm === 'clothing' ||
          filterTerm === 'accessory')
          ? []
          : filter_terms
    }
    DeviceEventEmitter.emit('currentFilterTerms', {
      productType: productType,
      filters: { ...filter, filter_selections, secondFilterTerms }
    })
    this.props.navigation.openDrawer()
  }
  _getRef = ref => {
    this._productList = ref
  }
  _getClosetListData = () => {
    if (this.isLoading) {
      return
    }
    const {
      filters,
      filter_selections,
      secondFilterTerms
    } = this.props.closetStore
    this.isLoading = true
    if (!filters.filter_terms.length)
      filters.filter_terms =
        this.state.selectedType === 'all' ? [] : [this.state.selectedType]
    filters.sort = this.state.inToggleSwitchOn
      ? 'closet_stock_first'
      : 'closet_created_first'
    const { search_context, filter_terms } = filterNewFilterTerms(
      filters,
      secondFilterTerms,
      filter_selections
    )
    let newFilters = { ...filters, filter_terms }
    const variables = { filters: newFilters, search_context, in_closet: true }
    this.idCounter = QNetwork(
      SERVICE_TYPES.closet.QUERY_CLOSET,
      variables,
      response => {
        if (response.idCounter && this.idCounter !== response.idCounter) {
          return
        }
        this.isLoading = false
        this.props.closetStore.filters.page++
        if (this.state.refreshing || this.state.filtersRefresh) {
          if (this.scrollY._value > this.props.UIScreen.window.height) {
            this._productList._component.scrollToOffset({
              x: 0,
              y: 0,
              animated: false
            })
          }
          this.props.closetStore.cleanProducts()
        }
        this.props.closetStore.addProducts(response.data.products)
        this.setState({ filtersRefresh: false, refreshing: false })
      },
      error => {
        this.isLoading = false
        this.setState({ filtersRefresh: false, refreshing: false })
      }
    )
  }
  //加载
  _onEndReached = () => {
    this.props.closetStore.isMore && this._getClosetListData()
  }
  //刷新
  _onRefresh = () => {
    this.props.closetStore.refreshProducts()
    this.setState({ refreshing: true }, () => {
      this._getClosetListData()
    })
  }
  _didSelectedItem = item => {
    const { navigate } = this.props.navigation
    const column = Column.Closet
    navigate('Details', { item, column })
  }
  _updateFilters = (type, item) => {
    const { updateFilters } = this.props.closetStore
    updateFilters(type, item)
  }
  _resetFilter = type => {
    const { closetStore } = this.props

    if (type === this.state.selectedType) {
      return
    }
    this.setState({ selectedType: type }, () => {
      closetStore.resetFilter()
      this._filtersRefresh()
    })
  }
  _filtersRefresh = () => {
    const {
      refreshProducts,
      filters,
      filter_selections,
      secondFilterTerms
    } = this.props.closetStore
    this.isClickedFilter = true
    const { selectedType } = this.state
    refreshProducts && refreshProducts()
    this.isLoading = false
    this.setState({ filtersRefresh: true }, () => {
      const productType =
        selectedType === 'all' ? 'closet' : 'closet-' + selectedType
      const { filter_terms } = filters
      const filterTerm = filter_terms[0]
      const filter = {
        ...filters,
        filter_terms:
          filter_terms.length === 1 &&
          (filterTerm === 'all' ||
            filterTerm === 'clothing' ||
            filterTerm === 'accessory')
            ? []
            : filter_terms
      }
      DeviceEventEmitter.emit('currentFilterTerms', {
        productType: productType,
        filters: { ...filter, filter_selections, secondFilterTerms }
      })
      this._getClosetListData()
    })
  }
  _getReportData = index => {
    const { routeName } = this.props.navigation.state
    const { filters, filter_selections } = this.props.closetStore
    const selections = filter_selections.map(term => {
      return { slug: term }
    })
    const variables = {
      filters: { ...filters, page: filters.page - 1 },
      filter_selections: [{ slug: 'occasion', selected: selections }]
    }
    const column = Column.Closet
    return { variables, column, index, router: routeName }
  }
  _productListEmptyComponent = () => {
    const { closetStore } = this.props
    const { isMore, filters, filter_selections } = closetStore
    const { perfectClosetStats } = this.state
    const showTitle = perfectClosetStats && perfectClosetStats.product_count
    return isMore && !this.state.filtersRefresh ? (
      <View style={styles.emptyView}>
        <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
      </View>
    ) : this.isLoading ? null : (
      <View>
        {filters.color_families.length ||
        filters.filter_terms.length ||
        filter_selections.length ||
        filters.temperature.length ||
        this.isClickedFilter ? (
          <EmptyProduct />
        ) : (
          <NoClosetProduct
            navigation={this.props.navigation}
            showTitle={showTitle}
          />
        )}
      </View>
    )
  }

  _onPressToggleSwitch = isOn => {
    const { filters } = this.props.closetStore
    this.setState({ inToggleSwitchOn: isOn }, () => {
      filters.sort = this.state.inToggleSwitchOn
        ? 'closet_stock_first'
        : 'closet_created_first'
      this._filtersRefresh()
    })
  }

  _productListHeader = () => {
    const { navigation } = this.props
    return (
      <NavigationBar
        title={'愿望衣橱'}
        rightBarButtonItem={
          <View style={styles.barButtonItemStyle}>
            <ShoppingCarIcon navigation={navigation} />
          </View>
        }
      />
    )
  }
  _renderStickyHeaders = index => {
    const { closetStore, navigation } = this.props
    const { filters, filter_selections } = closetStore
    const { inToggleSwitchOn, perfectClosetStats, selectedType } = this.state
    const showTitle = perfectClosetStats && perfectClosetStats.product_count
    if (index % 2) {
      return null
    }
    if (index === 0) {
      return (
        <SatisfiedTitle
          inCloset={true}
          navigation={navigation}
          perfectClosetStats={perfectClosetStats}
        />
      )
    }
    if (index === 2) {
      return (
        <View>
          <FilterHeader
            inCloset={true}
            inToggleSwitchOn={inToggleSwitchOn}
            onPressToggleSwitch={this._onPressToggleSwitch}
            perfectClosetStats={perfectClosetStats}
            showSatisfiedTitle={false}
            updateFilters={this._updateFilters}
            productsStore={closetStore}
            onRefresh={this._filtersRefresh}
            navigation={navigation}
            selectedType={selectedType}
            openFilterView={this._openFilterView}
            resetFilter={this._resetFilter}
            isClickedFilter={this.isClickedFilter}
          />
          <View>
            {this.isLoading || closetStore.products.length ? null : filters
                .color_families.length ||
              filters.filter_terms.length ||
              filter_selections.length ||
              filters.temperature.length ||
              this.isClickedFilter ? (
              <EmptyProduct />
            ) : (
              <NoClosetProduct
                navigation={this.props.navigation}
                showTitle={showTitle}
              />
            )}
          </View>
        </View>
      )
    }
  }

  _productListFooter = () => {
    const { products, isMore } = this.props.closetStore
    const { filtersRefresh } = this.state
    return products.length > 4 ? (
      <AllLoadedFooter isMore={isMore} filtersRefresh={filtersRefresh} />
    ) : null
  }

  toteCartAddProduct = (product, index) => {
    const reportData = this._getReportData(index)
    SwapActions.addToToteCartInList(product, reportData)
  }

  render() {
    const { currentCustomerStore, closetStore, navigation } = this.props
    const { perfectClosetStats, showFilter, refreshing } = this.state
    let datas = []
    if (
      closetStore.products.length ||
      this.isClickedFilter ||
      (perfectClosetStats && perfectClosetStats.product_count > 0)
    )
      datas = [{}, {}, {}, {}, ...closetStore.products]
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.containerView]}>
          {showFilter ? (
            <ScrollToTopButton component={this._productList} />
          ) : null}
          {currentCustomerStore.id || currentCustomerStore.isSubscriber ? (
            <ProductList
              stickyHeaderIndices={[0, 2]}
              renderStickyHeaders={this._renderStickyHeaders}
              extraData={perfectClosetStats}
              navigation={navigation}
              getRef={this._getRef}
              getReportData={this._getReportData}
              data={datas}
              didSelectedItem={this._didSelectedItem}
              onEndReached={this._onEndReached}
              onRefresh={this._onRefresh}
              refreshing={refreshing}
              ListEmptyComponent={this._productListEmptyComponent}
              ListHeaderComponent={this._productListHeader}
              ListFooterComponent={this._productListFooter}
              columnWrapperStyle={styles.columnWrapperStyle}
              scrollEventThrottle={200}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
                {
                  useNativeDriver: true,
                  isInteraction: false
                }
              )}
              addShoppingCarButton={currentCustomerStore.displayCartEntry}
              toteCartAddProduct={this.toteCartAddProduct}
            />
          ) : (
            <NoClosetProduct navigation={this.props.navigation} />
          )}
          {!!this.state.filtersRefresh && (
            <View style={styles.loadingView} pointerEvents={'none'}>
              <Spinner
                isVisible={true}
                size={40}
                type={'Pulse'}
                color={'#222'}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  containerView: {
    position: 'relative',
    flex: 1
  },
  barButtonItemStyle: {
    minHeight: 35,
    minWidth: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonFiltersView: {
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 10,
    backgroundColor: 'white'
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
  },
  columnWrapperStyle: {}
})

export default MyCloset
