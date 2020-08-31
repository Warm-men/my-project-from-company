import React, { PureComponent } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Statistics from '../../../../src/expand/tool/statistics'

export default class ProductDetailFreeservice extends PureComponent {
  _onPress = () => {
    this.props.navigation.navigate('OpenFreeService')
    Statistics.onEvent({
      id: 'freeservice_product_size',
      label: '商品详情页点击开通自在选'
    })
  }
  render() {
    const { freeService, isAccessory } = this.props
    return !isAccessory &&
      freeService &&
      freeService.display_guide_in_product_page ? (
      <View style={styles.viewContainer}>
        <View style={styles.container}>
          <Text style={styles.descText}> 担心尺码选不准？多加2件 </Text>
          <TouchableOpacity style={styles.touchView} onPress={this._onPress}>
            <Text style={styles.touchText}>免费开通 ></Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={styles.line} />
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    paddingBottom: 20,
    borderBottomColor: '#F3F3F3',
    borderBottomWidth: 1,
    marginHorizontal: 16
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 41,
    backgroundColor: '#F7F7F7',
    borderRadius: 4
  },
  descText: {
    fontSize: 14,
    color: '#242424'
  },
  touchText: {
    paddingVertical: 6,
    color: '#fff',
    fontSize: 13
  },
  touchView: {
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: '#E85C40'
  },
  line: {
    height: 1,
    backgroundColor: '#F3F3F3',
    marginHorizontal: 16
  }
})
