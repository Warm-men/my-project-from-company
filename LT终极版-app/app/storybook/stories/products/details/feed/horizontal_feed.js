/* @flow */

import React, { PureComponent } from 'react'
import {
  Text,
  Animated,
  Image,
  StyleSheet,
  Easing,
  Platform
} from 'react-native'

const config = {
  toValue: 1,
  duration: 3900,
  useNativeDriver: true,
  isInteraction: false,
  easing: Easing.linear
}

export default class Feed extends PureComponent {
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(-1)

    const { index } = this.props
    this.timer = setTimeout(() => {
      this._startAnimated()
    }, index * 1300)
  }

  componentWillUnmount() {
    this.timer = null
  }

  _startAnimated = () => {
    Animated.timing(this.animatedValue, config).start(this._finishedAnimated)
  }

  _finishedAnimated = () => {
    this.animatedValue.setValue(-1)

    const { onFinished, index } = this.props
    onFinished && onFinished(index)
    this._startAnimated()
  }

  render() {
    const { title, icon_url } = this.props.data

    return (
      <Animated.View
        style={[
          Platform.OS === 'ios' ? styles.container : styles.androidContainer,
          {
            opacity: this.animatedValue.interpolate({
              inputRange: [-1, 0, 0.5, 1],
              outputRange: [0, 1, 1, 0]
            }),
            transform: [
              {
                translateY: this.animatedValue.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [100, 50, 0]
                })
              }
            ]
          }
        ]}>
        <Image style={styles.headImage} source={{ uri: icon_url }} />
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 24,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#EBEAEA',
    backgroundColor: 'white',
    shadowColor: 'rgb(204,204,204)',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    marginLeft: 5
  },
  androidContainer: {
    position: 'absolute',
    height: 24,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#EBEAEA',
    backgroundColor: 'white',
    marginLeft: 5,
    borderWidth: StyleSheet.hairlineWidth
  },
  headImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: '#f3f3f3'
  },
  title: {
    fontSize: 12,
    color: '#5E5E5E',
    paddingHorizontal: 6,
    maxWidth: '90%'
  }
})
