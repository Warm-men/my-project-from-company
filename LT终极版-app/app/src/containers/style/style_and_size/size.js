import React, { Component } from 'react'
import { inject } from 'mobx-react'

import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'
import { SizeComponent } from '../../../../storybook/stories/style'
import { getNumberSize } from '../../../expand/tool/me_style/shape'

@inject('currentCustomerStore', 'modalStore')
export default class SizeContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      style: {
        topSize: null,
        pantSize: null,
        dressSize: null,
        jeanSize: null,
        skirtSize: null
      },
      isDone: false,
      isLoading: false
    }
    this.shouldShowHint = true
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.style.height_inches !== this.props.style.height_inches ||
      nextProps.style.weight !== this.props.style.weight
    ) {
      this._calSize(nextProps.style)
    }
  }

  _calSize = style => {
    const { topSize, pantSize, dressSize, skirtSize, jeanSize } = getNumberSize(
      style
    )
    const {
      jean_size_unknow,
      jean_size
    } = this.props.currentCustomerStore.style
    this.setState(
      {
        style: {
          topSize: topSize,
          pantSize: pantSize,
          dressSize: dressSize,
          jeanSize: jean_size
            ? parseInt(jean_size)
            : jean_size_unknow
            ? null
            : jeanSize,
          skirtSize: skirtSize
        }
      },
      () => {
        this.judgeDone()
      }
    )
  }

  judgeDone = () => {
    const { style } = this.state
    if (
      !style.topSize ||
      !style.pantSize ||
      !style.dressSize ||
      !style.jeanSize ||
      !style.skirtSize
    ) {
      this.setState({ isDone: false })
      return
    }
    this.setState({ isDone: true })
  }

  _sizeChange = value => {
    let style = {}
    if (this.state.style[value.dataType] !== value.data) {
      this.shouldShowHint = false
      let values = value.data
      style[value.dataType] = values
      let newStyle = { ...this.state.style, ...style }
      this.setState({ style: newStyle }, this.judgeDone)
    }
  }

  _updateStyle = () => {
    const { updateStyle, saveSize } = this.props
    const {
      topSize,
      pantSize,
      dressSize,
      skirtSize,
      jeanSize
    } = this.state.style
    const sizeStyle = {
      top_size: topSize,
      pant_size: pantSize,
      dress_size: dressSize,
      jean_size: jeanSize,
      skirt_size: skirtSize
    }
    updateStyle && updateStyle(sizeStyle)
    saveSize && saveSize()
  }

  _alertCheck = () => {
    if (!this.shouldShowHint) {
      this._next()
      return
    }
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={'常穿尺码都正确吗？'}
        cancel={{ title: '我再看看', type: 'highLight' }}
        other={[{ title: '是的', type: 'highLight', onClick: this._next }]}
      />
    )
    return
  }

  _next = () => {
    this.shouldShowHint = false
    if (!this.state.isDone) {
      return
    }
    if (!this.state.isLoading) {
      this.setState({ isLoading: true })
      this._updateStyle()
    }
  }
  render() {
    const { isDone, style, isLoading } = this.state
    const { goback } = this.props
    return (
      <SizeComponent
        showStep={false}
        goback={goback}
        isDone={isDone}
        style={style}
        isLoading={isLoading}
        sizeChange={this._sizeChange}
        alertCheck={this._alertCheck}
      />
    )
  }
}
