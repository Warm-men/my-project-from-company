import React, { PureComponent } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import Icon from 'react-native-vector-icons/Entypo'
const category = [
  { type: 'all', content: '全部' },
  { type: 'clothing', content: '衣服' },
  { type: 'accessory', content: '配饰' }
]
export default class CommonlyFilter extends PureComponent {
  render() {
    const { selectedType, resetFilter, openFilterView, swap } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.leftGroup}>
          {category.map((item, index) => {
            if (swap && index === 0) {
              return null
            }
            return (
              <Category
                key={index}
                item={item}
                isSelected={item.type === selectedType}
                resetFilter={resetFilter}
              />
            )
          })}
        </View>
        <View style={swap ? styles.swapLine : styles.verticalLine} />
        <TouchableOpacity style={styles.moreContainer} onPress={openFilterView}>
          <Text style={styles.more}>更多筛选</Text>
          <Icon name={'chevron-small-right'} size={21} color="#979797" />
        </TouchableOpacity>
      </View>
    )
  }
}

class Category extends PureComponent {
  onPress = () => {
    const { item, resetFilter } = this.props
    resetFilter(item.type)
  }
  render() {
    const { item, isSelected } = this.props
    return (
      <TouchableOpacity style={styles.category} onPress={this.onPress}>
        <Text
          style={
            isSelected ? styles.categorySelectedText : styles.categoryText
          }>
          {item.content}
        </Text>
        {isSelected && <View style={styles.line} />}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: p2d(40),
    marginBottom: 9
  },
  leftGroup: { width: '66.6%', flexDirection: 'row' },
  verticalLine: {
    position: 'absolute',
    height: p2d(14),
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#CCCCCC',
    right: p2d(124)
  },
  swapLine: {
    position: 'absolute',
    height: p2d(14),
    width: StyleSheet.hairlineWidth,
    left: p2d(211),
    backgroundColor: '#CCCCCC'
  },
  moreContainer: {
    width: '33.3%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  more: {
    color: '#989898',
    fontSize: 14
  },
  category: {
    width: '33.3%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  line: {
    backgroundColor: '#E85C40',
    width: p2d(28),
    height: 2,
    position: 'absolute',
    bottom: 5,
    borderRadius: 1
  },

  categorySelectedText: {
    color: '#E85C40',
    fontSize: 14
  },
  categoryText: {
    color: '#989898',
    fontSize: 14
  }
})
