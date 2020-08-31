/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import LookbookProducts from './lookbook_products'
import p2d from '../../../src/expand/tool/p2d'
export default class LookItem extends PureComponent {
  openLookBookDetail = () => {
    const { didSelectedItem, data, index } = this.props
    didSelectedItem && didSelectedItem(data, index)
  }
  render() {
    const { index, data, navigation } = this.props
    return (
      <View>
        <LookIndex index={index} />
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={0.6}
            delayPressIn={100}
            style={styles.view}
            onPress={this.openLookBookDetail}>
            <LookbookProducts
              navigation={navigation}
              data={data}
              useLookMainPhoto
              mainProduct={styles.mainProduct}
              hideCloset={this.props.hideCloset}
            />
            <TouchableOpacity
              style={styles.touchView}
              onPress={this.openLookBookDetail}>
              <Text style={styles.button}>查看LOOK</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

class LookIndex extends PureComponent {
  render() {
    const { index } = this.props
    return (
      <View style={styles.imageContainer}>
        <Text style={styles.text}>{`LOOK${index + 1}`}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  view: {
    marginTop: 49,
    height: p2d(466),
    width: p2d(345),
    borderColor: '#C8C8C8',
    borderWidth: 1,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 26
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    position: 'absolute',
    left: 39,
    top: 35,
    width: 100,
    backgroundColor: 'white'
  },
  touchView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 33,
    width: 124,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#999',
    marginBottom: 20
  },
  button: {
    fontSize: 12,
    color: '#333333'
  },
  mainProduct: {
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(180),
    height: p2d(317),
    marginTop: 20,
    marginBottom: 15
  }
})
