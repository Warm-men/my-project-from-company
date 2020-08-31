/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Easing
} from 'react-native'

export default class Point extends PureComponent {
  constructor(props) {
    super(props)
    this._scale = new Animated.Value(1)
  }
  componentDidMount() {
    this._startAnimated()
  }

  _startAnimated = () => {
    const animationLoading = Animated.sequence([
      Animated.timing(this._scale, {
        toValue: 2,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false
      }),
      Animated.timing(this._scale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false
      })
    ])
    Animated.loop(animationLoading).start()
  }

  render() {
    const { onPress } = this.props
    return (
      <TouchableOpacity
        hitSlop={styles.hitSlop}
        style={styles.container}
        onPress={onPress}>
        <Animated.View
          style={[
            styles.radius,
            {
              transform: [{ scale: this._scale }]
            }
          ]}
        />
        <View style={styles.point} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hitSlop: { top: 20, bottom: 20, left: 20, right: 20 },
  radius: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 100,
    width: 8,
    height: 8
  },
  point: {
    backgroundColor: '#fff',
    borderRadius: 3,
    width: 6,
    height: 6,
    position: 'absolute'
  }
})
