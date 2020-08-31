import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList
} from 'react-native'
import Point from './point'
import Image from '../../image'
import Icons from 'react-native-vector-icons/SimpleLineIcons'
import { inject } from 'mobx-react'

const cWidth = Dimensions.get('window').width - 30
const cHeight = (cWidth / 3) * 4

@inject('appStore')
export default class TaggingComponent extends Component {
  _getImageViewSize = index => {
    const { currentPhotos } = this.props
    const { width, height } = currentPhotos[index]
    const sizeScale = width / height
    const useWidth = sizeScale > 0.75

    const imageWidth = useWidth ? cWidth : cHeight * sizeScale
    const imageHeight = useWidth ? cWidth / sizeScale : cHeight

    return { width: imageWidth, height: imageHeight }
  }

  _last = () => {
    const { onChangeIndex, currnetIndex } = this.props
    const index = currnetIndex - 1
    if (index >= 0) {
      onChangeIndex && onChangeIndex(index)
      this._flatList.scrollToIndex({ viewPosition: 0, index })
    }
  }
  _next = () => {
    const { onChangeIndex, currnetIndex, currentPhotos } = this.props
    const index = currnetIndex + 1
    if (index < currentPhotos.length) {
      onChangeIndex && onChangeIndex(index)
      this._flatList.scrollToIndex({ viewPosition: 0, index })
    }
  }

  _getItemLayout = (_, index) => {
    return { length: cWidth, offset: cWidth * index, index }
  }

  _renderItem = ({ item, index }) => {
    const { updateSticker } = this.props
    const { avatarSource, stickers } = item
    const imageSize = this._getImageViewSize(index)

    return (
      <View style={[styles.item, { width: cWidth, height: cHeight }]}>
        <TouchableOpacity onPress={this._onClickImagaView} activeOpacity={1}>
          <Image style={imageSize} source={{ uri: avatarSource }} />
          {stickers &&
            stickers.map(sticker => {
              return (
                <Point
                  key={sticker.product.id}
                  contentSize={imageSize}
                  sticker={sticker}
                  updateSticker={updateSticker}
                />
              )
            })}
        </TouchableOpacity>
      </View>
    )
  }

  _onClickImagaView = () => {
    if (!this.isShowedToast) {
      this.isShowedToast = true
      this.props.appStore.showToastWithOpacity('标记底部的单品即可添加标签')
    }
  }

  render() {
    const {
      updateSticker,
      currnetIndex,
      initialIndex,
      currentPhotos
    } = this.props

    const showRightButton =
      currentPhotos.length > 1 && currnetIndex !== currentPhotos.length - 1

    return (
      <View style={[styles.container, { width: cWidth, height: cHeight }]}>
        <FlatList
          ref={flatlist => (this._flatList = flatlist)}
          scrollEnabled={false}
          horizontal
          initialScrollIndex={initialIndex}
          getItemLayout={this._getItemLayout}
          showsHorizontalScrollIndicator={false}
          data={currentPhotos}
          renderItem={this._renderItem}
        />
        {currnetIndex ? (
          <TouchableOpacity
            onPress={this._last}
            style={[styles.arrowButton, styles.leftButton]}>
            <Icons name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
        ) : null}
        {showRightButton ? (
          <TouchableOpacity
            onPress={this._next}
            style={[styles.arrowButton, styles.rightButton]}>
            <Icons name="arrow-right" size={18} color="#fff" />
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    marginHorizontal: 15
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  item: { alignItems: 'center', justifyContent: 'center' },
  leftButton: { left: 15, bottom: 15, paddingRight: 4 },
  rightButton: { right: 15, bottom: 15, paddingLeft: 4 }
})
