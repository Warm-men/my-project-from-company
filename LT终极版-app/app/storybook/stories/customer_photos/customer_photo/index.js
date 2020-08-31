/* @flow */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import UserInfo from './userinfo'
import Photos from './photos'
import Content from './content'
import Customers from './customers'
import Products from './products'
import Review from './review'
import { shareCustomerPhoto } from '../../../../src/expand/tool/share'
import {
  getCurrentItemKey,
  updateViewableItemStatus
} from '../../../../src/expand/tool/daq'
import { inject } from 'mobx-react'

@inject('currentCustomerStore')
export default class CustomerPhoto extends PureComponent {
  _pushToProductDetail = item => {
    const { column } = this.props
    this.props.navigation.push('Details', { item, column })
  }

  _shareCustomerPhoto = () => {
    const { data } = this.props
    const image = data.photos[0] ? data.photos[0].url : ''
    shareCustomerPhoto(data.id, image)
  }

  _onClickTopic = uri => {
    this.props.navigation.navigate('WebPage', { uri })
  }

  _getReportData = () => {
    const { getReportData, index } = this.props
    return getReportData && getReportData(index)
  }

  _updateClosetStatus = (id, isAddToCloset, data) => {
    if (isAddToCloset) {
      const { index } = this.props
      const currentKey = getCurrentItemKey(id, index)
      updateViewableItemStatus(currentKey, { id, closet: true }, data)
    }
  }

  _showFeaturedIcon = () => {
    const { data, currentCustomerStore } = this.props
    const { customer, featured } = data

    if (customer && customer.id == currentCustomerStore.id && featured) {
      return true
    }
  }

  render() {
    const {
      index,
      data,
      subTitle,
      column,
      navigation,
      initialIndex,
      isViewable
    } = this.props

    const { id, customer, photos, share_topics, content, products } = data
    const showUserInfo = !!index
    const shouldAnimatedButton = !index
    const hasLabel = this._showFeaturedIcon()
    const { review, incentives } = data
    return (
      <View style={styles.container}>
        {subTitle ? (
          <View style={styles.header}>
            <Text style={styles.subTitle}>{subTitle}</Text>
          </View>
        ) : null}
        {showUserInfo && (
          <UserInfo
            shareCustomerPhoto={this._shareCustomerPhoto}
            customer={customer}
          />
        )}
        <Photos
          photos={photos}
          column={column}
          navigation={navigation}
          hasLabel={hasLabel}
          initialIndex={initialIndex}
          isViewable={isViewable}
        />
        <Content
          shareTopics={share_topics}
          content={content}
          onClickTopic={this._onClickTopic}
        />
        <Customers
          id={id}
          customer={customer}
          shouldAnimatedButton={shouldAnimatedButton}
        />
        <Review review={review} incentives={incentives} />
        {products && (
          <Products
            getReportData={this._getReportData}
            products={products}
            didSelectedItem={this._pushToProductDetail}
            updateClosetStatus={this._updateClosetStatus}
          />
        )}
      </View>
    )
  }
}

CustomerPhoto.defaultProps = {
  style: { width: 0, height: 0 },
  data: {
    content: '描述内容',
    share_topics: [{ title: '#话题#' }],
    photos: [{ mobile_url: '晒单地址' }],
    customer: { nickname: '昵称', avatar: '' }
  },
  index: 0,
  column: '',
  subTitle: null,
  hasLabel: false
}

CustomerPhoto.propTypes = {
  navigation: PropTypes.object,
  data: PropTypes.object,
  index: PropTypes.number,
  column: PropTypes.string,
  subTitle: PropTypes.string,
  hasLabel: PropTypes.bool
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', marginBottom: 1 },
  header: {
    paddingVertical: 16,
    paddingLeft: 15,
    borderTopWidth: 7,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#f7f7f7'
  },
  subTitle: { fontSize: 16, color: '#333', fontWeight: '500' }
})
