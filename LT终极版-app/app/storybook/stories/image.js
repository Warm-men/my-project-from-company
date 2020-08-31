/* @flow */

import React, { PureComponent } from 'react'
import { Platform, Text, View, StyleSheet, Image } from 'react-native'
import FastImage from 'react-native-letote-fast-image'

const getUri = function(uri, qWidth) {
  if (uri.indexOf('https://qimg') === 0) {
    return (
      uri +
      (uri.indexOf('zoom_') > 0
        ? '?imageView2/0/format/webp'
        : editUrlWithQImage(uri, qWidth))
    )
  }
  return uri
}

const editUrlWithQImage = (url, qWidth) => {
  let cohesionSymbol = '?'
  if (
    url.indexOf('imageView2/') !== -1 ||
    url.indexOf('imageMogr2/') !== -1 ||
    url.indexOf('watermark/') !== -1 ||
    url.indexOf('roundPic/') !== -1
  ) {
    cohesionSymbol = '/'
  }

  if (qWidth) {
    return (
      cohesionSymbol +
      'imageMogr2/sharpen/1/format/webp' +
      '/thumbnail/' +
      qWidth +
      'x'
    )
  } else {
    return cohesionSymbol + 'imageMogr2/sharpen/1/format/webp'
  }
}

class CustomImage extends PureComponent {
  _getImageSize = () => {
    const { style } = this.props
    const size = {}
    if (typeof style === 'object') {
      if (style.length) {
        style.forEach(item => {
          if (item) {
            if (item.width) size.width = item.width
            if (item.height) size.height = item.height
            if (item.flex) size.flex = item.flex
          }
        })
      } else {
        if (style.width) size.width = style.width
        if (style.height) size.height = style.height
        if (style.flex) size.flex = style.flex
      }
    }
    return size
  }
  render() {
    const { source, defaultSource, qWidth, description, style } = this.props

    const imageSize = this._getImageSize()

    const { useRNImage } = this.props
    const ImageView =
      useRNImage && Platform.OS === 'android' ? Image : FastImage

    if (source && source.uri) {
      const uri = getUri(source.uri, qWidth)

      var imageSource
      if (Platform.OS === 'ios') {
        if (defaultSource && defaultSource.uri) {
          const defaultUrl = getUri(defaultSource.uri, defaultSource.width)
          imageSource = { uri, defaultUrl }
        } else {
          imageSource = { uri }
        }
      } else {
        if (defaultSource && defaultSource.uri) {
          this.props.defaultSource.uri = getUri(
            defaultSource.uri,
            defaultSource.width
          )
        }
        imageSource = { uri }
      }
      return (
        <View style={[style, styles.container]}>
          <ImageView {...this.props} style={imageSize} source={imageSource} />
          <Text style={styles.descriptionText}>
            {description ? description : '图片'}
          </Text>
        </View>
      )
    }
    return (
      <View style={[style, styles.container]}>
        <Text style={styles.descriptionText}>
          {description ? description : '图片'}
        </Text>
        <ImageView
          {...this.props}
          style={imageSize}
          source={source ? (source.hasOwnProperty('uri') ? '' : source) : ''}
          defaultSource={null}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  descriptionText: {
    display: 'none'
  },
  container: {
    overflow: 'hidden'
  }
})

export default CustomImage
