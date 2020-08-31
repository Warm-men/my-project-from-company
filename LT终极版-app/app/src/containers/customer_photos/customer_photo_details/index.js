/* @flow */

import React from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  DeviceEventEmitter
} from 'react-native'
import {
  QNetwork,
  Mutate,
  SERVICE_TYPES
} from '../../../expand/services/services'
import AuthenticationComponent from '../../../components/authentication'

import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import CustomerPhoto from '../../../../storybook/stories/customer_photos/customer_photo'
import NavigationTitle from '../../../../storybook/stories/customer_photos/customer_photos_in_details/navigation_title'
import { AllLoadedFooter } from '../../../../storybook/stories/products'
import _ from 'lodash'
import { shareCustomerPhoto } from '../../../expand/tool/share'
import {
  getCurrentItemKey,
  viewableItemsCustomerPhotos
} from '../../../expand/tool/daq'
import { Column } from '../../../expand/tool/add_to_closet_status'
import { inject, observer } from 'mobx-react'
@inject('customerPhotosStore', 'currentCustomerStore', 'daqStore')
@observer
export default class CustomerPhotoDetailsContainer extends AuthenticationComponent {
  onSignIn() {
    this._getTheRelatedCustomerPhotos()
  }
  onSignOut() {}

  constructor(props) {
    super(props)
    const { data } = props.navigation.state.params
    this.isLoading = false
    this.state = {
      page: 1,
      limit: 10,
      isMore: true,
      data: data ? [data] : [],
      showUserInfo: true,
      otherData: []
    }
    this.viewabilityConfigCallbackPairs = [
      {
        viewabilityConfig: {
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 80,
          waitForInteraction: false
        },
        onViewableItemsChanged: this._onViewableItemsChanged
      },
      {
        viewabilityConfig: {
          viewAreaCoveragePercentThreshold: 1,
          waitForInteraction: false
        },
        onViewableItemsChanged: this._handleItemsPartiallyVisible
      }
    ]
  }

  componentDidMount() {
    const { currentCustomerStore, navigation } = this.props
    const { isFromNotification, review_id } = navigation.state.params

    this._getTheCustomerPhoto()
    this._getTheRelatedCustomerPhotos()
    if (isFromNotification) {
      if (review_id) {
        const input = { customer_photo_review_id: review_id }
        Mutate(
          SERVICE_TYPES.customerPhotos.MUTATION_READ_CUSTOMER_PHOTO_REVIEW,
          { input },
          response => {
            const { has_unread_review } = response.data.ReadCustomerPhotoReview
            currentCustomerStore.unreadCustomerPhotoReview = has_unread_review
          }
        )
      } else {
        DeviceEventEmitter.emit('refreshHomeData')
      }
    }
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }
  _share = () => {
    const { currentCustomerStore, navigation } = this.props
    const { data } = navigation.state.params
    const dataState = this.state.data
    let image, oneself
    if (data) {
      image = data.photos[0] ? data.photos[0].url : ''
      oneself = data.customer.id === parseInt(currentCustomerStore.id)
      shareCustomerPhoto(data.id, image, oneself)
      return
    }
    if (dataState.length) {
      image = dataState[0].photos[0].url
      oneself = dataState[0].customer.id === parseInt(currentCustomerStore.id)
      shareCustomerPhoto(dataState[0].id, image, oneself)
    }
  }

  _getTheCustomerPhoto = () => {
    const { customerPhotosStore, navigation } = this.props
    const { id } = navigation.state.params
    const variables = { customer_photo_id: id }
    QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_THE_CUSTOMER_PHOTO,
      variables,
      response => {
        const { customer_photos } = response.data.customer_photo_summary
        if (customer_photos && customer_photos.length) {
          customerPhotosStore.updateLikesStatus(customer_photos)
          this.setState({
            data: [customer_photos[0]]
          })
        }
      }
    )
  }

  _getTheRelatedCustomerPhotos = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { page, limit } = this.state
    const { navigation, customerPhotosStore } = this.props
    const { id } = navigation.state.params

    const variables = { page, limit, customer_photo_id: id }
    QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_THE_RELATED_CUSTOMER_PHOTOS,
      variables,
      response => {
        const { customer_photos } = response.data.customer_photo_summary
        if (customer_photos && customer_photos.length) {
          const { related_customer_photos } = customer_photos[0]
          customerPhotosStore.updateLikesStatus(related_customer_photos)
          this.setState({
            page: page + 1,
            otherData: [...this.state.otherData, ...related_customer_photos],
            isMore: related_customer_photos.length === limit
          })
        }
        this.isLoading = false
      },
      () => {
        this.isLoading = false
      }
    )
  }

  _extractUniqueKey = (item, index) => {
    return getCurrentItemKey(item.id, index)
  }

  _getReportData = index => {
    const { routeName, params } = this.props.navigation.state
    const { page, limit } = this.state
    const variables = { page: page - 1, limit, customer_photo_id: params.id }
    const column = Column.CustomerPhotoDetails
    return { variables, column, index, router: routeName }
  }

  _renderItem = ({ item, index }) => {
    const { navigation, daqStore } = this.props
    const obj = { navigation, index }
    if (index === 1) obj.subTitle = '相关晒单'
    const isViewable = !!daqStore.viewableArray.find(i => i.id === item.id)
    return (
      <CustomerPhoto
        {...obj}
        data={item}
        column={Column.CustomerPhotoDetails}
        getReportData={this._getReportData}
        isViewable={isViewable}
      />
    )
  }

  _listFooterComponent = () => {
    return <AllLoadedFooter isMore={this.state.isMore} />
  }

  _onEndReached = () => {
    this.state.isMore && this._getTheRelatedCustomerPhotos()
  }

  _onViewableItemsChanged = ({ viewableItems }) => {
    const array = viewableItems.map(a => a.item)
    this.props.daqStore.viewableArray = array
  }

  _handleItemsPartiallyVisible = ({ viewableItems, changed }) => {
    const item = _.minBy(viewableItems, item => {
      return item.index
    })
    if (item && item.index > 0) {
      this.setState({ showUserInfo: false })
    } else {
      this.setState({ showUserInfo: true })
    }
    viewableItemsCustomerPhotos(changed, this._getReportData)
  }

  render() {
    const { navigation, daqStore } = this.props
    const { isFromNotification } = navigation.state.params
    const { otherData, data } = this.state
    const customer = data.length ? data[0].customer : null
    const allData = [...data, ...otherData]
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'相关晒单'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
          titleView={
            this.state.showUserInfo && customer ? (
              <NavigationTitle customer={customer} />
            ) : null
          }
          rightBarButtonItem={
            this.state.showUserInfo ? (
              <BarButtonItem
                onPress={this._share}
                buttonType={'share'}
                animated={isFromNotification}
              />
            ) : null
          }
        />
        <View style={styles.contentView}>
          <FlatList
            style={styles.list}
            initialNumToRender={3}
            windowSize={5}
            keyExtractor={this._extractUniqueKey}
            data={allData}
            extraData={daqStore.viewableArray}
            renderItem={this._renderItem}
            removeClippedSubviews={Platform.OS === 'ios' ? false : true}
            onEndReachedThreshold={2}
            ListFooterComponent={this._listFooterComponent}
            onEndReached={this._onEndReached}
            viewabilityConfigCallbackPairs={this.viewabilityConfigCallbackPairs}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { backgroundColor: '#f7f7f7' },
  loadingView: { height: 100, alignItems: 'center', justifyContent: 'center' },
  contentView: { flex: 1 }
})
