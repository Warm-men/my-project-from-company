/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import Feeds from './feeds'

export default class ProductFeeds extends PureComponent {
  render() {
    const { feeds } = this.props
    return (
      <View style={styles.container} pointerEvents={'none'}>
        {feeds && feeds.items && feeds.items.length ? (
          <Feeds data={feeds.items} />
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    left: 5,
    width: '50%',
    height: 160
  }
})
