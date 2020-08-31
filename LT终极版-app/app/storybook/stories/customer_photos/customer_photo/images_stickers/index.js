/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated
} from 'react-native'
import AnimatedPoint from '../../animated_point'
import _ from 'lodash'

export default function ImageStickers(props) {
  const {
    navigation,
    photo,
    offsetWidth,
    offsetHeight,
    column,
    stickers
  } = props
  if (photo.height <= 0 || photo.width <= 0) return null
  const newStickers = checkSticketsPoint(stickers)
  return _.map(newStickers, (v, k) => (
    <Sticker
      navigation={navigation}
      sticker={v}
      photo={photo}
      column={column}
      offsetWidth={offsetWidth}
      offsetHeight={offsetHeight}
      key={k}
    />
  ))
}

//检查锚点位置是否符合规则
function checkSticketsPoint(stickers) {
  const array = []
  stickers.forEach(item => {
    const { degree, anchor_x, anchor_y, product } = item

    const onCheck = i => {
      const y = Math.abs(i.anchor_y - anchor_y)
      const x = Math.abs(i.anchor_x - anchor_x)
      return (
        product.id !== i.product.id &&
        y < 0.03 &&
        degree === i.degree &&
        x < 0.1
      )
    }

    const sticker = stickers.find(i => onCheck(i))
    if (!sticker) {
      array.push(item)
      return
    }

    const inSticker = array.find(i => onCheck(i))
    if (!inSticker) {
      array.push(item)
    }
  })

  return array
}

class Sticker extends PureComponent {
  constructor(props) {
    super(props)
    const { degree } = props.sticker
    this.isTransform = degree > 0

    this.emptyTextLength = 35 //NOTE：没有文字时锚点
    this.minTextLength = Platform.OS === 'android' ? 40 : 55 //NOTE：最小显示字数宽度

    this.maxTextLength = 130 //NOTE：最大显示字数宽度

    this._animatedWidth = new Animated.Value(0)
    this._animatedOpacity = new Animated.Value(0)

    const { maxWidth } = this.textStyle()
    this.maxWidth = maxWidth
  }

  componentDidMount() {
    this._startAnimated()
  }

  _startAnimated = () => {
    setTimeout(() => {
      Animated.stagger(200, [
        Animated.spring(this._animatedOpacity, { toValue: 1, tension: 50 }),
        Animated.timing(this._animatedWidth, {
          toValue: this.maxWidth + 12,
          duration: 240
        })
      ]).start()
    }, 500)
  }

  _onClick = () => {
    const { navigation, column, sticker } = this.props
    navigation.push('Details', { item: sticker.product, column })
  }

  getStyle = () => {
    const { anchor_x, anchor_y } = this.props.sticker
    const left = anchor_x * 100
    const top = anchor_y * 100
    if (this.isTransform) {
      return {
        top: `${top}%`,
        right: `${100 - left}%`,
        flexDirection: 'row-reverse'
      }
    } else {
      return { top: `${top}%`, left: `${left}%`, flexDirection: 'row' }
    }
  }

  isShow = () => {
    const { photo, offsetHeight, offsetWidth, sticker } = this.props
    const { anchor_x, anchor_y } = sticker
    const scale = photo.width / photo.height
    if (photo.height / photo.width > 4 / 3) {
      const truthHeight = (1 / scale) * offsetHeight
      const anchorHeight = anchor_y * truthHeight
      const emptyHeightArea = (truthHeight - offsetHeight) / 2
      const isValidHeight =
        anchorHeight > emptyHeightArea &&
        anchorHeight < truthHeight - emptyHeightArea
      return isValidHeight
    } else {
      const truthWidth = 1 * scale * offsetWidth
      const anchorWidth = anchor_x * truthWidth
      const emptyWidthArea = (truthWidth - offsetWidth) / 2
      const isValidWidth =
        anchorWidth > emptyWidthArea &&
        anchorWidth < truthWidth - emptyWidthArea
      return isValidWidth
    }
  }

  textStyle = () => {
    const { sticker, offsetWidth } = this.props
    let width = 0
    let display = 'flex'
    const left = sticker.anchor_x * offsetWidth
    if (this.isTransform) {
      if (left < this.minTextLength + this.emptyTextLength) {
        // NOTE：不显示
        display = 'none'
      } else if (left < this.maxTextLength + this.emptyTextLength) {
        width = left - this.emptyTextLength - 3
      } else {
        width = this.maxTextLength
      }
    } else {
      if (left + this.minTextLength + this.emptyTextLength > offsetWidth) {
        // NOTE：不显示
        display = 'none'
      } else if (
        left + this.maxTextLength + this.emptyTextLength >
        offsetWidth
      ) {
        width = offsetWidth - (left + this.emptyTextLength + 3)
      } else {
        width = this.maxTextLength
      }
    }
    return { maxWidth: Math.floor(width), display }
  }

  render() {
    const { display } = this.textStyle()
    const { sticker } = this.props
    if (!sticker || !this.isShow() || display === 'none') {
      return null
    }
    const { product } = sticker
    return (
      <View style={[styles.container, this.getStyle()]}>
        <AnimatedPoint />
        <Animated.View
          style={[
            styles.stickerBorder,
            { opacity: this._animatedOpacity },
            this.isTransform ? { marginRight: -10 } : { marginLeft: -10 }
          ]}
        />
        <TouchableOpacity onPress={this._onClick} activeOpacity={0.6}>
          <Animated.View
            style={[
              styles.contentView,
              { opacity: this._animatedWidth, maxWidth: this._animatedWidth },
              { flexDirection: this.isTransform ? 'row-reverse' : 'row' }
            ]}>
            <Animated.Text
              numberOfLines={1}
              style={[
                styles.stickerText,
                { maxWidth: this.maxWidth, display }
              ]}>
              {product.title}
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10
  },
  stickerBorder: { height: 1, width: 16, backgroundColor: '#fff' },
  contentView: {
    borderWidth: 1,
    borderColor: '#fff',
    height: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, 0.5)',
    paddingHorizontal: 6
  },
  stickerText: { color: '#fff', overflow: 'hidden', fontSize: 12 }
})
