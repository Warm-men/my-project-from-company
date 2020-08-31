/* @flow */

import React, { Component } from 'react'
import {
  View,
  Text,
  PanResponder,
  TouchableOpacity,
  StyleSheet,
  Animated
} from 'react-native'
import getBytesLength from '../../../../src/expand/tool/get_byts_length'
import AnimatedPoint from '../animated_point'

export default class Point extends Component {
  constructor(props) {
    super(props)
    const { sticker, contentSize } = this.props
    const { width, height } = contentSize
    this.state = {
      top: sticker.anchor_y * height,
      left: sticker.anchor_x * width,
      flexDirection: sticker.degree === 0 ? 'row' : 'row-reverse'
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        let { dx, dy } = gestureState
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          return true
        } else {
          return false
        }
      },
      onPanResponderGrant: () => {
        this.offY = this.state.top
        this.offX = this.state.left
      },
      onPanResponderMove: (evt, gs) => {
        const { offY, offX, flexDirection } = this._checkBoundaries(gs)
        this.setState({ top: offY, left: offX, flexDirection })
      },
      onPanResponderRelease: (evt, gs) => {
        const { offY, offX } = this._checkBoundaries(gs)
        this.setState({ top: offY, left: offX })
        this._updateSticker(offX, offY)
      }
    })

    this._getMaxWidthForTag()
    this.titleLength =
      getBytesLength(sticker.product.title) * 6 > this.MAX_WIDTH
        ? this.MAX_WIDTH
        : getBytesLength(sticker.product.title) * 6

    this._startAnimated()
  }

  _startAnimated = () => {
    this._animatedWidth = new Animated.Value(0)
    this._animatedOpacity = new Animated.Value(0)

    Animated.stagger(200, [
      Animated.spring(this._animatedOpacity, { toValue: 1, tension: 50 }),
      Animated.timing(this._animatedWidth, {
        toValue: this.MAX_WIDTH + 12,
        duration: 240
      })
    ]).start()
  }

  _getMaxWidthForTag = () => {
    const { sticker, contentSize } = this.props
    const { width, height } = contentSize

    const defaultWidth = 130,
      minWidth = 60

    this.MAX_WIDTH = defaultWidth
    const { anchor_y, anchor_x, degree } = sticker
    if (degree === 0) {
      const maxW = (1 - anchor_x) * width - 40
      if (maxW < defaultWidth) {
        this.MAX_WIDTH = maxW
      }
    } else {
      const maxW = anchor_x * width - 30
      if (maxW < defaultWidth) {
        this.MAX_WIDTH = maxW
      }
    }
    if (this.MAX_WIDTH < minWidth) {
      this.MAX_WIDTH = minWidth
    }
  }

  _updateSticker = (offX, offY) => {
    const { contentSize, updateSticker, sticker } = this.props
    const { width, height } = contentSize
    const obj = {
      degree: this.state.flexDirection === 'row' ? 0 : 180,
      anchor_x: offX / width,
      anchor_y: offY / height,
      product: sticker.product
    }
    updateSticker && updateSticker(obj)
  }

  _checkBoundaries = ges => {
    const { flexDirection } = this.state
    const { width, height } = this.props.contentSize
    const { dy, dx } = ges

    const maxH = height - 20,
      maxW =
        flexDirection === 'row' ? width - 35 - this.titleLength : width - 20

    const minX = flexDirection === 'row' ? 10 : this.titleLength + 25
    const offY =
      this.offY + dy < 10 ? 10 : this.offY + dy > maxH ? maxH : this.offY + dy

    let offX,
      status = flexDirection
    if (this.offX + dx < minX) {
      offX = minX
      if (flexDirection !== 'row') {
        status = 'row'
      }
    } else if (this.offX + dx > maxW) {
      offX = maxW
      if (flexDirection === 'row') {
        status = 'row-reverse'
      }
    } else {
      offX = this.offX + dx
    }

    return { offY, offX, flexDirection: status }
  }

  _onClick = () => {
    let flexDirection = 'row'
    if (this.state.flexDirection === 'row') {
      flexDirection = 'row-reverse'
    }
    this.setState({ flexDirection }, () => {
      const { left, right, top } = this.state
      this.offX = left
      const gs = { dx: 0, dy: 0 }
      const { offX } = this._checkBoundaries(gs)

      this.setState({ left: offX })
      this._updateSticker(offX, top)
    })
  }

  _getPoint = () => {
    const { width } = this.props.contentSize
    const { flexDirection, top, left } = this.state

    const obj = { top, flexDirection }
    if (flexDirection === 'row') {
      obj.left = left
    } else {
      obj.right = width - left - 10
    }
    return obj
  }

  render() {
    const { title } = this.props.sticker.product
    const { flexDirection } = this.state
    const obj = this._getPoint()
    return (
      <View
        style={[styles.container, { ...obj }]}
        {...this._panResponder.panHandlers}>
        <AnimatedPoint onPress={this._onClick} />
        <Animated.View
          style={[
            styles.line,
            { opacity: this._animatedOpacity },
            flexDirection === 'row' ? { marginLeft: -10 } : { marginRight: -10 }
          ]}
        />
        <Animated.View
          style={[
            styles.titleContainer,
            { opacity: this._animatedWidth, maxWidth: this._animatedWidth }
          ]}>
          <Animated.Text
            numberOfLines={1}
            style={[styles.title, { maxWidth: this.MAX_WIDTH }]}>
            {title}
          </Animated.Text>
        </Animated.View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    height: 10
  },
  line: { width: 10, height: 1, backgroundColor: '#fff' },
  titleContainer: {
    height: 20,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6
  },
  title: { fontSize: 12, color: '#fff', lineHeight: 18 }
})
