/* @flow */

import React, { PureComponent } from 'react'
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import Image from '../image'
export default class LookProductCards extends PureComponent {
  didSelected = index => {
    this.props.setIndexOfCard(index, this.props.index)
  }
  render() {
    const { currentIndex, style, data } = this.props
    return (
      <ScrollView
        style={style || styles.container}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {data.map((item, index) => {
          const isSelected = currentIndex === index
          return (
            <ProductItem
              key={index}
              item={item}
              index={index}
              didSelected={this.didSelected}
              isSelected={isSelected}
            />
          )
        })}
      </ScrollView>
    )
  }
}

class ProductItem extends PureComponent {
  _didSelected = () => {
    const { index, didSelected } = this.props
    didSelected && didSelected(index)
  }
  render() {
    const { isSelected, item } = this.props
    return (
      <TouchableOpacity style={styles.touchView} onPress={this._didSelected}>
        {!isSelected ? (
          <Image
            style={styles.cardBackGround}
            source={require('../../../assets/images/lookbook/look_unselect.png')}
          />
        ) : (
          <Image
            style={styles.cardBackGround}
            source={require('../../../assets/images/lookbook/look_selected.png')}
          />
        )}
        <Image
          resizeMode="contain"
          qWidth={240}
          style={styles.image}
          source={{ uri: item.look_photo ? item.look_photo.url : '' }}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  cardBackGround: {
    height: 80,
    width: 80,
    top: 3,
    position: 'absolute'
  },
  image: {
    height: 45,
    width: 45
  },
  touchView: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
