/* @flow */

import React, { PureComponent } from 'react'

export default class TopView extends PureComponent {
  render() {
    const { isOnboarding, isThreshold, cancel, currentProduct } = this.props
    const { tote_slot, type, category_rule } = currentProduct

    const title =
      isThreshold && category_rule.error_msg
        ? category_rule.error_msg + '，请选择替换'
        : '请选择服饰进行替换'

    const name = type === 'Accessory' ? '配饰位' : '衣位'

    return (
      <div className="tote-swap-modal-title">
        <div className="title-wrapper">
          {tote_slot > 1 && !isOnboarding && (
            <p className="tote-swap-modal-tips">
              *此商品需占用{tote_slot}个{name}
            </p>
          )}
          <div className="title">{title}</div>
        </div>
        <div className="close" onClick={cancel} />
      </div>
    )
  }
}
