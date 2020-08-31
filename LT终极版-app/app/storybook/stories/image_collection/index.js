/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import AppendButton from './append_button'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import {
  dismissFullscreenImage,
  showFullscreenImage
} from '../products/Carousel'

export default class ImageCollection extends PureComponent {
  render() {
    const {
      array,
      itemStyle,
      lockCollectionItem,
      appendComponent,
      deleteTheCollectionItem,
      appendCollectionItem,
      onClickCollectionItem,
      renderItem,
      maxLength,
      disabled,
      isStylist,
      wrapperStyle
    } = this.props
    return (
      <View style={[styles.container, wrapperStyle]}>
        {!!lockCollectionItem && (
          <CollectionItem
            disabled={true}
            onClickCollectionItem={onClickCollectionItem}
            data={lockCollectionItem}
            renderItem={renderItem}
            itemStyle={itemStyle}
          />
        )}
        {array &&
          array.map((item, index) => {
            return (
              <CollectionItem
                disabled={disabled}
                key={index}
                data={item}
                images={array}
                onClickCollectionItem={onClickCollectionItem}
                deleteTheCollectionItem={deleteTheCollectionItem}
                renderItem={renderItem}
                itemStyle={itemStyle}
                index={index}
              />
            )
          })}
        {array.length < maxLength &&
          !isStylist &&
          (appendComponent ? (
            appendComponent
          ) : (
            <AppendButton
              itemStyle={itemStyle}
              onPress={appendCollectionItem}
            />
          ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap' },
  image: {
    marginRight: 8,
    marginBottom: 12
  },
  closeIcon: { position: 'absolute', right: 8 },
  loading: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  }
})

ImageCollection.defaultProps = {
  array: [],
  maxLength: 3,
  itemStyle: null,
  disabled: false,
  appendComponent: null
}

ImageCollection.propTypes = {
  array: PropTypes.array,
  maxLength: PropTypes.number,
  itemStyle: PropTypes.object,
  disabled: PropTypes.bool,
  appendComponent: PropTypes.element
}

class CollectionItem extends PureComponent {
  _deleteTheCollectionItem = () => {
    const { deleteTheCollectionItem, data } = this.props
    deleteTheCollectionItem(data)
  }
  render() {
    const { itemStyle, disabled, renderItem, data, images, index } = this.props
    const { onClickCollectionItem } = this.props
    return (
      <View style={styles.container}>
        {renderItem ? (
          <View style={[styles.image, itemStyle]}>{renderItem(data)}</View>
        ) : (
          <ImageView
            onPress={onClickCollectionItem}
            style={[styles.image, itemStyle]}
            index={index}
            image={data}
            images={images}
          />
        )}
        {!disabled && (
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.closeIcon}
            onPress={this._deleteTheCollectionItem}>
            <Image
              source={require('../../../assets/images/customer_photos/customer_photo_close.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

class ImageView extends PureComponent {
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
            source={{ uri: image.uri }}
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
    const { image, index, onPress } = this.props
    if (!image) {
      return
    }
    if (onPress) {
      onPress(image, index)
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
        <Image style={style} source={{ uri: image && image.uri }} />
        {!image.upload_url && (
          <View style={[styles.image, style, styles.loading]}>
            <Spinner size={16} type={'Circle'} color={'#FFF'} />
          </View>
        )}
      </TouchableOpacity>
    )
  }
}
