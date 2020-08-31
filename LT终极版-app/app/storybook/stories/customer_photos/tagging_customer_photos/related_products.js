/* @flow */

import React, { PureComponent, Component } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native'
import Image from '../../image'
import Icon from 'react-native-vector-icons/Ionicons'

export default class RelatedProducts extends Component {
  _didSelectedItem = product => {
    const { didSelectedItem } = this.props
    didSelectedItem && didSelectedItem(product)
  }

  _renderItem = ({ item, index }) => {
    const { lockProduct } = this.props
    const isLocked = lockProduct && lockProduct.id === item.product.id
    return (
      <Item
        item={item}
        index={index}
        isLocked={isLocked}
        didSelectedItem={this._didSelectedItem}
      />
    )
  }

  _getRelatedProductsStatus = () => {
    const { data, currentPhoto } = this.props
    const array = []

    data.forEach((product, index) => {
      let isSelected = false
      if (currentPhoto.stickers) {
        isSelected = !!currentPhoto.stickers.find(i => {
          return i.product.id === product.id
        })
      }

      const object = { isSelected, product }
      array.push(object)
    })
    return array
  }

  _listEmptyComponent = () => {
    return (
      <View style={styles.emptyButton}>
        <Text style={styles.emptyTitle}>当前无可关联单品，赶快添加单品吧</Text>
      </View>
    )
  }

  render() {
    const { isStylist, appendProduct } = this.props
    const array = this._getRelatedProductsStatus()
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{'标记照片中搭配的单品'}</Text>
          {isStylist && (
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.addButton}
              onPress={appendProduct}>
              <Text style={styles.appendTitle}>{'添加单品 '}</Text>
              <Icon name={'ios-arrow-forward'} size={14} color={'#E85C40'} />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={this._listEmptyComponent}
          data={array}
          renderItem={this._renderItem}
        />
      </View>
    )
  }
}

class Item extends PureComponent {
  _didSelectedItem = () => {
    const { item, didSelectedItem, index, isLocked } = this.props
    !isLocked && didSelectedItem && didSelectedItem(item.product, index)
  }
  render() {
    const { item, isLocked } = this.props
    const { isSelected, product } = item
    const { catalogue_photos } = product

    const url = isSelected
      ? require('../../../../assets/images/me_style/focus_button.png')
      : require('../../../../assets/images/me_style/blur_button.png')

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && { borderColor: '#E85C40' }]}
        onPress={this._didSelectedItem}>
        <Image
          style={styles.image}
          source={{ uri: catalogue_photos && catalogue_photos[0].medium_url }}
        />
        {isSelected ? <View style={styles.selectedView} /> : null}
        {!isLocked ? <Image style={styles.circleButton} source={url} /> : null}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: { paddingLeft: 15, marginBottom: 7 },
  title: { fontWeight: '500', fontSize: 14, color: '#333', marginVertical: 14 },
  item: { borderWidth: 1, borderColor: '#f3f3f3', marginRight: 8 },
  image: { width: 60, height: 90 },
  selectedView: {
    position: 'absolute',
    width: 60,
    height: 90,
    backgroundColor: '#E85C40',
    opacity: 0.1
  },
  circleButton: { position: 'absolute', right: 0, width: 15, height: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  appendTitle: { color: '#E85C40', fontSize: 12 },
  emptyButton: {
    backgroundColor: '#f7f7f7',
    width: Dimensions.get('window').width - 30
  },
  emptyTitle: {
    color: '#ccc',
    letterSpacing: 0.4,
    textAlign: 'center',
    lineHeight: 90
  }
})
