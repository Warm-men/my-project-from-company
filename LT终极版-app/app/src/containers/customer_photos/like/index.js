/* @flow */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native'
import Image from '../../../../storybook/stories/image'
import { SERVICE_TYPES, Mutate } from '../../../expand/services/services'
import { inject, observer } from 'mobx-react'
import { Experiment, Variant, abTrack } from '../../../components/ab_testing'
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
    const { currentCustomerStore, customerPhotosStore, id } = this.props
    if (!currentCustomerStore.id) {
      currentCustomerStore.setLoginModalVisible(true)
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
    const { customerPhotosStore, id, shouldAnimatedButton } = this.props
    const likesStatus = customerPhotosStore.likesStatus[id]
    let liked, likes_count
    if (likesStatus) {
      liked = likesStatus.liked
      likes_count = likesStatus.likes_count
    }

    const buttonTitle = this._getButtonContent(likes_count)
    const unLikeIcon = require('../../../../assets/images/customer_photos/like.png')
    const likedIcon = require('../../../../assets/images/customer_photos/liked_white.png')
    const likedRed = require('../../../../assets/images/customer_photos/liked_red.png')
    const customerPhotoLikeGif = require('../../../../assets/animation/like/customer_photo_like.gif')
    return (
      <TouchableOpacity onPress={this._onClick}>
        <Experiment defaultValue={1} flagName={'like_button'}>
          <Variant value={1}>
            <View
              style={[
                styles.viewWrapper,
                liked ? styles.likedStatus : styles.variantView1
              ]}>
              {liked ? (
                <Image style={styles.icon} source={likedIcon} />
              ) : (
                <Image style={styles.icon} source={unLikeIcon} />
              )}
              <Text
                style={[
                  styles.title,
                  liked ? styles.likedTitle : styles.normalTitle
                ]}>
                {buttonTitle}
              </Text>
            </View>
          </Variant>
          <Variant value={2}>
            <View style={[styles.viewWrapper, liked && styles.variantView2]}>
              {liked ? (
                <Image style={styles.icon} source={likedRed} />
              ) : shouldAnimatedButton ? (
                <Image style={styles.gifIcon} source={customerPhotoLikeGif} />
              ) : (
                <Image style={styles.icon} source={unLikeIcon} />
              )}
              <Text
                style={[
                  styles.title,
                  liked ? styles.likedTitleRed : styles.normalTitle
                ]}>
                {buttonTitle}
              </Text>
            </View>
          </Variant>
        </Experiment>
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
  icon: { width: 17, height: 17, marginRight: 4 },
  gifIcon: { width: 28, height: 28, marginRight: 2 },
  likedStatus: { backgroundColor: '#E85C40' },
  title: { fontSize: 12 },
  normalTitle: { color: '#979797' },
  likedTitle: { color: '#fff' },
  likedTitleRed: { color: '#E85C40' },
  viewWrapper: {
    width: 66,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 15
  },
  variantView1: {
    borderWidth: 1,
    borderColor: '#ccc'
  },
  variantView2: {
    backgroundColor: '#fff'
  }
})
