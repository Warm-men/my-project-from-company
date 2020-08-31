/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default class PartsView extends PureComponent {
  render() {
    const { parts, partViewStyle, block } = this.props
    if (parts && !!parts.length) {
      if (block) {
        return (
          <View style={styles.blockPartsView}>
            <View>
              {parts.map((item, key) => {
                return (
                  <PartView
                    item={item}
                    key={key}
                    partViewStyle={partViewStyle}
                  />
                )
              })}
            </View>
          </View>
        )
      } else {
        return (
          <View style={styles.partsView}>
            {parts.map((item, key) => {
              return (
                <PartView item={item} key={key} partViewStyle={partViewStyle} />
              )
            })}
          </View>
        )
      }
    } else {
      return null
    }
  }
}

class PartView extends PureComponent {
  render() {
    const { item, partViewStyle } = this.props
    return (
      <View style={partViewStyle}>
        <Text style={styles.partTitle}>含{item.title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  partsView: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  blockPartsView: {
    flex: 1,
    flexDirection: 'row'
  },
  partTitle: {
    fontSize: 12,
    color: '#666'
  }
})
