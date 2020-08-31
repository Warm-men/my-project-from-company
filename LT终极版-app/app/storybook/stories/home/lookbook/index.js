/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { TitleView } from '../titleView'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import MoreView from '../moreView'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'
export default class HomeLookBook extends PureComponent {
  pushToDetail = id => {
    this.props.navigation.navigate('LookBooks', { id })
  }
  _moreLookbook = () => {
    const { navigation } = this.props
    navigation.navigate('LookbookThemes')
  }
  render() {
    return (
      <View style={styles.container}>
        <TitleView title={'主题穿搭'} subTitle={'LOOKBOOK'} />
        {this.props.data.map((item, index) => {
          return (
            <Theme
              key={index}
              index={index}
              pushToDetail={this.pushToDetail}
              item={item}
            />
          )
        })}
        <TouchableOpacity
          delayPressIn={100}
          activeOpacity={0.6}
          style={styles.moreView}
          onPress={this._moreLookbook}>
          <MoreView />
        </TouchableOpacity>
      </View>
    )
  }
}

class Theme extends PureComponent {
  _pushToDetail = () => {
    const { pushToDetail, item } = this.props
    pushToDetail && pushToDetail(item.id)
  }
  render() {
    const { item, index } = this.props
    return (
      <TouchableOpacity
        style={index ? { marginTop: 20 } : {}}
        onPress={this._pushToDetail}
        delayPressIn={100}
        activeOpacity={0.6}>
        <Image
          description={Column.Lookbook + '-' + item.name}
          style={styles.image}
          source={{ uri: item.image_url || '' }}
          qWidth={p2d(1050)}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    height: p2d(375),
    width: p2d(375)
  },
  moreView: {
    paddingTop: 24,
    alignItems: 'center'
  }
})
