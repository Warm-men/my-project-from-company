/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'

export default class ProductEnsemble extends PureComponent {
  _onClick = () => {
    const { navigation, ensemble } = this.props
    const collection = { id: ensemble.browse_collection_id }

    navigation.navigate('Collection', { collection, type: 'collection' })
  }

  render() {
    const { ensemble } = this.props
    if (!ensemble) return null
    const { active_products_count } = ensemble
    return (
      <TouchableOpacity style={styles.container} onPress={this._onClick}>
        <View style={styles.top}>
          <Text style={styles.value}>{active_products_count}件饰品</Text>
          <Icon name="arrow-right" size={8} color="#fff" />
        </View>
        <View style={styles.bottom}>
          <Text style={styles.description}>非常搭</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 24, right: 0 },
  top: {
    height: 22,
    width: 75,
    backgroundColor: '#242424',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  value: { fontSize: 12, color: '#fff', marginRight: 3 },

  bottom: {
    height: 22,
    width: 75,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: '#242424'
  },
  description: { fontSize: 12, color: '#242424' }
})
