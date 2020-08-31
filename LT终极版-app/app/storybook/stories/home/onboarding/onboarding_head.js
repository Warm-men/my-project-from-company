/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'

export default class OnboardingHead extends PureComponent {
  // 通过 state 更新
  render() {
    const { data, questionKeys, pages } = this.props
    return (
      <View style={styles.headingView}>
        <View style={styles.pageNum}>
          <Text style={styles.pageNumLeft}>
            STEP <Text>{data.false}</Text>{' '}
          </Text>
          <Text
            style={[
              styles.pageNumRight,
              { height: p2d(17), marginTop: p2d(4) }
            ]}>
            / <Text>{questionKeys.length}</Text>{' '}
          </Text>
        </View>
        <Text style={styles.mainTitle}>{data.title}</Text>
        <Text
          style={[
            styles.pageNumRight,
            { letterSpacing: 0.4, width: p2d(289), lineHeight: p2d(20) }
          ]}>
          {pages.page_title}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headingView: {
    marginTop: 33,
    marginLeft: 40
  },
  pageNum: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pageNumLeft: {
    fontSize: 14,
    color: '#333',
    height: p2d(17)
  },
  pageNumRight: {
    fontSize: 12,
    color: '#999'
  },
  mainTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
    marginVertical: 8
  }
})
