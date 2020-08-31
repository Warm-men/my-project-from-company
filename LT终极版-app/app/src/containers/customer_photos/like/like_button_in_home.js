/* @flow */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import Image from '../../../../storybook/stories/image'
import { SERVICE_TYPES, Mutate } from '../../../expand/services/services'
import { abTrack } from '../../../components/ab_testing'
import { inject, observer } from 'mobx-react'
import { updateCustomerPhotoCenterData } from '../../../expand/tool/customer_photos'
@inject('currentCustomerStore', 'customerPhotosStore')
@observer
export default class LikeButton extends Component {
  _getButtonContent = likesCount => {
    let buttonTitle
    if (likesCount) {
      buttonTitle = likesCount > 999 ? '999+' : likesCount
    } else {
      buttonTitle = '赞'
    }
    return buttonTitle
  }
  _onClick = () => {
    const {
      currentCustomerStore,
      customerPhotosStore,
      id,
      onSignIn
    } = this.props
    if (!currentCustomerStore.id) {
      currentCustomerStore.setLoginModalVisible(true, onSignIn)
      return
    }
    const likesStatus = customerPhotosStore.getLikeStatus(id)
    const liked = !likesStatus.liked
    if (liked) abTrack('click_like_button', 1)
    const likesCount = liked
      ? likesStatus.likes_count + 1
      : likesStatus.likes_count - 1
    const newestStatus = { ...likesStatus, id, liked, likes_count: likesCount }
    customerPhotosStore.updateLikesStatus([newestStatus])

    const input = { customer_photo_id: id }
    const query = liked
      ? SERVICE_TYPES.customerPhotos.MUTATION_LIKE_CUSTOMER_PHOTO
      : SERVICE_TYPES.customerPhotos.MUTATION_DISLIKE_CUSTOMER_PHOTO
    Mutate(query, { input }, response => {
      const { LikeCustomerPhoto, DislikeCustomerPhoto } = response.data
      const customerPhoto = LikeCustomerPhoto
        ? LikeCustomerPhoto.customer_photo
        : DislikeCustomerPhoto.customer_photo
      customerPhotosStore.updateLikesStatus([customerPhoto])
      if (customerPhoto.customer.id === parseInt(currentCustomerStore.id)) {
        updateCustomerPhotoCenterData()
      }
    })
  }
  render() {
    const { customerPhotosStore, id } = this.props
    const likesStatus = customerPhotosStore.likesStatus[id]
    let liked, likes_count
    if (likesStatus) {
      liked = likesStatus.liked
      likes_count = likesStatus.likes_count
    }
    const buttonTitle = this._getButtonContent(likes_count)
    return (
      <TouchableOpacity
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        onPress={this._onClick}
        style={styles.container}>
        <Image
          style={styles.icon}
          source={
            liked
              ? require('../../../../assets/images/customer_photos/liked_red.png')
              : require('../../../../assets/images/customer_photos/like.png')
          }
        />
        <Text
          style={[
            styles.title,
            liked ? styles.likedTitle : styles.normalTitle
          ]}>
          {buttonTitle}
        </Text>
      </TouchableOpacity>
    )
  }
}

LikeButton.defaultProps = {
  id: 0
}

LikeButton.propTypes = {
  id: PropTypes.number
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', flexDirection: 'row', marginRight: 8 },
  icon: { width: 14, height: 14, marginRight: 4 },
  title: { fontSize: 11 },
  normalTitle: { color: '#989898' },
  likedTitle: { color: '#E85C40' }
})
