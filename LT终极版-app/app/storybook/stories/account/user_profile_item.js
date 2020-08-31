/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import ImageView from '../image'
import Icons from 'react-native-vector-icons/Ionicons'
export default class UserProfileItem extends PureComponent {
  render() {
    const {
      leftStr,
      source,
      rightStr,
      titleStyle,
      rightStrWithoutImage,
      style,
      onPress,
      valueIsImage,
      disabled
    } = this.props
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={style ? style : styles.viewContainer}>
          <Text style={[styles.content, titleStyle]}>{leftStr}</Text>
          {!rightStrWithoutImage ? (
            <View style={styles.subViewContainer}>
              {valueIsImage ? (
                <ImageView
                  style={styles.avatarView}
                  source={
                    source
                      ? { uri: source }
                      : require('../../../assets/images/account/customer_avatar.png')
                  }
                  circle={true}
                />
              ) : (
                <View style={styles.subViewContainer}>
                  <Text style={[styles.mRight, styles.content]}>
                    {rightStr}
                  </Text>
                  <Icons name="ios-arrow-forward" size={20} color="#d7d7d7" />
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.contentRight}>{rightStrWithoutImage}</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    fontSize: 13,
    color: '#666666'
  },
  contentRight: {
    fontSize: 13,
    color: '#D7D7D7'
  },
  viewContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60
  },
  subViewContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mRight: {
    marginRight: 8
  },
  avatarView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
