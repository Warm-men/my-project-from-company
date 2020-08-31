/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  RefreshControl,
  Platform,
  Animated,
  FlatList,
  Text
} from 'react-native'
import { NavigationBar } from '../../../storybook/stories/navigationbar/index.js'
import { inject, observer } from 'mobx-react'
import BannerHome from './home_member_containers/banner_home'
import Occasion from './home_member_containers/occasion'
import p2d from '../../../src/expand/tool/p2d'
import BrandsNonMemberHome from './home_non_member_containers/brands_non_member_home'
import PlayingToteHome from './home_non_member_containers/playing_tote_home'
import PlayingToteHomeAbTesting from './home_non_member_containers/playing_tote_home_abTesting'
import HotProduct from './home_non_member_containers/hot_product'
import HotProductItem from '../../../storybook/stories/home/hot_product_in_home'
import OnboardingAndMemberDressing from './home_non_member_containers/onboarding_and_member_dressing'
import { AllLoadedFooter } from '../../../storybook/stories/products'
import { NonMemberCommonTitle } from '../../../storybook/stories/home/titleView'

import Float from './home_non_member_containers/float'
import { Experiment, Variant } from '../../../src/components/ab_testing'
import { Column } from '../../../src/expand/tool/add_to_closet_status'
import { viewableItemsChanged } from '../../../src/expand/tool/daq'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services'
import Image from '../../../storybook/stories/image'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

@inject(
  'UIScreen',
  'currentCustomerStore',
  'bannerHomeStore',
  'appStore',
  'totesStore',
  'daqStore',
  'modalStore'
)
@observer
export default class HomeNonMember extends Component {
  constructor(props) {
    super(props)
    this.flatListData = [
      'topBannersData',
      'playingTote',
      'onboardingAndMemberDressing',
      'activityBanners',
      'fashionCases',
      'brands',
      'occasion',
      'bottom'
    ]
    this.state = {
      refreshing: false,
      navigationBarOpacity: 0,
      scrollEventThrottle: 1,
      showFloatHover: false,
      bottomData: [],
      bottomIsMore: true
    }
    this.scrollY = new Animated.Value(0)
    this.loadingStatus = {
      isFinishLoadingBanner: false,
      isFinishLoadingBrand: false,
      isFinishLoadingOccasion: false,
      isFinishLoadingBottom: false
    }
    this.animatedViewHeight = (563 * this.props.UIScreen.window.width) / 750
    this.listeners = []

    this.viewabilityConfigCallbackPairs = [
      {
        viewabilityConfig: {
          itemVisiblePercentThreshold: 75,
          minimumViewTime: 1000
        },
        onViewableItemsChanged: this._onViewableItemsChanged
      }
    ]
  }

  componentDidMount() {
    this._addObservers()
    this.getToteCount()
  }

  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      this.setState({ showFloatHover: value >= 300 })
      const hiddenContentOffsetY = (this.animatedViewHeight * 3) / 4
      if (
        value > this.animatedViewHeight &&
        this.state.navigationBarOpacity !== 1
      ) {
        this.props.appStore.barStyleColor = 'default'
        this.setState({ navigationBarOpacity: 1, scrollEventThrottle: 16 })
      } else if (
        value <= this.animatedViewHeight &&
        value >= hiddenContentOffsetY
      ) {
        if (Platform.OS === 'ios') {
          this.props.appStore.barStyleColor = 'light-content'
        }
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
  }

  componentWillUnmount() {
    this.loadingStatus = {}
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
    })
  }

  _getData = () => {
    if (this.loading) {
      return
    }
    this.loading = true
    this._topBanner300 && this._topBanner300.wrappedInstance._getBannerData()
    this._activityBanner300.wrappedInstance._getBannerData()
    this._listBanner300 && this._listBanner300.wrappedInstance._getBannerData()
    this._brands.wrappedInstance._getBrandData()
    this._occasion.wrappedInstance._getOccasion()
    this._hot.wrappedInstance._getHotProducts(true)

    this._floatView.wrappedInstance._getFloatHoverBanner()
    this._onboardingAndMemberDressing.wrappedInstance._onRefreshingMemberDressingComponent()
    this.getToteCount()
  }

  getToteCount = () => {
    QNetwork(SERVICE_TYPES.totes.QUERY_TOTE_COUNT, {}, response => {
      this.props.totesStore.totalToteCount = response.data.tote_count
    })
  }

  _extractUniqueKey(item, index) {
    const isString = typeof item === 'string'
    return isString ? item : 'Bottom' + index.toString()
  }

  _renderItem = ({ item }) => {
    const { bannerHomeStore, currentCustomerStore, navigation } = this.props
    const { subscription } = currentCustomerStore
    const isFreeTote =
      subscription &&
      (subscription.promo_code === 'LTCN_FREE_TOTE' ||
        subscription.promo_code === 'LTCN_FREE_TOTE_79')
    let value
    switch (item) {
      case 'topBannersData':
        value = bannerHomeStore.nonMemberTopBanner
        return (
          <Experiment defaultValue={1} flagName={'non_member_top_banner'}>
            <Variant value={1}>
              <BannerHome
                navigation={navigation}
                bannerData={value}
                style={styles.bannerTop}
                bannerType={'app_top_banner_300'}
                ref={topBanner300 => (this._topBanner300 = topBanner300)}
                isFinishLoading={this._isFinishLoading}
                loadingStatus={this.loadingStatus}
              />
            </Variant>
            <Variant value={2}>
              <Image
                style={styles.bannerTop}
                source={require('../../../assets/images/home/banner.png')}
              />
            </Variant>
          </Experiment>
        )
        break
      case 'playingTote':
        return (
          <Experiment defaultValue={1} flagName={'home_member_privilege'}>
            <Variant value={1}>
              <PlayingToteHome navigation={navigation} />
            </Variant>
            <Variant value={2}>
              <PlayingToteHomeAbTesting navigation={navigation} />
            </Variant>
          </Experiment>
        )
      case 'onboardingAndMemberDressing':
        return (
          <OnboardingAndMemberDressing
            navigation={navigation}
            isFreeTote={isFreeTote}
            ref={onboardingAndMemberDressing =>
              (this._onboardingAndMemberDressing = onboardingAndMemberDressing)
            }
          />
        )
      case 'activityBanners':
        value = bannerHomeStore.nonMemberActivityBanner
        return (
          <BannerHome
            vertical
            navigation={navigation}
            bannerData={value}
            titleText={'活动专区'}
            imageStyle={styles.activitysImageStyle}
            bannerType={'app_activity_banner_300'}
            ref={activityBanner300 =>
              (this._activityBanner300 = activityBanner300)
            }
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break
      case 'fashionCases':
        value = bannerHomeStore.nonMemberListBanner
        return (
          <Experiment
            defaultValue={1}
            flagName={'non_member_home_customer_photo'}>
            <Variant value={1}>
              <BannerHome
                vertical
                navigation={navigation}
                bannerData={value}
                imageStyle={styles.fashionCaseImageStyle}
                titleText={'全新的时尚体验方式'}
                bannerType={'app_list_banner_300'}
                ref={listBanner300 => (this._listBanner300 = listBanner300)}
                isFinishLoading={this._isFinishLoading}
                loadingStatus={this.loadingStatus}
              />
            </Variant>
            <Variant value={2}>
              {!!value.length ? (
                <NonMemberCommonTitle title={'全新的时尚体验方式'} />
              ) : null}
              <BannerHome
                navigation={navigation}
                bannerData={value}
                style={styles.activitysBannerStyle}
                wrapStyle={styles.activitysBannerWrapperStyle}
                imageStyle={styles.fashionCaseImageStyle}
                bannerType={'app_list_banner_300'}
                ref={listBanner300 => (this._listBanner300 = listBanner300)}
                isFinishLoading={this._isFinishLoading}
                loadingStatus={this.loadingStatus}
              />
            </Variant>
          </Experiment>
        )
        break
      case 'brands':
        return (
          <BrandsNonMemberHome
            navigation={navigation}
            titleText={'精选品牌'}
            ref={brands => (this._brands = brands)}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break
      case 'occasion':
        return (
          <Occasion
            imageStyle={styles.occasionImageStyle}
            navigation={navigation}
            ref={occasion => (this._occasion = occasion)}
            type={'non_member'}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break
      case 'bottom':
        return (
          <HotProduct
            navigation={navigation}
            titleText={'热门单品'}
            ref={hot => (this._hot = hot)}
            updateBottomData={this._updateBottomData}
            isFinishLoading={this._isFinishLoading}
            loadingStatus={this.loadingStatus}
          />
        )
        break

      default:
        const isString = typeof item === 'string'
        if (isString) {
          return null
        } else {
          const { key, index, items } = item
          if (key === 'HotProduct') {
            return (
              <HotProductItem
                index={index}
                items={items}
                getReportData={this._getHotReport}
                navigation={navigation}
              />
            )
          } else {
            return null
          }
        }
        break
    }
  }

  _updateBottomData = (bottomData, bottomIsMore) => {
    this.setState({ bottomData, bottomIsMore })
  }

  _onEndReached = () => {
    if (this.state.bottomIsMore) {
      this._hot.wrappedInstance._getHotProducts(false)
    }
  }
  _listFooterComponent = () => {
    return <AllLoadedFooter isMore={this.state.bottomIsMore} />
  }

  _onViewableItemsChanged = ({ changed, viewableItems }) => {
    const { modalStore, daqStore, navigation, onViewableItems } = this.props

    let array = []
    viewableItems.forEach(i => {
      if (typeof i.item !== 'string' && i.item.key === 'HotProduct') {
        array = array.concat(i.item.items)
      }
    })

    if (navigation && navigation.state.routeName !== modalStore.currentRoute) {
      return
    }
    daqStore.viewableArray = array
    onViewableItems && onViewableItems(array)

    let changedArray = []
    changed.forEach(i => {
      if (typeof i.item !== 'string' && i.item.key === 'HotProduct') {
        const array = []
        i.item.items.forEach((item, index) => {
          array.push({ ...i, item, key: item.id, index: i.item.index + index })
        })
        changedArray = changedArray.concat(array)
      }
    })

    if (changedArray.length) {
      viewableItemsChanged(changedArray, this._getHotReport)
    }
  }

  _getHotReport = index => {
    const { routeName } = this.props.navigation.state
    return {
      index,
      variables: {
        at_least_one_size_in_stock: true,
        sort: 'area_based_recommended'
      },
      column: Column.RecentHotCollection,
      router: routeName
    }
  }

  render() {
    const { UIScreen, navigation } = this.props
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
          ref={flatlist => (this._flatlist = flatlist)}
          keyExtractor={this._extractUniqueKey}
          style={styles.container}
          windowSize={2}
          scrollEventThrottle={this.state.scrollEventThrottle}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={[...this.flatListData, ...this.state.bottomData]}
          renderItem={this._renderItem}
          // initialNumToRender={8}
          refreshControl={
            <RefreshControl
              onRefresh={this._onRefresh}
              refreshing={this.state.refreshing}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            { useNativeDriver: true, isInteraction: false }
          )}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={this._listFooterComponent}
          viewabilityConfigCallbackPairs={this.viewabilityConfigCallbackPairs}
        />
        <Float
          ref={floatView => (this._floatView = floatView)}
          navigation={navigation}
          showFloatHover={this.state.showFloatHover}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { zIndex: 0, flex: 1 },
  navigationBar: { position: 'absolute', zIndex: 1 },
  titleView: { alignItems: 'center' },
  titleText: { fontSize: 16 },
  bannerTop: { width: p2d(375), height: p2d(432) },
  activitysImageStyle: {
    width: p2d(343),
    height: p2d(114),
    marginBottom: p2d(16)
  },
  fashionCaseImageStyle: {
    width: p2d(343),
    height: p2d(230),
    marginBottom: p2d(16)
  },

  occasionImageStyle: { width: p2d(128), height: p2d(164) },
  occasionItemStyle: { marginTop: 0, marginBottom: p2d(16) },

  activitysBannerStyle: { width: p2d(343), height: p2d(230) },
  activitysBannerWrapperStyle: { marginLeft: p2d(16), marginTop: p2d(8) }
})
