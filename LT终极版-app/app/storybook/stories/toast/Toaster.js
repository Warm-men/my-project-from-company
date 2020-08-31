import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Toast from './Toast'

const messageType = PropTypes.shape({
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  styles: PropTypes.object,
  duration: PropTypes.number,
  height: PropTypes.number
})

const noop = () => 0

// Inspired by https://github.com/dabit3/react-native-toasts
class Toaster extends Component {
  static propTypes = {
    message: PropTypes.oneOfType([messageType, PropTypes.arrayOf(messageType)]),
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    onPress: PropTypes.func,
    cleanToast: PropTypes.func
  }

  static defaultProps = {
    onShow: noop,
    onHide: noop,
    onPress: noop,
    cleanToast: noop
  }

  constructor(props) {
    super(props)

    let messages = []

    if (props.message) {
      messages = this.cloneWithId(props.message)
      messages = Array.isArray(messages) ? messages : [messages]
    }

    this.state = { messages }

    // 是否在显示
    this.isShow = false
  }

  cloneWithId(obj) {
    if (Array.isArray(obj)) {
      return obj.map(this.cloneWithId)
    }

    return Object.assign({ id: Math.random().toString(36) }, obj)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.message) return
    if (this.state.messages.length) {
      if (
        this.state.messages[0].text === nextProps.message.text &&
        this.isShow
      ) {
        return
      }
      this.toast.updateToast()
    }
    const message = this.cloneWithId(nextProps.message)
    this.setState({ messages: this.state.messages.concat(message) })
  }

  onShow = () => {
    const message = this.state.messages[0]

    if (message.onShow) {
      message.onShow()
    }

    this.props.onShow(message)
    this.isShow = true
  }

  onHide = () => {
    const message = this.state.messages[0]
    this.setState({ messages: this.state.messages.slice(1) }, () => {
      if (message && message.onHide) {
        message.onHide()
      }
      if (this.props.onHide) {
        this.props.onHide(message)
      }
      this.isShow = false
      if (this.state.messages && this.state.messages.length === 0) {
        this.props.cleanToast()
      }
    })
  }

  onPress = () => {
    const message = this.state.messages[0]

    if (message.onPress) {
      message.onPress()
    }

    this.props.onPress(message)
  }

  render() {
    const { messages } = this.state
    if (!messages.length) return null
    return (
      <Toast
        ref={toast => {
          this.toast = toast
        }}
        {...messages[0]}
        onShow={this.onShow}
        onHide={this.onHide}
        onPress={this.onPress}
      />
    )
  }
}

export default Toaster
