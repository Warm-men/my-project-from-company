/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import Statistics from '../../expand/tool/statistics'
import { inject } from 'mobx-react'
@inject('currentCustomerStore')
export default class SwapTabBar extends Component {
  constructor(props) {
    super(props)
    const { name } = props
    this.items = []
    this.navigationBarTitle = '帮我推荐'
    switch (name) {
      case 'onboarding':
        this.items = ['精选', '愿望衣橱']
        this.navigationBarTitle = '换装'
        break
      case 'closet':
        this.items = ['愿望衣橱']
        this.navigationBarTitle = '愿望衣橱'
        break
      case 'occasion':
        const { subscription } = props.currentCustomerStore
        const { occasion_display } = subscription.subscription_type
        this.items = [occasion_display, '精选']
        break
      case 'satisfied':
        this.items = ['满分单品']
        this.navigationBarTitle = '满分单品'
        break
      default:
        this.items = ['精选']
        break
    }
  }
  _didSelectedIndex = index => {
    const { jumpTo, navigationState } = this.props
    let key = navigationState.routes[index].key
    if (navigationState.index !== index) {
      jumpTo(key)
    }
  }
  _goBack = () => {
    this.props.navigation.pop(1)
  }

  componentDidMount() {
    this.time = new Date()
  }
  componentWillUnmount() {
    const currentTime = new Date() - this.time

    Statistics.onEventDuration({
      id: 'swap_in',
      label: '换衣页面停留的时长',
      durationTime: currentTime > 0 ? currentTime : 0
    })
  }

  render() {
    const { navigationState } = this.props
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          style={styles.navigationbar}
          title={this.navigationBarTitle}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.tabBarView}>
          {this.items.length > 1 &&
            this.items.map((item, index) => {
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
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  tabBarView: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f6f6f6',
    paddingLeft: 22,
    paddingRight: 22,
    justifyContent: 'space-around'
  },
  navigationbar: {
    borderBottomWidth: 0
  },
  tabbarItem: {
    paddingTop: 5,
    paddingBottom: 8,
    marginBottom: 1
  },
  tabbarItemSelected: {
    borderBottomWidth: 2,
    borderBottomColor: '#EA5C39'
  },
  title: {
    fontWeight: '500',
    fontSize: 13
  },
  selectedTitle: {
    color: '#EA5C39'
  },
  normalTitle: {
    color: '#999'
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
        style={[
          styles.tabbarItem,
          navigationState.index === index && styles.tabbarItemSelected
        ]}
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
      </TouchableOpacity>
    )
  }
}
