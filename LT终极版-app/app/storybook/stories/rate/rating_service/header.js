/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class Header extends PureComponent {
  render() {
    const { hasRating, alreadyReturn } = this.props
    return alreadyReturn ? (
      <View style={styles.container}>
        {!hasRating && <Text style={styles.header}>你本次衣箱暂无反馈</Text>}
        {hasRating && (
          <Text style={styles.header}>我们会尽快核查你所投诉的商品问题</Text>
        )}
      </View>
    ) : (
      <View style={styles.container}>
        <Text style={styles.header}>请选择要投诉的商品</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { marginTop: 40, alignItems: 'center', marginBottom: 24 },
  header: { fontSize: 16, color: '#333', fontWeight: '700' }
})
