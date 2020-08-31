import React, { Component } from 'react'
import './index.scss'
import Actions from 'src/app/actions/actions'
import ClipboardJS from 'clipboard'

export default class SelfDelivery extends Component {
  componentDidMount() {
    // NOTE: init clip board obj
    this.Clipboard()
  }

  componentWillUnmount() {
    this.clipboard && this.clipboard.destroy()
  }

  handleCopy = () => this.Clipboard()

  Clipboard = () => {
    const { fc_address } = this.props.tote
    const dispathTips = this.dispatchTips
    this.clipboard = new ClipboardJS('.copyButton', {
      text: function() {
        return fc_address
      }
    })
    this.clipboard.on('success', function(e) {
      if (typeof dispathTips === 'function') {
        dispathTips('复制成功')
      } else {
        dispathTips('复制失败！请手动复制')
      }

      e.clearSelection()
    })
    this.clipboard.on('error', function() {
      dispathTips('复制失败！请手动复制')
    })
  }

  dispatchTips = tips =>
    this.props.dispatch(
      Actions.tips.changeTips({
        isShow: true,
        content: tips
      })
    )

  render() {
    const { fc_address } = this.props.tote
    return (
      <div className={'selfDeliveryWrapperView'}>
        <div className={'titleWrapperView'}>
          <div className={'title'}>寄回地址</div>
          <div className={'copyButton'} onClick={this.handleCopy}>
            复制
          </div>
        </div>
        <div className={'fcView'}>
          <div className={'fcAddress'}>{fc_address}</div>
        </div>
      </div>
    )
  }
}
