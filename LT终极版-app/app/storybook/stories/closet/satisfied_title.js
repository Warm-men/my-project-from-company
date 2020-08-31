import React, { PureComponent } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import ShadowView from 'react-native-shadow-view'
const category = [
  { type: 'all', content: '全部' },
  { type: 'clothing', content: '衣服' },
  { type: 'accessory', content: '配饰' }
]
export default class SatisfiedTitle extends PureComponent {
  _onPressAll = () => {
    this._push('all')
  }
  _onPressAccessory = () => {
    this._push('accessory')
  }
  _onPressClothing = () => {
    this._push('clothing')
  }

  _push = type => {
    const routeName = this.props.inCloset
      ? 'SatisfiedClosetController'
      : 'SwapSatisfiedClosetController'
    this.props.navigation.navigate(routeName, { type })
  }
  render() {
    const { perfectClosetStats } = this.props
    if (!(perfectClosetStats && perfectClosetStats.product_count > 0)) {
      return null
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}> 满分单品 </Text>
        <ShadowView style={styles.card}>
          <TouchableOpacity style={styles.category} onPress={this._onPressAll}>
            <Text style={styles.count}>{perfectClosetStats.product_count}</Text>
            <Text style={styles.categoryText}>全部</Text>
          </TouchableOpacity>
          <View style={styles.line} />

          <TouchableOpacity
            style={styles.category}
            onPress={this._onPressClothing}>
            <Text style={styles.count}>
              {perfectClosetStats.clothing_count}
            </Text>
            <Text style={styles.categoryText}>衣服</Text>
          </TouchableOpacity>
          <View style={styles.line} />

          <TouchableOpacity
            style={styles.category}
            onPress={this._onPressAccessory}>
            <Text style={styles.count}>
              {perfectClosetStats.accessory_count}
            </Text>
            <Text style={styles.categoryText}>配饰</Text>
          </TouchableOpacity>
        </ShadowView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: p2d(20),
    marginTop: p2d(20),
    marginBottom: p2d(23)
  },
  title: {
    color: '#242424',
    fontSize: 18,
    marginBottom: p2d(16),
    fontWeight: '500'
  },
  card: {
    width: p2d(335),
    height: p2d(74),
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: 'rgb(204,204,204)',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    backgroundColor: 'white',
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  categoryText: {
    color: '#989898',
    fontSize: 12,
    marginTop: 12
  },
  category: { flex: 1, alignItems: 'center' },
  line: {
    height: 20,
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#CCCCCC'
  },
  count: { color: '#000000', fontSize: 18, fontWeight: '500' }
})
