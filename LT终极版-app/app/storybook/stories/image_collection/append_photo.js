/* @flow */

import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import PropTypes from 'prop-types'
import Image from '../image'
// eslint-disable-next-line
import ImagePicker from 'react-native-syan-image-picker'
import { inject } from 'mobx-react'
import Statistics from '../../../src/expand/tool/statistics'

@inject('modalStore')
export default class AppendPhotoButton extends PureComponent {
  static options = { quality: 75, enableBase64: true }

  _showImagePicker = () => {
    const { maxLength, currentCount, updatePhotos } = this.props
    const imageCount = maxLength - currentCount
    const config = { imageCount, ...AppendPhotoButton.options }
    ImagePicker.asyncShowImagePicker(config)
      .then(photos => {
        if (photos && photos.length && updatePhotos) {
          const array = []
          photos.forEach(data => {
            const { width, height, uri } = data
            const object = { width, height, uri, avatarSource: data.base64 }
            array.push(object)
          })
          updatePhotos(array)
        }
      })
      .catch(() => {})
    Statistics.onEvent({
      id: 'photos_upload_click',
      label: '发表晒单页面点上传图片'
    })
  }

  render() {
    const { isQuality, currentCount, maxLength } = this.props
    const image = isQuality
      ? require('../../../assets/images/rating/add_photo.png')
      : require('../../../assets/images/customer_photos/append_button.png')
    return (
      <TouchableOpacity
        style={isQuality ? styles.ratingButton : styles.button}
        onPress={this._showImagePicker}>
        <Image source={image} />
        {isQuality ? (
          <Text style={styles.photosCount}>
            {`${currentCount + 1}/${maxLength}`}
          </Text>
        ) : null}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  ratingButton: { width: 60, height: 60, marginBottom: 12 },
  photosCount: {
    position: 'absolute',
    bottom: '25%',
    textAlign: 'center',
    width: 60,
    fontSize: 10,
    color: '#989898'
  },
  button: { width: 90, height: 120, marginRight: 12, marginBottom: 12 }
})

AppendPhotoButton.defaultProps = {
  currentCount: 0,
  maxLength: 3
}

AppendPhotoButton.propTypes = {
  currentCount: PropTypes.number,
  maxLength: PropTypes.number
}
