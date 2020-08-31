/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'

export default class PeopleWearing extends PureComponent {
  _onPress = param => e => {
    // param is the argument you passed to the function
    // e is the event object that returned
    const { onPressItem } = this.props
    onPressItem(param)
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.peopleWearing}>她们都在穿</Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={this._onPress(this.props.data[0])}>
            <Image
              style={styles.city}
              source={{ uri: this.props.data[0].sign }}
            />
            <View style={styles.cityTextContainer}>
              <Text style={styles.text}>{this.props.data[0].name}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {this.props.data.map((item, index) => {
              if (index === 0) return null
              return (
                <TouchableOpacity key={item.id} onPress={this._onPress(item)}>
                  <Image
                    style={styles.image}
                    source={{ uri: this.props.data[index].sign }}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.text}>
                      {this.props.data[index].name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 18
  },
  imageContainer: {
    marginHorizontal: p2d(5),
    marginTop: p2d(6),
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  city: {
    marginTop: p2d(10),
    height: p2d(88),
    width: p2d(108)
  },
  row: {
    flexDirection: 'row'
  },
  image: {
    margin: p2d(4),
    height: p2d(40),
    width: p2d(109)
  },
  peopleWearing: {
    color: '#242424',
    fontSize: 15,
    fontWeight: '500'
  },
  text: { fontSize: 14, color: '#FFFFFF', marginLeft: 8 },
  button: { justifyContent: 'center', alignItems: 'center' },
  textContainer: {
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    margin: p2d(4),
    height: p2d(40),
    width: p2d(109)
  },
  cityTextContainer: {
    marginTop: 24,
    position: 'absolute',
    left: 0,
    top: 0,
    height: p2d(88),
    width: p2d(108)
  }
})
