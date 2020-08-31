/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
  Text
} from 'react-native'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { inject, observer } from 'mobx-react'
import { QCacheFirst, SERVICE_TYPES } from '../../expand/services/services.js'
import { filterSameProducts } from '../../expand/tool/product_l10n'
import { Column } from '../../expand/tool/add_to_closet_status'
import {
  ProductList,
  AllLoadedFooter,
  EmptyProduct
} from '../../../storybook/stories/products'
import Image from '../../../storybook/stories/image.js'
import {
  NavigationBar,
  BarButtonItem
} from '../../../storybook/stories/navigationbar/index.js'
import SharePanel from '../common/SharePanel'
import { Client } from '../../expand/services/client'
import getBytesLength from '../../expand/tool/get_byts_length'
import { initViewableItemsOnFocus } from '../../expand/tool/daq'
import Icon from 'react-native-vector-icons/Ionicons'
import onScrollForAnimation from '../../expand/tool/onScrollForAnimation'
import _ from 'lodash'

@inject(
  'UIScreen',
  'panelStore',
  'viewableStore',
  'currentCustomerStore',
  'abTestStore'
)
@observer
export default class BrandContainer extends Component {
  constructor(props) {
    super(props)
    const params = props.navigation.state.params
    const sort = 'fashion_recommended_for_customer_group'
    this.listeners = []
    this.scrollY = new Animated.Value(0)
    this.state = {
      refreshing: false,
      showSpinner: false,
      navigationBarOpacity: 0,
      scrollEventThrottle: 1,
      // 品牌数据
      products: [],
      filters: {
        sort,
        page: 1,
        per_page: 20,
        color_families: [],
        filter_terms: [],
        temperature: []
      },
      description: null,
      id: params.brandId || null,
      imageUrl: null,
      name: null,
      slug: null,
      isMore: true,
      isOpenedDescription: false,
      showOpenButton: false
    }
    this.animatedViewWidth = this.props.UIScreen.window.width
    this.animatedViewHeight = (426 * this.props.UIScreen.window.width) / 750
    //scrollY移动1导致的缩放比例
    this.zoomScale = (this.animatedViewHeight + 1) / this.animatedViewHeight
    this.descriptionClampStyle = { lineClamp: 5, lineHeight: 26, fontSize: 14 }
    this.isPlayAnimatedItem = this._checkAnimatedStatus()
  }

  _showSharePanel = () => {
    const { navigation, panelStore } = this.props
    const { brandId } = navigation.state.params
    panelStore.show(
      <SharePanel
        url={Client.ORIGIN + '/brands/' + brandId}
        thumbImage={this.state.imageUrl}
        title={'这个品牌我很喜欢，你呢？'}
      />
    )
  }
  _updateInformation = brand => {
    const { id, description, name, slug } = brand
    this.setState({ id, description, name, slug, imageUrl: brand.image_url })
  }
  _addProducts = products => {
    const newProducts = filterSameProducts(this.state.products, products)
    this.setState({
      products: [...this.state.products, ...newProducts],
      isMore: products.length < this.state.filters.per_page ? false : true
    })
  }

  _cleanProducts = () => {
    this.setState({ products: [] })
  }

  componentDidMount() {
    this._getBrandData()
    this._addObservers()
  }
  componentWillUnmount() {
    this.scrollY.removeAllListeners()
    this.listeners.map(item => {
      item.remove()
    })
  }

  _getComponentRefData = () => {
    const { UIScreen } = this.props
    const navigateBarHeaderHeight =
      Platform.OS === 'ios' ? (UIScreen.window.height >= 812 ? 84 : 64) : 44
    const headerLength = this._productList._component._listRef._headerLength
    const averageCellLength = this._productList._component._listRef
      ._averageCellLength
    let rowLength = this._productList._component._getItem.length

    const refsData = {
      headerLength: headerLength - navigateBarHeaderHeight, //头部组件嵌进导航栏，需减去导航栏高度
      averageCellLength,
      rowLength
    }
    return refsData
  }

  _goBack = () => {
    this.props.navigation.pop(1)
  }
  _getBrandData = () => {
    if (this.state.showSpinner) {
      return
    }
    const id = this.props.navigation.state.params.brandId
    const variables = { id, filters: this.state.filters }
    this.setState({ showSpinner: true })

    QCacheFirst(
      SERVICE_TYPES.brands.QUERY_BRAND_DETAIL,
      variables,
      response => {
        if (this.state.products.length === 0) {
          this._updateInformation(response.data.brand)
        }
        if (this.state.refreshing) {
          this._cleanProducts()
        }
        this._addProducts(response.data.brand.products)
        this.setState({
          filters: { ...this.state.filters, page: this.state.filters.page + 1 },
          refreshing: false,
          showSpinner: false
        })
      },
      () => {
        this.setState({ refreshing: false, showSpinner: false })
      }
    )
  }
  //加载
  _onEndReached = () => {
    this.state.isMore && this._getBrandData()
  }
  _didSelectedItem = item => {
    const { navigation } = this.props
    const column = Column.Brand
    navigation.push('Details', { item, column, hasFeedAnimation: true })
  }
  _productListEmptyComponent = () => {
    return this.state.showSpinner ? (
      <View style={styles.emptyView}>
        <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
      </View>
    ) : (
      <EmptyProduct />
    )
  }
  _checkAnimatedStatus = () => {
    const { currentCustomerStore, abTestStore } = this.props
    return (
      Platform.OS === 'ios' &&
      (currentCustomerStore.isSubscriber ||
        abTestStore.on_scroll_animated_list === 2)
    )
  }

  _onScrollForAnimation = value => {
    const { viewableStore } = this.props
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
      const { products } = this.state
      const currentId = products.length && products[index] && products[index].id
      viewableStore.updateOnfocusIndex(currentId)
    }
  }

  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      _.debounce(this._onScrollForAnimation, 100)(value)

      const hiddenContentOffsetY = (this.animatedViewHeight * 3) / 4
      if (
        value > this.animatedViewHeight &&
        this.state.navigationBarOpacity !== 1
      ) {
        this.setState({ navigationBarOpacity: 1, scrollEventThrottle: 16 })
      } else if (
        value <= this.animatedViewHeight &&
        value >= hiddenContentOffsetY
      ) {
        this.setState({
          scrollEventThrottle: 16,
          navigationBarOpacity:
            (value - hiddenContentOffsetY) /
            (this.animatedViewHeight - hiddenContentOffsetY)
        })
      } else if (
        value < hiddenContentOffsetY &&
        this.state.navigationBarOpacity !== 0
      ) {
        this.setState({ navigationBarOpacity: 0, scrollEventThrottle: 1 })
      }
    })
    const { navigation } = this.props
    this.listeners.push(
      navigation.addListener('willFocus', () => {
        initViewableItemsOnFocus(this.viewableItems)
      })
    )
  }
  transform = () => {
    return [
      {
        scaleY: this.scrollY.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [this.zoomScale, 1, 1]
        })
      },
      {
        scaleX: this.scrollY.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [this.zoomScale, 1, 1]
        })
      },
      {
        translateY: this.scrollY.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-0.45, 0, 0]
        })
      }
    ]
  }
  _getRef = ref => {
    this._productList = ref
  }
  _productListHeader = () => {
    const {
      imageUrl,
      description,
      isOpenedDescription,
      showOpenButton
    } = this.state
    const bannerUrl = imageUrl || this.props.navigation.state.params.bannerUrl
    return (
      <View>
        <Animated.View
          collapsable={false}
          style={{
            width: this.animatedViewWidth,
            height: this.animatedViewHeight,
            transform: this.transform()
          }}>
          {!!bannerUrl && (
            <Image style={styles.banner} source={{ uri: bannerUrl }} />
          )}
        </Animated.View>
        {!!description && (
          <View style={styles.descriptionView}>
            <Text
              style={styles.description}
              numberOfLines={
                isOpenedDescription
                  ? null
                  : this.descriptionClampStyle.lineClamp
              }
              onLayout={this._textOnLayout}>
              {description}
            </Text>
            {showOpenButton && (
              <TouchableOpacity
                onPress={this._toggleDescription}
                style={styles.descriptionButton}>
                <Text style={styles.toggleText}>
                  {isOpenedDescription ? '收起' : '展开'}
                </Text>
                <Icon
                  name={isOpenedDescription ? 'ios-arrow-up' : 'ios-arrow-down'}
                  size={16}
                  style={styles.arrow}
                  color={'#979797'}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    )
  }
  _toggleDescription = () => {
    this.setState({ isOpenedDescription: !this.state.isOpenedDescription })
  }
  _textOnLayout = e => {
    const { lineHeight, fontSize, lineClamp } = this.descriptionClampStyle
    const allLine = parseInt(lineHeight, 10) * lineClamp
    const rowHeight = allLine - (lineHeight + 1)
    const { width, height } = e.nativeEvent.layout
    // NOTE：满足4行
    if (rowHeight <= height) {
      const lineWidth = Math.round(width / (fontSize / 2))
      const { description } = this.state
      const descriptionBytesLength = getBytesLength(description)
      // NOTE:满足超过单行最大
      const numberOfLines = descriptionBytesLength / lineWidth
      if (numberOfLines > this.descriptionClampStyle.lineClamp) {
        this.setState({ showOpenButton: true })
      }
    }
  }
  _productListFooter = () => {
    return this.state.products.length > 4 ? (
      <AllLoadedFooter isMore={this.state.isMore} />
    ) : null
    return
  }
  _getReportData = index => {
    const { params, routeName } = this.props.navigation.state
    const variables = {
      id: params.brandId,
      filters: { ...this.state.filters, page: this.state.filters.page - 1 }
    }
    return { variables, index, column: Column.Brand, router: routeName }
  }

  _onViewableItems = array => {
    this.viewableItems = array
  }

  render() {
    const { UIScreen, currentCustomerStore } = this.props
    return (
      <View style={styles.container}>
        <NavigationBar
          style={[
            styles.navigationBar,
            {
              paddingTop:
                Platform.OS === 'ios'
                  ? UIScreen.window.height >= 812
                    ? 30
                    : 20
                  : 0,
              height:
                Platform.OS === 'ios'
                  ? UIScreen.window.height >= 812
                    ? 84
                    : 64
                  : 44,
              backgroundColor: `rgba(255,255,255,${
                this.state.navigationBarOpacity
              })`,
              borderBottomColor: `rgba(246,246,246,${
                this.state.navigationBarOpacity
              })`
            }
          ]}
          titleView={
            <View
              style={[
                styles.titleView,
                { opacity: this.state.navigationBarOpacity }
              ]}>
              <Text style={styles.titleText}>{this.state.name}</Text>
            </View>
          }
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
          rightBarButtonItem={
            <BarButtonItem
              onPress={this._showSharePanel}
              style={styles.barButtonItem}>
              <Image
                source={require('../../../assets/images/product_detail/share.png')}
                style={{ transform: [{ scale: 0.9 }] }}
              />
            </BarButtonItem>
          }
        />
        <ProductList
          isViewableFeed
          isViewableImageAnimated
          onViewableItems={this._onViewableItems}
          getReportData={this._getReportData}
          data={this.state.products}
          getRef={this._getRef}
          didSelectedItem={this._didSelectedItem}
          scrollEventThrottle={this.state.scrollEventThrottle}
          onEndReached={this._onEndReached}
          ListEmptyComponent={this._productListEmptyComponent}
          ListHeaderComponent={this._productListHeader}
          ListFooterComponent={this._productListFooter}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            { useNativeDriver: true, isInteraction: false }
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navigationBar: {
    position: 'absolute'
  },
  banner: {
    flex: 1
  },
  descriptionView: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: 12
  },
  description: {
    fontWeight: '400',
    fontSize: 14,
    color: '#5E5E5E',
    lineHeight: 26,
    letterSpacing: 0.4
  },
  titleView: {
    alignItems: 'center'
  },
  titleText: {
    fontSize: 16
  },
  barButtonItem: {
    height: 35,
    width: 35,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255,0)',
    marginLeft: 10
  },
  descriptionButton: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  toggleText: {
    fontSize: 12,
    color: '#242424'
  },
  arrow: {
    marginLeft: 7
  },
  rotateArrow: {
    transform: [{ rotate: '-180deg' }]
  }
})
