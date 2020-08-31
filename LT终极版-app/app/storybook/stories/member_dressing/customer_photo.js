/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import Customers from '../customer_photos/customer_photo/customers'

export default class CustomerPhoto extends PureComponent {
  _getShareTopics = () => {
    const { share_topics } = this.props.customerPhoto
    let topics = []
    share_topics.map((item, index) => {
      topics.push(
        <Text key={index} style={styles.shareTopics}>
          {item.title}
        </Text>
      )
    })
    topics.push(<Text key={share_topics.length + 1}>{'  '}</Text>)
    return topics
  }

  _renderPhotos = () => {
    const { goCustomerPhotoDetails, customerPhoto } = this.props
    if (!customerPhoto.photos.length) return null
    let Photos = customerPhoto.photos.map((item, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          onPress={() => goCustomerPhotoDetails(customerPhoto, index)}>
          <Image style={styles.photo} source={{ uri: item.url }} />
        </TouchableOpacity>
      )
    })
    return Photos
  }

  render() {
    const { customerPhoto, index, length, currentColunm } = this.props
    const ShareTopics = this._getShareTopics()
    const Photos = this._renderPhotos()
    const hasBottomBorder = index + 1 < length
    return (
      <View style={[styles.container, hasBottomBorder && styles.hairline]}>
        <Text style={styles.content}>
          {customerPhoto.featured && <Text>{`             `}</Text>}
          {ShareTopics}
          {customerPhoto.content}
        </Text>
        {customerPhoto.featured && (
          <Image
            style={styles.featuredIcon}
            source={require('../../../assets/images/customer_photos/featured_icon.png')}
          />
        )}
        <View style={styles.photoView}>{Photos}</View>
        {currentColunm !== 'home' ? (
          <Customers
            id={customerPhoto.id}
            customer={customerPhoto.customer}
            shouldAnimatedButton={false}
            style={styles.fixPadding}
          />
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    paddingBottom: 20
  },
  hairline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    marginBottom: 23
  },
  fixPadding: {
    paddingHorizontal: 0,
    marginTop: 25,
    marginBottom: 0
  },
  featuredIcon: {
    position: 'absolute',
    width: p2d(40),
    height: p2d(18),
    backgroundColor: '#E85C40',
    borderRadius: 2,
    top: 1
  },
  content: {
    color: '#5E5E5E',
    fontSize: 13,
    lineHeight: 21,
    letterSpacing: 0.4
  },
  photo: {
    width: p2d(109),
    height: p2d(145),
    borderRadius: 4,
    marginRight: p2d(8)
  },
  photoView: {
    marginTop: 16,
    flexDirection: 'row'
  }
})
