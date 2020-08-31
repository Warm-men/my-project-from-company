/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  Image,
  Animated,
  TouchableOpacity,
  Text,
  Dimensions,
  DeviceEventEmitter
} from 'react-native'
import { QNetwork, SERVICE_TYPES } from '../../../expand/services/services'
import {
  NavigationBar,
  BarButtonItem
} from '../../../../storybook/stories/navigationbar'
import { inject } from 'mobx-react'
import p2d from '../../../expand/tool/p2d'
import {
  CustomerPhotoCenterHeader,
  CustomerPhotoList
} from '../../../../storybook/stories/customer_photos/customer_photo_center'
import PhotoPanel from '../../common/PhotoPanel'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { updateCustomerPhotoCenterData } from '../../../expand/tool/customer_photos'

@inject('customerPhotosStore', 'panelStore', 'currentCustomerStore')
export default class CustomerPhotoCenterContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navigationBarOpacity: 0,
      scrollEventThrottle: 1,
      isLoading: true,
      data: [],
      isMore: true
    }
    this.scrollY = new Animated.Value(0)

    this.animatedViewHeight = 150
    this.page = 1
    this.per_page = 20
    this.isLoading = false
    this.listeners = []
  }

  componentDidMount() {
    this._getCustomerPhotos()
    this.addListener()
    updateCustomerPhotoCenterData()
  }

  componentWillUnmount() {
    this.listeners.map(item => {
      item.remove()
    })
    this.scrollY.removeAllListeners()
  }

  addListener = () => {
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
      DeviceEventEmitter.addListener('onRefreshCustomerPhotosData', () => {
        this._getCustomerPhotos(true)
      })
    )
  }

  _getCustomerPhotos = refresh => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    if (refresh) {
      this.page = 1
    }
    const variables = { page: this.page, per_page: this.per_page }
    QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_MY_CUSTOMER_PHOTOS,
      variables,
      response => {
        const { my_customer_photos } = response.data
        if (my_customer_photos.length) {
          this.props.customerPhotosStore.updateLikesStatus(my_customer_photos)
        }
        this.page += 1
        this.setState({
          data: refresh
            ? my_customer_photos
            : [...this.state.data, ...my_customer_photos],
          isLoading: false,
          isMore: my_customer_photos.length === this.per_page
        })
        this.isLoading = false
      },
      () => {
        this.setState({ isLoading: false, isMore: false })
        this.isLoading = false
      }
    )
  }

  _extractUniqueKey = (item, index) => {
    return index.toString()
  }

  _renderItem = ({ item }) => {
    const { navigation } = this.props
    return <CustomerPhotoList data={item} navigation={navigation} />
  }

  _onEndReached = () => {
    this.state.isMore && this._getCustomerPhotos()
  }

  _listHeaderComponent = () => {
    return <CustomerPhotoCenterHeader popPanelShow={this._popPanelShow} />
  }

  _listEmptyComponent = () => {
    if (this.state.isMore) {
      return (
        <View style={styles.emptyContainer}>
          <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
        </View>
      )
    } else {
      return (
        <View style={styles.emptyContainer}>
          <Image
            style={styles.emptyImage}
            source={require('../../../../assets/images/customer_photos/customer_photo_center_empty.png')}
          />
          <Text style={styles.emptyText}>
            分享你的穿搭感受，会对他人有很大的帮助哦，快来晒单吧！
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={this._myCustomerPhotos}>
            <Text style={styles.emptyButtonText}>立即晒单</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  _popPanelShow = () => {
    this.props.panelStore.show(<PhotoPanel cancel={this._popPanelHide} />)
  }

  _popPanelHide = () => {
    this.props.panelStore.hide()
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _myCustomerPhotos = () => {
    this.props.navigation.navigate('MyCustomerPhotos')
  }

  render() {
    const { isLoading, data, navigationBarOpacity } = this.state

    return (
      <View style={styles.container}>
        {isLoading ? (
          <View testID="spinner" style={styles.loadingView}>
            <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
          </View>
        ) : (
          <View testID="container" style={styles.container}>
            <NavigationBar
              style={[
                styles.navigationBar,
                {
                  paddingTop:
                    Platform.OS === 'ios'
                      ? Dimensions.get('window').height >= 812
                        ? 30
                        : 20
                      : 0,
                  height:
                    Platform.OS === 'ios'
                      ? Dimensions.get('window').height >= 812
                        ? 84
                        : 64
                      : 44,
                  backgroundColor: `rgba(255, 255, 255, ${navigationBarOpacity})`
                }
              ]}
              titleView={
                <View
                  style={[styles.titleView, { opacity: navigationBarOpacity }]}>
                  <Text numberOfLines={1} style={styles.titleText}>
                    {this.props.currentCustomerStore.nickname}
                  </Text>
                </View>
              }
              leftBarButtonItem={
                <BarButtonItem onPress={this._goBack} buttonType={'back'} />
              }
            />
            <Animated.FlatList
              bounces={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
                { useNativeDriver: true, isInteraction: false }
              )}
              keyExtractor={this._extractUniqueKey}
              data={data}
              renderItem={this._renderItem}
              removeClippedSubviews={Platform.OS === 'ios' ? false : true}
              onEndReachedThreshold={2}
              onEndReached={this._onEndReached}
              ListHeaderComponent={this._listHeaderComponent}
              ListEmptyComponent={this._listEmptyComponent}
            />
            {!!data.length && (
              <View
                testID="has-data-button"
                style={[
                  styles.buttomContainer,
                  Platform.OS === 'ios' &&
                    Dimensions.get('window').height >= 812 && {
                      paddingBottom: 34
                    }
                ]}>
                <TouchableOpacity
                  style={styles.buttomButton}
                  onPress={this._myCustomerPhotos}>
                  <Text style={styles.buttonText}>去晒单</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navigationBar: { position: 'absolute', borderBottomWidth: 0 },
  titleView: { alignItems: 'center' },
  titleText: { fontSize: 16 },
  loadingView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyImage: { marginTop: 42 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: {
    width: p2d(247),
    textAlign: 'center',
    fontSize: 15,
    color: '#242424',
    marginTop: 24,
    lineHeight: 24
  },
  emptyButton: {
    backgroundColor: '#EA5C39',
    width: 167,
    height: 44,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 39,
    marginBottom: 30
  },
  emptyButtonText: {
    fontSize: 14,
    color: '#fff'
  },
  buttomContainer: {
    paddingVertical: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopColor: '#f7f7f7',
    borderTopWidth: 1
  },
  buttomButton: {
    width: p2d(343),
    height: p2d(44),
    backgroundColor: '#E85C40',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600'
  }
})
