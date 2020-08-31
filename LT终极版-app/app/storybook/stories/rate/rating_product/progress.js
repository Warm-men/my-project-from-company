/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class ProgressContainer extends PureComponent {
  render() {
    const { currentCount, count, ids } = this.props
    const number = count - ids.length + currentCount + 1

    return (
      <View style={styles.container}>
        <View style={styles.progressView}>
          <View
            style={[
              styles.progressValue,
              { width: (number / count) * 100 + '%' }
            ]}
          />
        </View>
        <Text style={styles.content}>
          {number}/{count}
        </Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  progressView: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#f3f3f3',
    flex: 1,
    marginRight: 20
  },
  progressValue: {
    position: 'absolute',
    top: 0,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F3BF78'
  },
  content: { color: '#989898', fontSize: 12 }
})
