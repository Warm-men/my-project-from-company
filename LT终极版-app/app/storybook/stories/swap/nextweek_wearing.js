/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../image'

export default class NextWeekWearing extends PureComponent {
  _onPress = param => e => {
    // param is the argument you passed to the function
    // e is the event object that returned
    const { onPressItem } = this.props
    onPressItem(param)
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.nextWeek}>下周穿什么</Text>
        <View style={styles.imageContainer}>
          {this.props.data.map((item, index) => {
            return (
              <TouchableOpacity key={item.id} onPress={this._onPress(item)}>
                <Image
                  style={styles.image}
                  source={{ uri: this.props.data[index].sign }}
                />
                <View style={styles.textContainer}>
                  <View style={styles.viewTag}>
                    <Text style={styles.text}>
                      {this.props.data[index].name}
                    </Text>
                    <View style={styles.view} />
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
        <Text style={styles.recommended}>搭配师推荐</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 32
  },
  imageContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  recommended: {
    color: '#242424',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 40,
    marginBottom: 16
  },
  nextWeek: {
    color: '#242424',
    fontSize: 15,
    fontWeight: '500'
  },
  image: { width: 107, height: 161, marginTop: 16 },
  textContainer: {
    position: 'absolute',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    top: 0,
    width: 107,
    height: 161,
    marginTop: 16
  },
  text: {
    fontSize: 12,
    color: '#FFFFFF'
  },
  viewTag: {
    flexDirection: 'row',
    marginTop: 126,
    backgroundColor: '#C8A052',
    height: 20,
    width: 54,
    justifyContent: 'space-around',
    paddingRight: 6,
    paddingLeft: 8,
    alignItems: 'center'
  },
  view: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 6,
    borderTopColor: 'transparent',
    borderLeftColor: 'white',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent'
  }
})
