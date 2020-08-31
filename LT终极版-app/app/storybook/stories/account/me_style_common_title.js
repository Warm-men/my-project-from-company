import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'

export default class MeStyleCommonTitle extends PureComponent {
  render() {
    return (
      <View style={[styles.titleView, this.props.style]}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>{this.props.titleText}</Text>
          {this.props.showStep && (
            <Text style={styles.stepText}>{this.props.step}</Text>
          )}
        </View>
        {this.props.showStep && (
          <Text style={styles.descriptText}>{this.props.descriptText}</Text>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleView: {
    marginTop: p2d(16)
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  titleText: {
    color: '#333333',
    fontSize: 20,
    fontWeight: '600'
  },
  descriptText: {
    color: '#999',
    fontSize: 14,
    marginTop: 12,
    lineHeight: 24
  },
  stepText: {
    color: '#666',
    fontSize: 14
  }
})
