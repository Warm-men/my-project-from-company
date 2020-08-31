/* @flow */

import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native'
import { SafeAreaView } from '../../../storybook/stories/navigationbar'
import ShoppingCarIcon from '../../../storybook/stories/tote_cart/shopping_car_icon'
import p2d from '../../expand/tool/p2d'
import { inject } from 'mobx-react'
@inject('copyWritingStore')
export default class ProductsTopBar extends Component {
  constructor(props) {
    super(props)
    this.items = ['衣服', '配饰', '品牌']
  }
  _didSelectedIndex = index => {
    const { jumpTo, navigationState } = this.props
    let key = navigationState.routes[index].key
    if (navigationState.index !== index) {
      jumpTo(key)
    }
  }
  _search = () => {
    this.props.navigation.navigate('SearchInput')
  }
  render() {
    const { navigationState, navigation, copyWritingStore } = this.props
    return (
      <SafeAreaView style={styles.container}>
        {this.items.map((item, index) => {
          return (
            <TabbarItem
              navigationState={navigationState}
              title={item}
              key={item}
              index={index}
              didSelectedIndex={this._didSelectedIndex}
            />
          )
        })}
        <View style={styles.barButtonItemStyle}>
          <ShoppingCarIcon navigation={navigation} />
        </View>

        {copyWritingStore.searching_feature ? (
          <TouchableOpacity
            style={styles.leftBarButtonItemStyle}
            onPress={this._search}>
            <Image
              source={require('../../../assets/images/search/search.png')}
            />
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2'
  },
  tabbarItem: {
    marginRight: 25,
    marginLeft: 25,
    paddingTop: 15,
    paddingBottom: 8,
    marginBottom: 1
  },
  tabbarItemSelected: {
    position: 'absolute',
    bottom: 0,
    width: p2d(28),
    height: 2,
    backgroundColor: '#EA5C39',
    borderRadius: 1
  },
  title: {
    fontSize: 14
  },
  selectedTitle: {
    color: '#EA5C39'
  },
  normalTitle: {
    color: '#999'
  },
  barButtonItemStyle: {
    minHeight: 35,
    minWidth: 35,
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    position: 'absolute',
    right: 0,
    bottom: 1
  },
  leftBarButtonItemStyle: {
    minHeight: 35,
    minWidth: 35,
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    position: 'absolute',
    left: 0,
    bottom: 1
  }
})

class TabbarItem extends Component {
  _didSelectedIndex = () => {
    const { didSelectedIndex, index } = this.props
    didSelectedIndex(index)
  }
  render() {
    const { navigationState, title, index } = this.props

    return (
      <TouchableOpacity
        style={styles.tabbarItem}
        onPress={this._didSelectedIndex}>
        <Text
          style={[
            styles.title,
            navigationState.index === index
              ? styles.selectedTitle
              : styles.normalTitle
          ]}>
          {title}
        </Text>
        {navigationState.index === index && (
          <View style={styles.tabbarItemSelected} />
        )}
      </TouchableOpacity>
    )
  }
}
