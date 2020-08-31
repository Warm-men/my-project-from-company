/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'

export default class PagingIndicator extends PureComponent {
  render() {
    const {
      count,
      currentIndex,
      customNormalStyle,
      customSelectedStyle
    } = this.props
    return (
      <View style={styles.container}>
        {Array.from({ length: count }).map((item, index) => {
          const isFocus = currentIndex === index
          return (
            <View
              key={index}
              style={
                customNormalStyle && customSelectedStyle
                  ? [isFocus ? customSelectedStyle : customNormalStyle]
                  : [styles.normal, isFocus && styles.onFocus]
              }
            />
          )
        })}
      </View>
    )
  }
}

PagingIndicator.defaultProps = {
  count: 0,
  currentIndex: 0
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  normal: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.2,
    margin: 5,
    backgroundColor: 'black'
  },
  onFocus: {
    opacity: 0.6
  }
})
