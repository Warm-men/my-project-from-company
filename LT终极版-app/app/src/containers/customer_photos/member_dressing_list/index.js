/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, FlatList, Platform } from 'react-native'
import { QNetwork, SERVICE_TYPES } from '../../../expand/services/services'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import MemberDressingItem from '../../../../storybook/stories/member_dressing/member_dressing_item'
import JoinButton from '../../../../storybook/stories/customer_photos/customer_photos_in_details/join_button'
import { getCurrentItemKey } from '../../../expand/tool/daq'
import { inject, observer } from 'mobx-react'

@inject('customerPhotosStore')
@observer
export default class MemberDressingListContainer extends Component {
  constructor(props) {
    super(props)
    this.isLoading = false
    this.state = { page: 1, perPage: 5, isMore: false, data: [] }
  }

  componentDidMount() {
    this._getTheCustomerPhoto()
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _getTheCustomerPhoto = () => {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const { page, perPage } = this.state
    const { customerPhotosStore } = this.props
    QNetwork(
      SERVICE_TYPES.memberDressing.QUERY_MEMBER_DRESSING,
      { page, perPage },
      response => {
        const { exhibiting_totes } = response.data
        if (exhibiting_totes && exhibiting_totes.length) {
          const customerPotos = this._formCustomerPhotos(exhibiting_totes)
          customerPhotosStore.updateLikesStatus(customerPotos)
          this.setState({
            page: page + 1,
            data: [...this.state.data, ...exhibiting_totes],
            isMore: exhibiting_totes.length === perPage
          })
        }
        this.isLoading = false
      },
      () => {
        this.isLoading = false
      }
    )
  }

  _formCustomerPhotos = exhibiting_totes => {
    let customerPhotos = []
    exhibiting_totes.map(
      item => (customerPhotos = [...customerPhotos, ...item.customer_photos])
    )
    return customerPhotos
  }

  _extractUniqueKey = (item, index) => {
    return getCurrentItemKey(item.id, index)
  }

  _renderItem = ({ item, index }) => {
    const { navigation } = this.props
    return (
      <MemberDressingItem
        key={index}
        exhibitingTote={item}
        currentColunm={'list'}
        navigation={navigation}
      />
    )
  }

  _onEndReached = () => {
    this.state.isMore && this._getTheCustomerPhoto()
  }

  render() {
    const { data, isMore } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'会员晒穿搭'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.contentView}>
          <FlatList
            style={styles.list}
            initialNumToRender={3}
            windowSize={5}
            keyExtractor={this._extractUniqueKey}
            data={data}
            extraData={isMore}
            renderItem={this._renderItem}
            removeClippedSubviews={Platform.OS === 'ios' ? false : true}
            onEndReachedThreshold={2}
            onEndReached={this._onEndReached}
          />
          <JoinButton
            navigation={this.props.navigation}
            buttonText={'加入托特衣箱'}
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
