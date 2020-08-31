import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../image'
export default class ProductHeaderOccasion extends Component {
  didSelectedProductItem = data => {
    const { didSelectedOccasion, inAccessory } = this.props
    didSelectedOccasion && didSelectedOccasion(data, inAccessory)
  }

  render() {
    const { data, inAccessory } = this.props
    return (
      <View>
        <View style={styles.container}>
          {data.map((item, index) => {
            return (
              <Item
                inAccessory={inAccessory}
                key={index}
                didSelectedItem={this.didSelectedProductItem}
                data={item}
              />
            )
          })}
        </View>
        <View style={styles.lineView} />
      </View>
    )
  }
}

export class Item extends Component {
  _onPress = () => {
    this.props.didSelectedItem(this.props.data)
  }

  render() {
    const { data, inAccessory } = this.props
    const logo = inAccessory ? data.filter_accessory_logo : data.filter_logo
    return (
      <TouchableOpacity onPress={this._onPress} style={styles.itemView}>
        <Image
          resizeMode="cover"
          style={styles.itemImage}
          source={{ uri: logo }}
        />
        <Text style={styles.itemText}>{data.name}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24
  },
  itemView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemImage: {
    height: 54,
    width: 54,
    borderRadius: 27,
    marginBottom: 6
  },
  itemText: {
    color: '#5E5E5E',
    fontSize: 12
  },
  lineView: {
    backgroundColor: '#FAFAFA',
    height: 8,
    flex: 1
  }
})
