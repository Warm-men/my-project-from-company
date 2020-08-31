/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'
import { inject, observer } from 'mobx-react'
@inject('currentCustomerStore')
@observer
export default class SizeAndStylesCard extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{this.props.title}</Text>
          <Text style={styles.englishTitleText}>{this.props.name}</Text>
        </View>
        <View style={styles.wrapView}>
          {this.props.param.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.categoryView}
                onPress={item.onPress}>
                {item.bubble ? (
                  <View style={styles.bubbleContainer}>
                    <View style={styles.bubble}>
                      <Text style={styles.bubbleText}>{item.bubble}</Text>
                    </View>
                    <View style={styles.triangleView} />
                  </View>
                ) : null}
                <Image source={item.image} />
                {!!item.badge && (
                  <Image
                    style={styles.badgeView}
                    resizeMode="cover"
                    source={require('../../../assets/images/account/badge.png')}
                  />
                )}
                <Text style={styles.categoryText}>{item.type}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: 7,
    backgroundColor: '#FFF'
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333'
  },
  englishTitleText: {
    marginLeft: 10,
    fontWeight: '400',
    fontSize: 10,
    color: '#666'
  },
  wrapView: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  categoryView: {
    paddingTop: 30,
    paddingBottom: 10,
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryText: {
    fontWeight: '400',
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    letterSpacing: 0.4,
    lineHeight: 16
  },
  badgeView: {
    position: 'relative',
    top: -p2d(33),
    left: p2d(14)
  },
  bubble: {
    shadowColor: 'rgba(232,92,64,0.33)',
    shadowOffset: { height: 6, width: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    backgroundColor: '#E85C40',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 69
  },
  bubbleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    top: 0
  },
  triangleView: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#E85C40'
  },
  bubbleText: { fontSize: 10, color: '#fff', lineHeight: 20 }
})
