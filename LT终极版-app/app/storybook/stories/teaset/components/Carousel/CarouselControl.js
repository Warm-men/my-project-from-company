// CarouselControl.js
//TODO 去掉不用的Theme
'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableOpacity, ViewPropTypes } from 'react-native'
import Theme from '../../themes/Theme'
export default class CarouselControl extends Component {
  static propTypes = {
    ...ViewPropTypes,
    dot: PropTypes.element,
    activeDot: PropTypes.element
  }

  static defaultProps = {
    ...View.defaultProps
  }

  renderDot(dotIndex) {
    let { dot, carousel } = this.props
    if (React.isValidElement(dot)) {
      dot = React.cloneElement(dot, {
        key: dotIndex,
        onPress: () => carousel && carousel.scrollToPage(dotIndex)
      })
      return dot
    }
    return (
      <TouchableOpacity
        key={'dot' + dotIndex}
        style={{
          width: Theme.carouselDotUseSize,
          height: Theme.carouselDotUseSize,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onPress={() => carousel && carousel.scrollToPage(dotIndex)}>
        <View
          style={{
            backgroundColor: Theme.carouselDotColor,
            width: Theme.carouselDotSize,
            height: Theme.carouselDotSize,
            borderRadius: Theme.carouselDotSize / 2
          }}
        />
      </TouchableOpacity>
    )
  }

  renderActiveDot(dotIndex) {
    let { activeDot } = this.props
    if (React.isValidElement(activeDot)) {
      activeDot = React.cloneElement(activeDot, { key: dotIndex })
      return activeDot
    }
    return (
      <TouchableOpacity
        key={dotIndex}
        style={{
          width: Theme.carouselDotUseSize,
          height: Theme.carouselDotUseSize,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <View
          style={{
            backgroundColor: Theme.carouselActiveDotColor,
            width: Theme.carouselDotSize,
            height: Theme.carouselDotSize,
            borderRadius: Theme.carouselDotSize / 2
          }}
        />
      </TouchableOpacity>
    )
  }

  renderDots() {
    let { index, total } = this.props
    let dots = []
    for (let i = 0; i < total; ++i) {
      if (i == index) dots.push(this.renderActiveDot(i))
      else dots.push(this.renderDot(i))
    }
    return dots
  }

  render() {
    let { style } = this.props
    return (
      <View
        style={[styles.container, StyleSheet.absoluteFill, style]}
        pointerEvents="box-none">
        <View style={{ flexDirection: 'row' }}>{this.renderDots()}</View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    padding: 4,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})
