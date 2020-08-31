/* @flow */

import React, { Component } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { QNetwork, SERVICE_TYPES } from '../../../expand/services/services'
import { Client } from '../../../expand/services/client'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import CustomerPhoto from '../../../../storybook/stories/customer_photos/customer_photo'
import NavigationTitle from '../../../../storybook/stories/customer_photos/customer_photos_in_details/navigation_title'
import { shareCustomerPhoto } from '../../../expand/tool/share'
import { inject } from 'mobx-react'
import SharePanel from '../../common/SharePanel'
import ShareImage from '../../../../storybook/stories/alert/share_image'
import JoinButton from '../../../../storybook/stories/customer_photos/customer_photos_in_details/join_button'

@inject('customerPhotosStore', 'panelStore', 'currentCustomerStore')
export default class TheCustomerPhotoContainer extends Component {
  constructor(props) {
    super(props)
    const { data, column } = props.navigation.state.params
    this.column = column
    this.state = {
      data: data ? [data] : [],
      customer: data ? data.customer : null
    }
  }

  componentDidMount() {
    this._getTheCustomerPhoto()
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _share = () => {
    const { currentCustomerStore, navigation } = this.props
    const { sharePoster } = navigation.state.params
    if (!this.state.data.length) return
    const customerPhoto = this.state.data[0]
    if (sharePoster) {
      if (customerPhoto) {
        this.detailsShare(customerPhoto)
      }
      return
    }
    const oneself =
      customerPhoto.customer.id === parseInt(currentCustomerStore.id)
    const photos = customerPhoto.photos
    if (photos && photos.length && photos[0].url) {
      shareCustomerPhoto(customerPhoto.id, photos[0].url, oneself)
    }
  }

  detailsShare = customerPhoto => {
    const { id, photos, mini_program_code_url } = customerPhoto
    this.props.panelStore.show(
      <SharePanel
        type="imageFile"
        url={Client.ORIGIN + '/customer_photo_details?customer_photo_id=' + id}
        thumbImage={photos.length > 0 ? photos[0].url : ''}
        title={'我在托特衣箱上发了一篇晒单，快来帮我点赞吧'}
        description={'高品质品牌服饰随心换穿你也可以！'}
        component={
          <ShareImage
            imageUrl={photos.length > 0 ? photos[0].url : ''}
            miniProgramCodeUrl={mini_program_code_url}
          />
        }
      />
    )
  }

  _getTheCustomerPhoto = () => {
    const { customerPhotosStore, navigation } = this.props
    const { id } = navigation.state.params
    const variables = { customer_photo_id: id }
    QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_THE_CUSTOMER_PHOTO_DETAILS,
      variables,
      response => {
        const { customer_photos } = response.data.customer_photo_summary
        if (customer_photos && customer_photos.length) {
          customerPhotosStore.updateLikesStatus(customer_photos)
          this.setState({ data: customer_photos })
        }
      }
    )
  }

  _extractUniqueKey = (item, index) => {
    return index.toString()
  }

  _getReportData = index => {
    const { routeName, params } = this.props.navigation.state
    const { page, limit } = this.state
    const variables = { page: page - 1, limit, customer_photo_id: params.id }

    return { variables, column: this.column, index, router: routeName }
  }

  _renderItem = ({ item, index }) => {
    const { navigation } = this.props
    const obj = { navigation, index }

    const { params } = navigation.state
    if (params.id === item.id && params.index) {
      obj.initialIndex = params.index
    }
    return (
      <CustomerPhoto
        {...obj}
        data={item}
        column={this.column}
        getReportData={this._getReportData}
      />
    )
  }

  render() {
    const { isSubscriber } = this.props.currentCustomerStore
    const { customer, data } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'晒单详情'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
          titleView={customer ? <NavigationTitle customer={customer} /> : null}
          rightBarButtonItem={
            <BarButtonItem onPress={this._share} buttonType={'share'} />
          }
        />
        <FlatList
          style={styles.list}
          initialNumToRender={3}
          windowSize={5}
          keyExtractor={this._extractUniqueKey}
          data={data}
          renderItem={this._renderItem}
        />
        {isSubscriber ? null : (
          <JoinButton navigation={this.props.navigation} />
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { backgroundColor: '#f7f7f7' },
  loadingView: { height: 100, alignItems: 'center', justifyContent: 'center' }
})
