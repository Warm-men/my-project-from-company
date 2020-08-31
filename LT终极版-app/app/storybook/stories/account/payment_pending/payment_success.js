/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, Animated, Easing, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
export default class PaymentSuccessView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      animatedValue: new Animated.Value(0),
      springValue: new Animated.Value(0)
    }

    this.sequenceAnimated = Animated.sequence([
      Animated.timing(this.state.animatedValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.in
      }),
      Animated.spring(this.state.springValue, {
        toValue: 1,
        friction: 6, //弹跳系数
        tension: 150 // 控制速度
      })
    ])
    this._startAnimated()
  }

  _startAnimated() {
    this.sequenceAnimated.start()
  }

  render() {
    const scaleX = this.state.animatedValue.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0, 0, 1]
    })

    return (
      <View style={this.props.style}>
        <Animated.View
          style={{
            backgroundColor: '#3CB750',
            transform: [{ scaleX: scaleX }],
            alignItems: 'center',
            width: '100%',
            height: 48,
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
          <Animated.View
            style={{
              transform: [{ scale: this.state.springValue }]
            }}>
            <Icon name={'md-checkmark'} size={22} color={'#ffffff'} />
          </Animated.View>
          <Text style={styles.text}> 支付成功</Text>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 15,
    justifyContent: 'center'
  }
})
