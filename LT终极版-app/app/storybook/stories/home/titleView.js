/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'

class TitleView extends PureComponent {
  render() {
    const { title, subTitle } = this.props
    return (
      <View style={[styles.titleView, this.props.style]}>
        <View style={styles.title}>
          <View style={styles.line} />
          <Text style={styles.text}>{title}</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.imageView}>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
      </View>
    )
  }
}

class NonMemberCommonTitle extends PureComponent {
  render() {
    return (
      <View style={styles.activityTitleView}>
        <View style={styles.activityLine} />
        <Text style={styles.activityTitleText}>{this.props.title}</Text>
        <View style={styles.activityLine} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleView: {
    justifyContent: 'center',
    marginTop: 48,
    marginBottom: 22
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#000',
    fontSize: 16,
    fontWeight: '100',
    marginHorizontal: 10,
    letterSpacing: 1
  },
  line: {
    height: 1,
    width: 27,
    backgroundColor: '#eee'
  },
  imageView: {
    alignItems: 'center',
    marginTop: 8
  },
  activityTitleView: {
    marginVertical: p2d(24),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activityLine: {
    width: p2d(20),
    height: 1,
    backgroundColor: '#D8D8D8'
  },
  activityTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: p2d(12)
  },
  subTitle: {
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 5,
    color: '#999'
  }
})

export { TitleView, NonMemberCommonTitle }
