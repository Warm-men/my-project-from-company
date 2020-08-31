/* @flow */

import React, { PureComponent } from 'react'
import { TouchableOpacity, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import { dismissFullscreenImage, showFullscreenImage } from '../../Carousel'
import Image from '../../../image'

export default class CataloguePhotosItem extends PureComponent {
  constructor(props) {
    super(props)
    this.imageRef = null
    this.fullscreenImage = {}
  }

  _getFullScreenImage = () => {
    const { data } = this.props
    const { height, width } = Dimensions.get('window')
    return (
      data &&
      data.map(item => {
        return (
          <Image
            key={item.full_url}
            style={{ height, width }}
            source={{ uri: item.zoom_url || item.full_url }}
            defaultSource={{ uri: item.full_url }}
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
    const { item, index } = this.props
    if (!item) {
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
    const { item, style } = this.props
    let image = item.zoom_url
    if (!image) {
      image =
        item.full_url.indexOf('medium') !== -1
          ? item.full_url.replace('medium_', 'zoom_')
          : item.full_url.replace('full_', 'zoom_')
    }
    return (
      <TouchableOpacity
        style={style}
        activeOpacity={1}
        ref={ref => (this.imageRef = ref)}
        onPress={this._onClick}>
        <Image
          style={style}
          source={{ uri: image }}
          defaultSource={{ uri: item.full_url }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    )
  }
}

CataloguePhotosItem.defaultProps = {
  index: 0,
  item: null
}

CataloguePhotosItem.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object
}
