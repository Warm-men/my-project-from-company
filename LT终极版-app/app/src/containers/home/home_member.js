/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  RefreshControl,
  Platform,
  Animated,
  FlatList,
  Text,
  DeviceEventEmitter
} from 'react-native'
import { NavigationBar } from '../../../storybook/stories/navigationbar/index.js'
import { inject, observer } from 'mobx-react'
import BrowesCollectionHome from './home_member_containers/browes_collections'
import LookBookHome from './home_member_containers/lookbook_home'
import CustomerPhotos from '../customer_photos/customer_photos_in_home'
import BannerHome from './home_member_containers/banner_home'
import BrandsIntroduceHome from './home_member_containers/brands_introduce_home'
import RecommendHome from './home_member_containers/recommend_home'
import NewArrivalHome from './home_member_containers/new_arrival_home'
import HotCollectionHome from './home_member_containers/hot_collection'
import Occasion from './home_member_containers/occasion'
import p2d from '../../../src/expand/tool/p2d'
import { updateCustomerPhotoCenterData } from '../../../src/expand/tool/customer_photos'
import {
  ParticipateButton,
  CustomerPhotoTrend,
  FloatHover
} from '../../../storybook/stories/customer_photos/customer_photos_in_home'
import { AllLoadedFooter } from '../../../storybook/stories/products'
import CustomerPhotoItem from '../../../storybook/stories/home/customer_photo_in_home'
import _ from 'lodash'
import { SERVICE_TYPES, QNetwork } from '../../expand/services/services'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
@inject('UIScreen', 'currentCustomerStore', 'bannerHomeStore', 'appStore')
@observer
export default class HomeMember extends Component {
  constructor(props) {
    super(props)
    const flatListData = this.getFlatList()
    this.state = {
      refreshing: false,
      navigationBarOpacity: 0,
      scrollEventThrottle: 1,
      flatListData,
      customerPhotosButtonViewable: false,
      customerPhotos: [],
      customerPhotosIsMore: true,
      floatHover: null
    }
    this.scrollY = new Animated.Value(0)
    this.loadingStatus = {
      isFinishLoadingBanner: false,
      isFinishLoadingBrand: false,
      isFinishLoadingCollection: false,
      isFinishLoadingLookbook: false,
      isFinishLoadingOccasion: false,
      isFinishLoadingBottom: false
    }
    this.animatedViewHeight = (563 * this.props.UIScreen.window.width) / 750
    this.listeners = []
  }

  getFlatList = () => {
    const {
      canViewNewestProducts,
      subscription
    } = this.props.currentCustomerStore
    const isOccasionBanner =
      subscription &&
      subscription.subscription_type &&
      subscription.subscription_type.occasion

    const isSecondaryBanner =
      subscription &&
      subscription.subscription_type &&
      !isOccasionBanner &&
      subscription.status === 'cancelled'

    const flatListData = [
      'topBannersData',
      isSecondaryBanner ? 'secondaryBannersData' : 'hiddenSecondaryBannersData',
      isOccasionBanner ? 'occasionBannersData' : 'hiddenOccasionBannersData',
      canViewNewestProducts ? 'recommendProducts' : 'hiddenRecommendProducts',
      !canViewNewestProducts ? 'hot' : 'hiddenHot',
      'lookbook',
      'occasion',
      'brands',
      'browse_collections',
      canViewNewestProducts ? 'newest' : 'hiddenNewest',
      'homeCustomerPhotos'
    ]

    return flatListData
  }

  _setFlatList = () => {
    const flatListData = this.getFlatList()
    this.setState({
      flatListData
    })
  }

  componentDidMount() {
    this.props.appStore.barStyleColor = 'default'
    this._addObservers()
    this._getFloatHover()
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
      DeviceEventEmitter.addListener('refreshHomeFloatHover', () => {
        this._getFloatHover()
      })
    )
  }

  componentWillUnmount() {
    this.loadingStatus = {}
    this.setState = (state, callback) => {
      return
    }
    this.listeners.map(item => {
      item.remove()
    })
  }

  _isFinishLoading = () => {
    let isLoadingIndex = Object.values(this.loadingStatus).findIndex(item => {
      return !item
    })
    if (isLoadingIndex === -1) {
      this.loading = false
      this.setState({ refreshing: false })
    }
  }

  _onRefresh = () => {
    if (this.loading) {
      return
    }
    this.setState({ refreshing: true }, () => {
      this._getData()
      this.props.checkMemberStatus()
    })
  }

  _isComponentShowed = componentsName => {
    return this.state.flatListData.includes(componentsName)
  }

  _getData = () => {
    if (this.loading) {
      return
    }
    this.loading = true
    this._topBannerSubscriber.wrappedInstance._getBannerData()
    this._isComponentShowed('secondaryBannersData') &&
      this._secondaryBanner.wrappedInstance._getBannerData()
    this._isComponentShowed('occasionBannersData') &&
      this._occasionBanner.wrappedInstance._getBannerData()
    this._isComponentShowed('recommendProducts') &&
      this._recommend.wrappedInstance._getRecommendData()
    this._isComponentShowed('newest') &&
      this._newest.wrappedInstance._getNewArrivalData()
    this._isComponentShowed('hot') && this._hot.wrappedInstance._getHotData()
    this._lookbook.wrappedInstance._getLookbookData()
    this._occasion.wrappedInstance._getOccasion()
    this._brands.wrappedInstance._getBrandData()
    this._browseCollections.wrappedInstance._getBrowesCollectionsData()
    this._homeCustomerPhotos.wrappedInstance._getCustomerPhotosSummary(true)
    this._getFloatHover()
    updateCustomerPhotoCenterData()
  }

  _getFloatHover = () => {
    const input = { slug: 'reward_for_first_customer_photo' }
    QNetwork(SERVICE_TYPES.quiz.QUERY_FLOAT_HOVER, input, response => {
      const { float_hover } = response.data
      this.setState({
        floatHover: float_hover
      })
    })
  }

  _showMoreColletion = () => {
    this.props.navigation.navigate('CollectionList')
  }

  _extractUniqueKey(item, index) {
    const isString = typeof item === 'string'
    return isString ? item : 'Customer' + index.toString()
  }

  _renderItem = ({ item }) => {
    const { bannerHomeStore, navigation, currentCustomerStore } = this.props
    let value
    switch (item) {
      case 'topBannersData':
        value = bannerHomeStore.topBannersData
        return (
          <BannerHome
            navigation={navigation}
            bannerData={value}
            style={styles.bannerTop}
            bannerType={'app_top_subscriber'}
            ref={topBannerSubscriber =>
              (this._topBannerSubscriber = topBannerSubscriber)
            }
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break
      case 'secondaryBannersData':
        value = bannerHomeStore.secondaryBannersData
        return (
          <BannerHome
            navigation={navigation}
            bannerData={value}
            style={styles.occasionBannerStyle}
            wrapStyle={styles.bannerWrapStyle}
            bannerType={'secondary_banner'}
            ref={secondaryBanner => (this._secondaryBanner = secondaryBanner)}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break
      case 'occasionBannersData':
        value = bannerHomeStore.occasionBannersData
        const bannerType =
          currentCustomerStore.subscription.subscription_type.occasion
        return (
          <BannerHome
            navigation={navigation}
            bannerData={value}
            style={styles.occasionBannerStyle}
            wrapStyle={styles.bannerWrapStyle}
            bannerTag={'occasionBanner'}
            bannerType={bannerType}
            ref={occasionBanner => (this._occasionBanner = occasionBanner)}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )

        break
      case 'recommendProducts':
        return (
          <RecommendHome
            navigation={navigation}
            title={'为你推荐'}
            subTitle={'RECOMMENDATION'}
            ref={recommend => (this._recommend = recommend)}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break
      case 'newest':
        return (
          <NewArrivalHome
            navigation={navigation}
            ref={newest => (this._newest = newest)}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break
      case 'hot':
        return (
          <HotCollectionHome
            navigation={navigation}
            ref={hot => (this._hot = hot)}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break
      case 'lookbook':
        return (
          <LookBookHome
            navigation={navigation}
            ref={lookbook => (this._lookbook = lookbook)}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break
      case 'occasion':
        return (
          <Occasion
            navigation={navigation}
            ref={occasion => (this._occasion = occasion)}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
            type={'member'}
          />
        )
        break
      case 'brands':
        return (
          <BrandsIntroduceHome
            navigation={navigation}
            imageStyle={styles.brandsIamge}
            title={'精选品牌'}
            subTitle={'FEATURED BRANDS'}
            type={'brands'}
            ref={brands => (this._brands = brands)}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break
      case 'browse_collections':
        return (
          <BrowesCollectionHome
            navigation={navigation}
            type={'collection'}
            ref={browseCollections =>
              (this._browseCollections = browseCollections)
            }
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break
      case 'homeCustomerPhotos':
        return (
          <CustomerPhotos
            navigation={navigation}
            ref={homeCustomerPhotos =>
              (this._homeCustomerPhotos = homeCustomerPhotos)
            }
            updateBottomData={this._updateCustomerPhoto}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
            type={'member'}
          />
        )
        break
      default:
        const isString = typeof item === 'string'
        if (isString) {
          return null
        } else {
          const { key, index, items } = item
          if (key === 'CustomerPhoto') {
            return <CustomerPhotoItem navigation={navigation} items={items} />
          } else {
            return null
          }
        }
        break
    }
  }

  _handleCustomerPhotoReview = () => {
    this.props.navigation.navigate('CustomerPhotosReviewed')
  }

  _updateCustomerPhoto = (customerPhotos, customerPhotosIsMore) => {
    this.setState({ customerPhotos, customerPhotosIsMore })
  }

  _onEndReached = () => {
    if (this.state.customerPhotosIsMore) {
      this._homeCustomerPhotos.wrappedInstance._getCustomerPhotosSummary(false)
    }
  }
  _listFooterComponent = () => {
    return (
      <AllLoadedFooter
        isMore={this.state.customerPhotosIsMore}
        style={{ marginBottom: 70 }}
      />
    )
  }

  _onViewableItemsChanged = ({ viewableItems }) => {
    const item = _.maxBy(viewableItems, item => {
      return item.index
    })
    if (item && item.index > 11) {
      !this.state.customerPhotosButtonViewable &&
        this.setState({ customerPhotosButtonViewable: true })
    } else {
      this.state.customerPhotosButtonViewable &&
        this.setState({ customerPhotosButtonViewable: false })
    }
  }

  render() {
    const { UIScreen, navigation, currentCustomerStore } = this.props
    const {
      roles,
      customerPhotoIncentiveDetail,
      unreadCustomerPhotoReview
    } = currentCustomerStore
    const {
      customerPhotosButtonViewable,
      scrollEventThrottle,
      flatListData,
      customerPhotos,
      refreshing,
      floatHover
    } = this.state
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
              opacity: this.state.navigationBarOpacity
            }
          ]}
          titleView={
            <View
              style={[
                styles.titleView,
                { opacity: this.state.navigationBarOpacity }
              ]}>
              <Text numberOfLines={1} style={styles.titleText}>
                {'托特衣箱'}
              </Text>
            </View>
          }
        />
        <AnimatedFlatList
          scrollEventThrottle={scrollEventThrottle}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyExtractor={this._extractUniqueKey}
          data={[...flatListData, ...customerPhotos]}
          renderItem={this._renderItem}
          windowSize={5}
          initialNumToRender={11}
          refreshControl={
            <RefreshControl
              onRefresh={this._onRefresh}
              refreshing={refreshing}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            { useNativeDriver: true, isInteraction: false }
          )}
          removeClippedSubviews={Platform.OS === 'ios' ? false : true}
          onViewableItemsChanged={this._onViewableItemsChanged}
          showsHorizontalScrollIndicator={false}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={this._listFooterComponent}
        />
        {!customerPhotosButtonViewable && floatHover && (
          <FloatHover data={floatHover} navigation={navigation} />
        )}
        {customerPhotosButtonViewable ? (
          <ParticipateButton
            navigation={navigation}
            roles={roles}
            customerPhotoIncentiveDetail={customerPhotoIncentiveDetail}
          />
        ) : unreadCustomerPhotoReview ? (
          <CustomerPhotoTrend onClick={this._handleCustomerPhotoReview} />
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { zIndex: 0, flex: 1 },
  navigationBar: { position: 'absolute', zIndex: 1 },
  bannerTop: { width: p2d(375), height: p2d(282) },
  collections: { width: p2d(375), height: p2d(211) },
  homeCollections: { width: p2d(375), height: p2d(375) },
  titleView: { alignItems: 'center' },
  titleText: { fontSize: 16 },
  brandsIamge: { width: p2d(265), height: p2d(196) },
  occasionBannerStyle: { width: p2d(359), height: p2d(90) },
  bannerWrapStyle: {
    marginTop: p2d(24),
    justifyContent: 'center',
    alignItems: 'center'
  }
})
