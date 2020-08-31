import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default class SimilarProducts extends PureComponent {
  render() {
    const { data } = this.props
    const isShowView = data && data.length
    return isShowView ? (
      <View style={styles.container}>
        <View style={styles.detailTitle}>
          <Text style={styles.detailsSubTitle}>{'相似单品'}</Text>
        </View>
      </View>
    ) : null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  detailTitle: {
    paddingLeft: 15,
    marginTop: 32,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailsSubTitle: { fontWeight: '600', color: '#242424', fontSize: 18 }
})
