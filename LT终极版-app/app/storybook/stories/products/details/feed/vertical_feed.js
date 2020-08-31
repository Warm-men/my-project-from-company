/* @flow */

import React, { Component } from 'react'
import { Text, Animated, Image, StyleSheet } from 'react-native'

const animationConfig = {
  start: {
    toValue: 1,
    duration: 1000,
    delay: 500,
    useNativeDriver: true,
    isInteraction: false
  },
  hidden: {
    toValue: 2,
    delay: 1500,
    duration: 500,
    useNativeDriver: true,
    isInteraction: false
  }
}

const translateValue = { inputRange: [0, 1, 2], outputRange: [-200, 0, 0] }
const opacityValue = { inputRange: [0, 1, 2], outputRange: [1, 1, 0] }

export default class Feed extends Component {
  constructor(props) {
    super(props)
    this.state = { index: 0, showIcon: false }
    this.animatedValue = new Animated.Value(0)
  }

  componentDidMount() {
    this._startAnimated()
  }

  _startAnimated = () => {
    Animated.timing(this.animatedValue, animationConfig.start).start(
      this._hiddenAnimated
    )
  }
  _hiddenAnimated = () => {
    this.setState({ showIcon: true })
    Animated.timing(this.animatedValue, animationConfig.hidden).start(
      this._finishedAnimated
    )
  }

  _finishedAnimated = () => {
    const { data } = this.props
    let index = 0
    if (this.state.index !== data.length - 1) {
      index = this.state.index + 1
    }
    this.setState({ index, showIcon: false })
    this.animatedValue.setValue(0)
    this._startAnimated()
  }

  render() {
    const { data } = this.props
    const { title, icon_url, type } = data[this.state.index]
    return (
      <Animated.View
        style={[
          styles.container,
          type === 'perfect_stat' || type === 'perfect_action'
            ? { backgroundColor: '#FFBC56' }
            : { backgroundColor: '#F497A9' },
          {
            opacity: this.animatedValue.interpolate(opacityValue),
            transform: [
              { translateX: this.animatedValue.interpolate(translateValue) }
            ]
          }
        ]}>
        {type === 'perfect_action' || type === 'favorite_action' ? (
          <Image style={styles.headImage} source={{ uri: icon_url }} />
        ) : null}
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {this.state.showIcon ? (
          <Image
            style={styles.logo}
            source={
              type === 'perfect_stat' || type === 'perfect_action'
                ? require('./images/like_animation.gif')
                : require('./images/closet_animation.gif')
            }
          />
        ) : null}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop: 36,
    height: 24,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 0.8,
    marginLeft: 5
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
    color: '#fff',
    paddingHorizontal: 6
  },
  logo: {
    position: 'absolute',
    width: 40,
    height: 40,
    top: -40,
    right: -20
  }
})
