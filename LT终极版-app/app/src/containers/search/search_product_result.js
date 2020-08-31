import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  View,
  Animated,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import { SafeAreaView } from '../../../storybook/stories/navigationbar'
import p2d from '../../expand/tool/p2d'
import Icons from 'react-native-vector-icons/SimpleLineIcons'
import { SERVICE_TYPES, QNetwork } from '../../expand/services/services.js'
import { Column } from '../../expand/tool/add_to_closet_status'
import {
  ProductList,
  AllLoadedFooter,
  EmptyProduct,
  ScrollToTopButton
} from '../../../storybook/stories/products'
import SearchProductHeader from './search_product_header'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import StickyFilter from './stickyFilter'
export default class SearchProductResultContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      products: [],
      refreshing: false,
      isMore: true,
      showFilter: false,
      filterList: null,
      filter: null,
      filtersRefresh: false
    }
    this.scrollY = new Animated.Value(0)
    this.page = 1
    this.isLoading = false
    this.idCounter = null
  }
  goBack = () => {
    this.props.navigation.pop(1)
  }

  componentDidMount() {
    this.searchProducts()
    this.addObservers()
  }
  componentWillUnmount() {
    this.scrollY.removeAllListeners()
  }
  searchProducts = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { keyword } = this.props.navigation.state.params
    this.idCounter = QNetwork(
      SERVICE_TYPES.search.SEARCH_PRODUCTS,
      {
        keyword,
        per_page: 20,
        page: this.page,
        filter: this.state.filter
      },
      response => {
        if (response.idCounter && this.idCounter !== response.idCounter) {
          return
        }
        this.isLoading = false
        this.page++
        const { products, filter } = response.data.search_products
        this.setState((prevState, props) => ({
          filterList: filter,
          products:
            prevState.refreshing || prevState.filtersRefresh
              ? [...products]
              : [...prevState.products, ...products],
          refreshing: false,
          isMore: products.length >= 20,
          filtersRefresh: false
        }))
      },
      error => {
        this.setState({ refreshing: false, filtersRefresh: false })
        this.isLoading = false
      }
    )
  }

  _onRefresh = () => {
    this.page = 1
    this.setState(
      {
        refreshing: true,
        isMore: true
      },
      () => {
        this.searchProducts()
      }
    )
  }

  filtersRefresh = () => {
    this.page = 1
    this.isLoading = false
    this.setState(
      {
        filtersRefresh: true,
        isMore: true
      },
      () => {
        this.searchProducts()
      }
    )
  }
  addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      if (value > p2d(120) && !this.state.showFilter) {
        this.setState({ showFilter: true })
      }
      if (value < p2d(120) && this.state.showFilter) {
        this.setState({ showFilter: false })
      }
    })
  }
  onEndReached = () => {
    this.state.isMore && this.searchProducts()
  }
  didSelectedItem = item => {
    const { navigate } = this.props.navigation
    const column = Column.SearchProducts
    navigate('Details', { item, column })
  }
  getReportData = index => {
    const { routeName, params } = this.props.navigation.state
    const column = Column.SearchProducts
    const variables = {
      page: this.page - 1,
      per_page: 20,
      keyword: params.keyword,
      filter: this.state.filter
    }
    return { variables, column, index, router: routeName }
  }
  productListFooter = () => {
    const { products, isMore } = this.state
    return products.length > 4 ? <AllLoadedFooter isMore={isMore} /> : null
  }
  productListEmptyComponent = () => {
    const { filterList, isMore } = this.state
    return !filterList && isMore && !this.isLoading ? (
      <View style={styles.loadingView} pointerEvents={'none'}>
        <ActivityIndicator size={'large'} color="white" />
        <Text style={styles.loadingText}>正在加载</Text>
      </View>
    ) : filterList ? (
      <EmptyProduct />
    ) : (
      <View style={styles.emptyView}>
        <Text style={styles.emptyText}>没有找到相关的单品</Text>
        <Text style={styles.emptyTextMsg}>试试更换搜索的词语</Text>
      </View>
    )
  }

  _getRef = ref => {
    this._productList = ref
  }

  productListHeader = () => {
    return (
      <SearchProductHeader
        onPressItem={this.onPressFilterItem}
        filterList={this.state.filterList}
        filter={this.state.filter}
      />
    )
  }
  onPressFilterItem = (key, filterCategory) => {
    const { filter } = this.state
    let selectedFilterItems = {}
    if (!filter || !filter[filterCategory]) {
      selectedFilterItems[filterCategory] = [key]
    } else {
      const isSelected = filter[filterCategory].filter(item => item === key)
        .length
      if (isSelected) {
        selectedFilterItems[filterCategory] = filter[filterCategory].filter(
          item => item !== key
        )
      } else
        selectedFilterItems[filterCategory] = [...filter[filterCategory], key]
    }
    this.setState(
      (prevState, props) => ({
        filter: { ...prevState.filter, ...selectedFilterItems }
      }),
      () => {
        this.filtersRefresh()
      }
    )
  }

  render() {
    const { navigation } = this.props
    const { keyword } = navigation.state.params
    const { filter } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={this.goBack} style={styles.header}>
          <Icons name={'arrow-left'} size={18} color={'#242424'} />
          <View style={styles.searchView}>
            <Text numberOfLines={1} style={styles.searContent}>
              {keyword}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerLine} />
        <View style={styles.container}>
          {this.state.showFilter ? <StickyFilter filter={filter} /> : null}
          <ProductList
            isViewableFeed
            extraData={filter}
            getRef={this._getRef}
            navigation={navigation}
            getReportData={this.getReportData}
            data={this.state.products}
            didSelectedItem={this.didSelectedItem}
            ListHeaderComponent={this.productListHeader}
            onEndReached={this.onEndReached}
            onRefresh={this._onRefresh}
            refreshing={this.state.refreshing}
            ListEmptyComponent={this.productListEmptyComponent}
            ListFooterComponent={this.productListFooter}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
              {
                useNativeDriver: true,
                isInteraction: false
              }
            )}
          />
        </View>
        {this.state.showFilter ? (
          <ScrollToTopButton component={this._productList} />
        ) : null}
        {this.state.filtersRefresh ? (
          <View style={styles.spinnerView} pointerEvents={'none'}>
            <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
          </View>
        ) : null}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerLine: {
    backgroundColor: '#F7F7F7',
    height: 1,
    width: '100%',
    marginTop: 5
  },
  loadingView: {
    marginTop: 220,
    alignSelf: 'center',
    height: 98,
    width: 98,
    opacity: 0.7,
    backgroundColor: 'black',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: { fontSize: 14, color: 'white', marginTop: 14 },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120
  },
  emptyText: { fontSize: 16, color: '#242424' },
  emptyTextMsg: { marginTop: 12, fontSize: 14, color: '#989898' },
  header: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  searchView: {
    backgroundColor: '#F7F7F7',
    width: p2d(303),
    height: 32,
    justifyContent: 'center',
    paddingLeft: 10,
    borderRadius: 16
  },
  searContent: { fontSize: 14, color: '#5E5E5E' },
  spinnerView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 999
  }
})
