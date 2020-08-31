/* @flow weak */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Platform, Dimensions, Text } from 'react-native'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'

export default class Footer extends PureComponent {
  render() {
    const { message, isMore, filtersRefresh, style } = this.props
    return isMore && !filtersRefresh ? (
      <View style={[styles.loadingView, style]}>
        <Spinner isVisible={true} size={30} type={'Pulse'} color={'#222'} />
      </View>
    ) : (
      <View style={[styles.container, style]}>
        <Text
          style={[
            styles.wisdom,
            {
              ...Platform.select({
                ios: {
                  fontFamily: 'TimesNewRomanPS-BoldItalicMT'
                },
                android: {
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                  fontWeight: '500'
                }
              })
            }
          ]}>
          {message.wisdom}
        </Text>
        <View style={styles.wisdomNameView}>
          <View style={styles.line} />
          <Text
            style={[
              styles.wisdomName,
              {
                ...Platform.select({
                  ios: {
                    fontFamily: 'TimesNewRomanPSMT'
                  },
                  android: { fontFamily: 'serif' }
                })
              }
            ]}>
            {message.name}
          </Text>
          <View style={styles.line} />
        </View>
      </View>
    )
  }
}
const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 27,
    marginBottom: 31,
    justifyContent: 'center'
  },
  wisdom: {
    textAlign: 'center',
    color: '#D7D7D7',
    fontSize: width <= 320 ? 10 : 12,
    letterSpacing: 0,
    lineHeight: 20
  },
  wisdomNameView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3
  },
  line: {
    height: 1,
    width: 30,
    backgroundColor: '#D7D7D7'
  },
  wisdomName: {
    fontSize: width <= 320 ? 10 : 12,
    color: '#D7D7D7',
    marginHorizontal: 3
  },
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
})
