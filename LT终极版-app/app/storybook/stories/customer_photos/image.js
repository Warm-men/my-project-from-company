/* @flow */

import React, { PureComponent } from 'react'
import { TouchableOpacity, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import {
  dismissFullscreenImage,
  showFullscreenImage
} from '../products/Carousel'
import Image from '../image'

export default class ImageView extends PureComponent {
  constructor(props) {
    super(props)
    this.imageRef = null
    this.fullscreenImage = {}
  }

  _getFullScreenImage = () => {
    const { images } = this.props
    const { height, width } = Dimensions.get('window')
    return (
      images &&
      images.map(image => {
        return (
          <Image
            key={image.url}
            style={{ height, width }}
            source={{ uri: image.url }}
            defaultSource={{ uri: image.mobile_url }}
            resizeMode="contain"
          />
        )
      })
    )
  }

  dismissFullscreenImage = () => {
    this.fullscreenImage && this.fullscreenImage.close()
  }

  _onClick = () => {
    const { image, index } = this.props
    if (!image) {
      return
    }
    showFullscreenImage(
      this.imageRef,
      index,
      this._getFullScreenImage,
      this.fullscreenImage,
      dismissFullscreenImage
    )
  }

  render() {
    const { image, style } = this.props
    return (
      <TouchableOpacity
        style={style}
        activeOpacity={1}
        ref={ref => (this.imageRef = ref)}
        onPress={this._onClick}>
        <Image style={style} source={{ uri: image && image.mobile_url }} />
      </TouchableOpacity>
    )
  }
}

ImageView.defaultProps = {
  index: 0,
  image: null,
  images: []
}

ImageView.propTypes = {
  index: PropTypes.number,
  image: PropTypes.object,
  images: PropTypes.array
}
