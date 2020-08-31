/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList, Platform } from 'react-native'
import {
  QNetwork,
  SERVICE_TYPES,
  Mutate
} from '../../../expand/services/services'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import CustomerPhoto from '../../../../storybook/stories/customer_photos/customer_photo'
import NavigationTitle from '../../../../storybook/stories/customer_photos/customer_photos_in_details/navigation_title'
import { AllLoadedFooter } from '../../../../storybook/stories/products'
import { shareCustomerPhoto } from '../../../expand/tool/share'
import { Column } from '../../../expand/tool/add_to_closet_status'
import _ from 'lodash'
import { inject } from 'mobx-react'

@inject('customerPhotosStore', 'currentCustomerStore')
export default class CustomerPhotosReviewedContainer extends Component {
  constructor(props) {
    super(props)
    this.isLoading = false
    this.state = {
      page: 1,
      limit: 10,
      isMore: true,
      data: [],
      showUserInfo: true
    }
  }

  componentDidMount() {
    this._getCustomerPhotosReviewed()
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }
  _share = () => {
    let data
    const { params } = this.props.navigation.state
    if (params) data = params.data
    const dataState = this.state.data
    let image
    if (data) {
      image = data.photos[0] ? data.photos[0].url : ''
      shareCustomerPhoto(data.id, image, true)
      return
    }
    if (dataState.length) {
      image = dataState[0].photos[0].url
      shareCustomerPhoto(dataState[0].id, image, true)
    }
  }

  _getCustomerPhotosReviewed = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { page, per_page } = this.state
    const { customerPhotosStore } = this.props
    const variables = { page, per_page, filter: 'reviewed' }
    QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_MY_CUSTOMER_PHOTOS,
      variables,
      response => {
        const { my_customer_photos } = response.data
        if (my_customer_photos.length) {
          //标记看过晒单点评
          this._readCustomerPhotosReview(my_customer_photos[0])
          customerPhotosStore.updateLikesStatus(my_customer_photos)
        }
        this.setState({
          page: page + 1,
          data: [...this.state.data, ...my_customer_photos],
          isMore: my_customer_photos.length === per_page
        })
        this.isLoading = false
      },
      () => {
        this.isLoading = false
      }
    )
  }

  _readCustomerPhotosReview = customerPhotos => {
    if (!customerPhotos.review) {
      return
    }
    const { currentCustomerStore } = this.props
    if (currentCustomerStore.unreadCustomerPhotoReview) {
      const input = { customer_photo_review_id: customerPhotos.review.id }
      Mutate(
        SERVICE_TYPES.customerPhotos.MUTATION_READ_CUSTOMER_PHOTO_REVIEW,
        { input },
        response => {
          const { has_unread_review } = response.data.ReadCustomerPhotoReview
          currentCustomerStore.unreadCustomerPhotoReview = has_unread_review
        }
      )
    }
  }

  _extractUniqueKey = (item, index) => {
    return item.id.toString()
  }

  _getReportData = index => {
    const { routeName } = this.props.navigation.state
    const { page, per_page } = this.state
    const variables = { page: page - 1, per_page, filter: 'reviewed' }
    const column = Column.CustomerPhotosReviewed
    return { variables, column, index, router: routeName }
  }

  _renderItem = ({ item, index }) => {
    const { navigation } = this.props
    const obj = { navigation, index }

    return (
      <CustomerPhoto
        {...obj}
        data={item}
        column={Column.CustomerPhotosReviewed}
        getReportData={this._getReportData}
      />
    )
  }

  _listFooterComponent = () => {
    return <AllLoadedFooter isMore={this.state.isMore} />
  }

  _onEndReached = () => {
    this.state.isMore && this._getTheRelatedCustomerPhotos()
  }

  _onViewableItemsChanged = ({ viewableItems, changed }) => {
    const item = _.minBy(viewableItems, item => {
      return item.index
    })
    if (item && item.index > 0) {
      this.setState({ showUserInfo: false })
    } else {
      this.setState({ showUserInfo: true })
    }
  }

  render() {
    const customer = this.state.data.length ? this.state.data[0].customer : null
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'晒单详情'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
          titleView={
            this.state.showUserInfo && customer ? (
              <NavigationTitle customer={customer} />
            ) : null
          }
          rightBarButtonItem={
            this.state.showUserInfo && this.state.data.length ? (
              <BarButtonItem onPress={this._share} buttonType={'share'} />
            ) : null
          }
        />
        <FlatList
          style={styles.list}
          initialNumToRender={3}
          windowSize={5}
          keyExtractor={this._extractUniqueKey}
          data={this.state.data}
          renderItem={this._renderItem}
          removeClippedSubviews={Platform.OS === 'ios' ? false : true}
          onEndReachedThreshold={2}
          ListFooterComponent={this._listFooterComponent}
          onEndReached={this._onEndReached}
          onViewableItemsChanged={this._onViewableItemsChanged}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { backgroundColor: '#f7f7f7' }
})
