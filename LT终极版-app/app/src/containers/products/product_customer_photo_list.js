/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  Dimensions,
  Text
} from 'react-native'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import CustomerPhotoItem from '../../../storybook/stories/home/customerphotos/customer_photo_item'
const customerItemHeight = Dimensions.get('window').width + 20 + 40 + 98

export default class ProductCustomerPhotoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customerPhotos: null
    }
    this._getCustomerPhotosData()
  }

  _getCustomerPhotosData = () => {
    const id = this.props.navigation.state.params.id
    QNetwork(
      SERVICE_TYPES.products.QUERY_PRODUCT_DETAIL_CUSTOMER_PHOTO,
      { id },
      response => {
        this.setState({
          customerPhotos: response.data.product.customer_photos
        })
      }
    )
  }
  openProductDetail = item => {
    this.props.navigation.navigate('Details', { item })
  }

  _renderItem = ({ item }) => {
    const { params } = this.props.navigation.state
    return (
      <CustomerPhotoItem
        customerPhoto={item}
        style={styles.customerItem}
        onPress={this.openProductDetail}
        fromProduct={params && params.fromProduct ? true : false}
      />
    )
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  getItemLayout = (_, index) => {
    return {
      length: customerItemHeight,
      offset: customerItemHeight * index,
      index
    }
  }

  returnTitle = () => {
    const { params } = this.props.navigation.state
    return (
      <View style={styles.alignItemsCenter}>
        {params && params.title ? (
          <View style={styles.alignItemsCenter}>
            <Text style={styles.productTitle}>{params.title}</Text>
            <Text style={styles.productName}>{params.name}</Text>
          </View>
        ) : (
          <Text numberOfLines={1} style={styles.title}>
            最新晒单
          </Text>
        )}
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          titleView={this.returnTitle()}
          style={styles.navigationBar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <FlatList
          initialNumToRender={3}
          onEndReachedThreshold={2}
          keyExtractor={this._extractUniqueKey}
          onEndReached={this._onEndReached}
          data={this.state.customerPhotos}
          windowSize={5}
          renderItem={this._renderItem}
          getItemLayout={this.getItemLayout}
          {...Platform.select({
            ios: {
              removeClippedSubviews: false
            },
            android: {
              removeClippedSubviews: true
            }
          })}
        />
      </SafeAreaView>
    )
  }
  _extractUniqueKey(item) {
    return item.id.toString()
  }
  _onEndReached = () => {
    // 暂时单品晒单数据为一次请求
    // this._getCustomerPhotosData()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navigationBar: {
    borderBottomWidth: 0
  },
  customerItem: {
    height: customerItemHeight
  },
  alignItemsCenter: {
    alignItems: 'center'
  },
  title: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '400',
    color: '#000',
    letterSpacing: -0.41
  },

  productTitle: {
    fontSize: 14
  },
  productName: {
    marginTop: 5,
    fontSize: 12
  }
})
