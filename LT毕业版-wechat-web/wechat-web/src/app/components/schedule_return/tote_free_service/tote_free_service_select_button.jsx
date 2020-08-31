/* @flow */

import React, { PureComponent } from 'react'

export default class SelectButton extends PureComponent {
  _onPress = () => {
    const { type, onPress } = this.props
    onPress(type)
  }
  render() {
    const { selectStatus, type, text } = this.props
    const textStyle = selectStatus === type ? 'onFocusText' : 'onBlureText'
    const buttonStyle = selectStatus === type ? 'onFocus' : 'onBlure'
    const buttonItemStyle = `buttonItem ${buttonStyle}`
    return (
      <div onClick={this._onPress} className={buttonItemStyle}>
        <div className={textStyle}>{text}</div>
      </div>
    )
  }
}
