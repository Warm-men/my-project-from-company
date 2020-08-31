/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
// eslink-disable-next-line
import AddToClosetButton from '../../../../src/containers/closet/add_to_closet_button'

export default class DetailsNonMemberBottomBar extends PureComponent {
  getReportData = () => {
    const { product, column } = this.props
    return { variables: { id: product.id }, column, router: 'Details' }
  }

  render() {
    const { product, joinMember, style } = this.props

    return (
      <View style={[styles.bottomBar, style]}>
        <AddToClosetButton
          getReportData={this.getReportData}
          product={product}
          inDetails={true}
          buttonStyle={styles.buttonStyle}
          animationStyle={styles.animationStyle}
          animationSource={require('../../../../assets/animation/like/like_pop_animation_red.json')}
          inClosetText={'已加入愿望衣橱'}
          outOfClosetText={'加入愿望衣橱'}
          buttonTextStyle={styles.buttonText}
        />
        <TouchableOpacity
          style={styles.addToClosetButton}
          onPress={joinMember}
          activeOpacity={0.85}>
          <Text style={styles.addToClosetText}>{'会员免费穿'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bottomBar: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFF'
  },
  buttonStyle: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    width: 114,
    borderRightColor: '#e6e6e6',
    borderRightWidth: StyleSheet.hairLineWidth
  },
  addToClosetButton: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 14,
    marginVertical: 8,
    height: 44,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  addToClosetText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  animationStyle: {
    width: 170,
    height: 170,
    position: 'relative',
    top: -8
  },
  buttonText: {
    position: 'absolute',
    bottom: 10,
    fontSize: 10,
    color: '#242424'
  },
  price: {
    fontSize: 14,
    color: '#FFF',
    textDecorationLine: 'line-through'
  }
})
