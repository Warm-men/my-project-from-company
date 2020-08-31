import React, { Component } from 'react'
import { Animated, Keyboard } from 'react-native'

class KeyboardComponent extends Component {
  constructor(props) {
    super(props)

    this.keyboardHeight = new Animated.Value(0)
    this.contentOffsetY = 0
    this.keyboardOnShow = false
  }

  UNSAFE_componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow
    )
    this.keyboardWillHideSub = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide
    )
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
  }

  keyboardWillShow = event => {
    const { marginBottom } = this.props
    this.keyboardOnShow = true
    if (this._scrollView && this._scrollView._component) {
      this._scrollView._component.scrollTo({
        x: 0,
        y: this.contentOffsetY + event.endCoordinates.height - 64,
        animated: true
      })
    }

    const value = marginBottom ? marginBottom : 0
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height - value
    }).start()
  }

  keyboardWillHide = () => {
    Animated.timing(this.keyboardHeight, {
      duration: 300,
      toValue: 0
    }).start(() => {})
    this.keyboardOnShow = false

    if (this._scrollView && this._scrollView._component) {
      this._scrollView._component.scrollTo({
        x: 0,
        y: this.contentOffsetY < 0 ? 0 : this.contentOffsetY,
        animated: true
      })
    }
  }

  onScroll = event => {
    if (this.keyboardOnShow === false) {
      this.contentOffsetY = event.nativeEvent.contentOffset.y
    }
  }

  render() {
    return (
      <Animated.ScrollView
        ref={scrollView => (this._scrollView = scrollView)}
        style={[this.props.style, { marginBottom: this.keyboardHeight }]}
        onScroll={this.onScroll}
        scrollEventThrottle={0}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {this.props.children}
      </Animated.ScrollView>
    )
  }
}

export default KeyboardComponent
