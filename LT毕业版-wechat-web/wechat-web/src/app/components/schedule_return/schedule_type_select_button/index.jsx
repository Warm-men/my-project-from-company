/* @flow */

import React, { PureComponent } from 'react'
import './index.scss'

export default class SelectButton extends PureComponent {
  _didSelectedItem = () => {
    const { type, onPress } = this.props
    onPress(type)
  }
  render() {
    const { scheduledPickupsType, text, type } = this.props
    const onFocus = type === scheduledPickupsType
    const textStateStyle = onFocus
      ? 'selectButtonOnFocusText'
      : 'selectButtonOnBlureText'
    const lineStyle = onFocus ? 'lineView whiteColor' : 'lineView yellowColor'
    const buttonItem = `buttonItem ${textStateStyle}`
    return (
      <span className={'buttonViewWrapper'} onClick={this._didSelectedItem}>
        <span className={buttonItem}>{text}</span>
        <span className={lineStyle} />
      </span>
    )
  }
}
