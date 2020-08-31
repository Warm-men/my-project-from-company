/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  Text
} from 'react-native'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { inject, observer } from 'mobx-react'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
import Image from '../../../storybook/stories/image.js'
import { Column } from '../../expand/tool/add_to_closet_status'
import { filterSameProducts } from '../../expand/tool/product_l10n'
import { initViewableItemsOnFocus } from '../../expand/tool/daq'
import {
  ProductList,
  AllLoadedFooter,
  EmptyProduct
} from '../../../storybook/stories/products'
import {
  NavigationBar,
  BarButtonItem
} from '../../../storybook/stories/navigationbar/index.js'
import dateFns from 'date-fns'
import p2d from '../../../src/expand/tool/p2d'
import SharePanel from '../common/SharePanel'
import { Client } from '../../expand/services/client'
import getBytesLength from '../../expand/tool/get_byts_length'

@inject('UIScreen', 'currentCustomerStore', 'panelStore')
@observer
export default class CollectionContainer extends Component {
  constructor(props) {
    super(props)
    this.scrollY = new Animated.Value(0)
    this.listeners = []
    const {
      activated_since,
      banner_photo_wide_banner_url,
      full_description,
      id,
      title
    } = props.navigation.state.params.collection
    const { type, displayButton } = props.navigation.state.params
    // default sort
    let sort = 'season_first_and_swappable_newest',
      activated_before = null,
      filters = {
        sort,
        activated_before,
        activated_since,
        page: 1,
        per_page: 20,
        color_families: [],
        filter_terms: [],
        temperature: []
      }
    switch (type) {
      case 'hot':
        {
          filters.sort = 'season_first_and_swappable_most_like'
        }
        break
      case 'collection':
        {
          filters.sort = 'display_order'
        }
        break
      case 'occasion':
        {
          filters.filter_terms = ['clothing']
          if (!props.currentCustomerStore.isSubscriber) {
            filters.sort = 'area_based_popularity_recommended'
          }
        }
        break
      case 'newest':
        {
          filters.activated_before = dateFns.format(
            dateFns.addDays(activated_since, 1),
            'YYYY-MM-DD'
          )
          filters.sort = 'clothing_first_and_newest'
        }
        break
    }

    this.state = {
      id,
      filters,
      title,
      showSpinner: false,
      navigationBarOpacity: 0,
      scrollEventThrottle: 1,
      products: [],
      banner: banner_photo_wide_banner_url,
      description: full_description,
      isMore: true,
      isOpenedDescription: false,
      showOpenButton: false,
      displayButton
    }
    this.animatedViewWidth = this.props.UIScreen.window.width
    this.animatedViewHeight = (699 * this.props.UIScreen.window.width) / 1242
    //scrollY移动1导致的缩放比例
    this.zoomScale = (this.animatedViewHeight + 1) / this.animatedViewHeight
    this.descriptionClampStyle = { lineClamp: 5, lineHeight: 26, fontSize: 14 }
  }

  _getReportData = index => {
    const { params, routeName } = this.props.navigation.state
    let variables, column
    const filters = { ...this.state.filters, page: this.state.filters.page - 1 }
    switch (params.type) {
      case 'newest':
        {
          column = Column.NewArrivalCollection
          variables = { filters }
        }
        break
      case 'hot':
        {
          column = Column.RecentHotCollection
          variables = { filters }
        }
        break
      case 'collection':
        {
          column = params.column ? params.column : Column.Collection
          variables = { filters, id: params.collection.id }
        }
        break
      case 'occasion':
        {
          column = Column.OccasionCollection
          variables = { filters, slug: params.collection.slug }
        }
        break
    }
    return { variables, column, router: routeName, index }
  }

  _showSharePanel = () => {
    const ShareContent = this._handleShareContent()
    this.props.panelStore.show(ShareContent)
  }
  _updateInformation = collection => {
    this.setState({
      banner: collection.banner_photo_wide_banner_url,
      id: collection.id,
      description: collection.full_description,
      title: collection.title.trim()
    })
  }
  _addProducts = products => {
    // 去重 策略： 拿最近20个和新请求的数据做对比，去重
    const newProducts = filterSameProducts(this.state.products, products)
    this.setState({
      products: [...this.state.products, ...newProducts],
      isMore: products.length < this.state.filters.per_page ? false : true
    })
  }

  componentDidMount() {
    const { type } = this.props.navigation.state.params
    this._addObservers()
    switch (type) {
      case 'hot':
      case 'newest':
        this._getNewArrivalOrHotProducts(type)
        break
      case 'collection':
        this._getCollectionDetailData()
        break
      case 'occasion':
        this._getOccasionProducts()
        break
    }
  }

  componentWillUnmount() {
    this.scrollY.removeAllListeners()
    this.listeners.map(item => {
      item.remove()
    })
  }

  _goBack = () => {
    this.props.navigation.pop(1)
  }

  // 专题
  _getCollectionDetailData = () => {
    if (this.state.showSpinner) {
      return
    }
    const { id } = this.props.navigation.state.params.collection
    const variables = { id, filters: this.state.filters }
    this.setState({ showSpinner: true })

    QNetwork(
      SERVICE_TYPES.collections.QUERY_COLLCTION_DETAIL,
      variables,
      response => {
        if (this.state.products.length === 0) {
          this._updateInformation(response.data.browse_collection)
        }
        this._addProducts(response.data.browse_collection.products)
        this.setState({
          filters: { ...this.state.filters, page: this.state.filters.page + 1 },
          showSpinner: false
        })
      },
      () => {
        this.setState({ showSpinner: false })
      }
    )
  }

  //上新or热门
  _getNewArrivalOrHotProducts = type => {
    if (this.state.showSpinner) {
      return
    }
    this.setState({ showSpinner: true })

    let services_type
    let variables
    switch (type) {
      case 'newest':
        {
          services_type = SERVICE_TYPES.products.QUERY_PRODUCTS
          variables = { filters: this.state.filters }
        }
        break
      case 'hot':
        {
          services_type = SERVICE_TYPES.products.QUERY_SEASONS_PRODUCTS
          variables = { filters: this.state.filters }
        }
        break
    }
    QNetwork(
      services_type,
      variables,
      response => {
        this._addProducts(response.data.products)
        this.setState({
          filters: { ...this.state.filters, page: this.state.filters.page + 1 },
          showSpinner: false
        })
      },
      () => {
        this.setState({ showSpinner: false })
      }
    )
  }

  //场合
  _getOccasionProducts = () => {
    if (this.state.showSpinner) {
      return
    }
    this.setState({ showSpinner: true })

    const { slug } = this.props.navigation.state.params.collection
    QNetwork(
      SERVICE_TYPES.products.QUERY_PRODUCTS_OCCASION,
      { slug, filters: this.state.filters },
      response => {
        this._addProducts(response.data.product_collection.products)
        this.setState({
          filters: { ...this.state.filters, page: this.state.filters.page + 1 },
          showSpinner: false
        })
      },
      () => {
        this.setState({ showSpinner: false })
      }
    )
  }

  //加载
  _onEndReached = () => {
    const { isMore } = this.state
    const { type } = this.props.navigation.state.params

    if (isMore) {
      switch (type) {
        case 'hot':
          this._getNewArrivalOrHotProducts(type)
          break
        case 'newest':
          this._getNewArrivalOrHotProducts(type)
          break
        case 'collection':
          this._getCollectionDetailData()
          break
        case 'occasion':
          this._getOccasionProducts()
          break
      }
    }
  }
  _didSelectedItem = item => {
    const { navigate, state } = this.props.navigation

    let column
    switch (state.params.type) {
      case 'newest':
        column = Column.NewArrivalCollection
        break
      case 'hot':
        column = Column.RecentHotCollection
        break
      case 'collection':
        column = state.params.column ? state.params.column : Column.Collection
        break
      case 'occasion':
        column = Column.OccasionCollection
        break
    }

    const variables = { item, column }
    if (this.state.displayButton) {
      variables.inJoinMemberList = true
    }
    navigate('Details', variables)
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
  _productListHeader = () => {
    const { banner, description } = this.state
    return (
      <View>
        <Animated.View
          collapsable={false}
          style={{
            width: this.animatedViewWidth,
            height: this.animatedViewHeight,
            transform: this.transform()
          }}>
          {!!banner && (
            <Image
              style={styles.banner}
              source={{ uri: banner }}
              resizeMode="cover"
            />
          )}
        </Animated.View>
        {!!description && (
          <View style={styles.descriptionView}>
            <Text
              numberOfLines={
                this.state.isOpenedDescription
                  ? null
                  : this.descriptionClampStyle.lineClamp
              }
              style={styles.description}
              onLayout={this._textOnLayout}>
              {description}
            </Text>

            {this.state.showOpenButton && (
              <TouchableOpacity
                onPress={this._toggleDescription}
                style={styles.descriptionButton}>
                <Text style={styles.toggleText}>
                  {this.state.isOpenedDescription ? '收起' : '展开'}
                </Text>
                <Image
                  style={[
                    styles.arrow,
                    this.state.isOpenedDescription && styles.rotateArrow
                  ]}
                  source={require('../../../assets/images/collection/arrow_down.png')}
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
  }
  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
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

    this.listeners.push(
      this.props.navigation.addListener('willFocus', () => {
        initViewableItemsOnFocus(this.viewableItems)
      })
    )
  }

  //获取 url 参数
  _parseQueryString = url => {
    let obj = {}
    const paraString = url
      .substring(url.indexOf('?') + 1, url.length)
      .split('&')
    for (let i in paraString) {
      const keyValue = paraString[i].split('=')
      obj[keyValue[0]] = keyValue[1]
    }
    return obj
  }

  _joinMember = () => {
    const { currentCustomerStore, navigation } = this.props
    const urlPramaseObj = this._parseQueryString(this.state.displayButton.url)
    if (currentCustomerStore.id) {
      navigation.navigate('JoinMemberList', {
        occasion_filter: urlPramaseObj.occasion
      })
    } else {
      currentCustomerStore.setLoginModalVisible(true, () => {
        if (!currentCustomerStore.isSubscriber) {
          if (!currentCustomerStore.telephone) {
            navigation.navigate('BindPhone', {
              routeName: 'JoinMemberList',
              variables: urlPramaseObj.occasion,
              isLogin: true
            })
          } else {
            navigation.navigate('JoinMemberList', {
              occasion_filter: urlPramaseObj.occasion
            })
          }
        }
      })
    }
  }

  _handleShareContent = () => {
    const {
      collection: { id, slug, banner_photo_wide_banner_url },
      type
    } = this.props.navigation.state.params
    switch (type) {
      case 'collection':
        return (
          <SharePanel
            url={Client.ORIGIN + '/collections/' + id}
            title={this.state.title}
            description={this.state.description}
            thumbImage={banner_photo_wide_banner_url}
          />
        )
        break
      case 'occasion':
        return (
          <SharePanel
            url={Client.ORIGIN + '/occasion/' + slug}
            title={'这个风格很适合你哦，快来看看！'}
            thumbImage={banner_photo_wide_banner_url}
          />
        )
        break
    }
  }

  _onViewableItems = array => {
    this.viewableItems = array
  }

  render() {
    const { UIScreen } = this.props
    const { type } = this.props.navigation.state.params
    const buttonTitle =
      this.state.displayButton && this.state.displayButton.title
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
              backgroundColor: `rgba(255, 255, 255, ${
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
              <Text numberOfLines={1} tyle={styles.titleText}>
                {this.state.title}
              </Text>
            </View>
          }
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
          rightBarButtonItem={
            type !== 'hot' && type !== 'newest' ? (
              <BarButtonItem
                onPress={this._showSharePanel}
                style={styles.barButtonItem}>
                <Image
                  source={require('../../../assets/images/product_detail/share.png')}
                  style={{ transform: [{ scale: 0.9 }] }}
                />
              </BarButtonItem>
            ) : null
          }
        />
        <ProductList
          isViewableFeed={type === 'occasion'}
          onViewableItems={this._onViewableItems}
          getReportData={this._getReportData}
          scrollEventThrottle={this.state.scrollEventThrottle}
          data={this.state.products}
          didSelectedItem={this._didSelectedItem}
          onEndReached={this._onEndReached}
          ListEmptyComponent={this._productListEmptyComponent}
          ListHeaderComponent={this._productListHeader}
          ListFooterComponent={this._productListFooter}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            { useNativeDriver: true, isInteraction: false }
          )}
        />
        {this.state.displayButton && !!this.state.products.length && (
          <TouchableOpacity
            onPress={this._joinMember}
            style={styles.joinButton}>
            <Text style={styles.buttonTitle}>{buttonTitle}</Text>
          </TouchableOpacity>
        )}
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
    position: 'absolute',
    borderBottomWidth: 0
  },
  banner: {
    flex: 1
  },
  titleView: {
    alignItems: 'center'
  },
  titleText: {
    fontSize: 16
  },
  descriptionView: {
    paddingVertical: 20,
    marginHorizontal: 15,
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1
  },
  description: {
    fontWeight: '400',
    fontSize: 14,
    color: '#666',
    lineHeight: 26
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
    color: '#999'
  },
  arrow: {
    marginLeft: 7
  },
  rotateArrow: {
    transform: [{ rotate: '-180deg' }]
  },
  joinButton: {
    width: '100%',
    height: p2d(60),
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#ffff'
  },
  buttonTitle: {
    fontSize: 14,
    width: '100%',
    color: '#fff',
    lineHeight: p2d(46),
    textAlign: 'center',
    backgroundColor: '#EA5C39'
  }
})
