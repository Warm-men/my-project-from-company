/* @flow */

import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'

class CountDownButton extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { buttonText: this.props.text, isCountDownEnd: true }
  }

  _countDown = () => {
    let time = this.props.time
    this.setState({ isCountDownEnd: false })
    this.timer && clearInterval(this.timer)
    this._onTimeChange(time)
    this.timer = setInterval(() => {
      if (time > 0) {
        time--
        this._onTimeChange(time)
      } else {
        this.timer && clearInterval(this.timer)
        this.timer = null
        this.setState({ isCountDownEnd: true })
      }
    }, 1000)
  }

  _onTimeChange(time) {
    const { onChange } = this.props
    if (onChange) {
      var newText = onChange(time)
      if (newText !== this.state.buttonText) {
        if (!newText) {
          this.setState({ isCountDownEnd: true })
          newText = this.props.text
        }
        this.setState({ buttonText: newText })
      }
    }
  }

  _onPress = () => {
    const { onPress, disabled } = this.props
    if (disabled || !onPress || this.timer) return
    onPress() && this._countDown()
  }
  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }
  render() {
    const { disabled } = this.props
    return (
      <TouchableOpacity
        style={[
          styles.countdownButton,
          {
            backgroundColor:
              !disabled && this.state.isCountDownEnd ? '#333' : '#F0F0F0'
          }
        ]}
        activeOpacity={0.9}
        onPress={this._onPress}>
        <Text
          style={{
            fontSize: 12,
            color: !disabled && this.state.isCountDownEnd ? '#FFF' : '#999'
          }}>
          {this.state.buttonText}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  countdownButton: {
    height: 40,
    width: 95,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    bottom: 7
  },
  sendVerificationCodeText: {
    color: 'white',
    fontSize: 12
  }
})

export default CountDownButton
