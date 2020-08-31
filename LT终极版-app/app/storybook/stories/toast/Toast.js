import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Animated,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Text
} from 'react-native'
import ToastStyles from './ToastStyles'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'

const noop = () => 0

class Toast extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    icon: PropTypes.object,
    styles: PropTypes.object,
    duration: PropTypes.number,
    height: PropTypes.number,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    onPress: PropTypes.func,
    showType: PropTypes.string
  }

  static defaultProps = {
    styles: ToastStyles.info.styles,
    icon: ToastStyles.info.icon,
    duration: 3000,
    height: 100,
    onShow: noop,
    onHide: noop,
    onPress: noop
  }

  state = { animatedValue: new Animated.Value(0), timeoutId: null }

  UNSAFE_componentWillMount() {
    this.showToast()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.showToast()
    }
  }

  showToast() {
    const animatedValue = new Animated.Value(0)

    this.setState({ animatedValue })

    Animated.spring(animatedValue, { toValue: 1, duration: 0 }).start()

    const { duration, onShow } = this.props
    const timeoutId = setTimeout(() => this.hideToast(), duration)

    this.setState({ timeoutId }, onShow)
  }

  hideToast() {
    const { timeoutId, animatedValue } = this.state

    clearTimeout(timeoutId)

    Animated.timing(animatedValue, { toValue: 0, duration: 350 }).start()

    setTimeout(this.props.onHide, 350)
  }

  updateToast() {
    const { timeoutId, animatedValue } = this.state

    clearTimeout(timeoutId)

    Animated.timing(animatedValue, { toValue: 0, duration: 0 }).start()

    setTimeout(this.props.onHide, 0)
  }

  onPress = () => {
    this.hideToast()
    this.props.onPress()
  }

  _getCurrentComponent = () => {
    const { showType } = this.props
    let component
    if (!showType) {
      //default 样式
      component = this._getDefaultToast()
    } else if (showType === 'opacity') {
      component = this._getOpacityToast()
    }
    return component
  }

  _getOpacityToast = () => {
    const { text } = this.props
    return (
      <Animated.View
        style={[
          toastStyles.opacityView,
          { opacity: this.state.animatedValue }
        ]}>
        <TouchableWithoutFeedback onPress={this.onPress}>
          <View style={{ width: p2d(375), alignItems: 'center' }}>
            <View style={toastStyles.opacityTextView}>
              <Text style={toastStyles.opacityText}>{text}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }

  _getDefaultToast = () => {
    const { styles, icon, text, height } = this.props

    const y = this.state.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-height, 0]
    })
    const style = { transform: [{ translateY: y }] }

    return (
      <Animated.View style={[toastStyles.container, style]}>
        <TouchableWithoutFeedback onPress={this.onPress}>
          <View style={toastStyles.toastView}>
            <Image source={icon.image} />
            <Text textDecorationLine={'none'} style={styles.text}>
              {text}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }

  render() {
    if (Object.prototype.toString.call(this.props.text) === '[object String]') {
      return this._getCurrentComponent()
    } else {
      return null
    }
  }
}

const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 8,
    left: 8,
    zIndex: 9999,
    borderRadius: 3,
    overflow: 'hidden'
  },
  toastView: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center'
  },
  opacityView: {
    position: 'absolute',
    bottom: '30%',
    zIndex: 9999
  },
  opacityTextView: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(36, 36, 36, 0.7)'
  },
  opacityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20
  }
})

export default Toast
