/* @flow */

import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  AppState,
  Platform,
  Image
} from 'react-native'
import Video from 'react-native-video'
import p2d from '../../../src/expand/tool/p2d'
export default class NoClosetProduct extends Component {
  constructor(props) {
    super(props)
    this.listeners = []
    this.state = { showVideo: false }
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.setState({ showVideo: true })
    } else {
      this.setState({ showVideo: false })
    }
  }

  componentDidMount() {
    this.setState({ showVideo: true })
    AppState.addEventListener('change', this._handleAppStateChange)
    this.listeners.push(
      this.props.navigation.addListener('willFocus', () => {
        this.setState({ showVideo: true })
      })
    )
    this.listeners.push(
      this.props.navigation.addListener('didFocus', () => {
        //play video
      })
    )
    this.listeners.push(
      this.props.navigation.addListener('willBlur', () => {
        //stop video
      })
    )
    this.listeners.push(
      this.props.navigation.addListener('didBlur', () => {
        //render view，unload video tag
        this.setState({ showVideo: false })
      })
    )
  }

  componentWillUnmount() {
    this.listeners.map(item => {
      item.remove()
    })
    AppState.removeEventListener('change', this._handleAppStateChange)
  }
  _indexToProducts = () => {
    this.props.navigation.navigate('Products')
  }
  render() {
    const { inSwap, showTitle } = this.props
    return (
      <View style={[styles.container, inSwap && styles.inSwapView]}>
        {showTitle ? <Text style={styles.title}>收藏单品</Text> : null}
        {this.state.showVideo ? (
          <Image
            source={require('../../../assets/images/closet/onboarding.gif')}
            resizeMode="contain"
            style={showTitle ? styles.small : styles.normal}
          />
        ) : (
          <View style={{ height: 200 }} />
        )}
        {inSwap ? (
          <Text style={styles.noClosetProductText}>
            心仪的服饰可收藏至愿望衣橱
          </Text>
        ) : (
          <View
            style={[
              styles.centerView,
              showTitle ? { marginTop: 15 } : { marginTop: 50 }
            ]}>
            <Text style={styles.textTitle}>你还没收藏单品</Text>
            <View style={styles.line} />
            <Text style={styles.text}>
              {'喜爱的款式，收藏为「愿望」 \n 你的喜好至关重要'}
            </Text>
            <TouchableOpacity
              style={[
                styles.button,
                showTitle ? { marginTop: 25 } : { marginTop: 50 }
              ]}
              onPress={this._indexToProducts}>
              <Text>去逛逛</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40
  },
  centerView: {
    alignItems: 'center'
  },
  line: {
    margin: 10,
    height: 1,
    width: 200,
    backgroundColor: '#EA5C39'
  },
  button: {
    marginTop: 50,
    height: 40,
    width: 164,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 2
  },
  textTitle: {
    fontSize: 16,
    color: '#333'
  },
  text: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24
  },
  noClosetProductText: {
    marginTop: 32,
    fontSize: 14,
    color: '#666'
  },
  inSwapView: {
    paddingTop: p2d(100)
  },
  title: {
    position: 'absolute',
    top: 0,
    left: 20,
    color: '#242424',
    fontSize: 18,
    fontWeight: '500'
  },
  normal: {
    width: p2d(375),
    height: p2d(200),
    marginTop: 30
  },
  small: {
    width: p2d(300),
    height: p2d(150),
    marginTop: 10
  }
})
