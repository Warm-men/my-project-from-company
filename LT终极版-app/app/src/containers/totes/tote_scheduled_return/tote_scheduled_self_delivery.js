/* @flow */

import React, { PureComponent } from 'react'
import { View, Clipboard } from 'react-native'
import ToteReturndSelfDeliveryFcAddressCard from '../../../../storybook/stories/totes/tote_return/tote_return_self_delivery_fcAddress_card'
import ToteReturndRemind from '../../../../storybook/stories/totes/tote_return/tote_return_remind'
import { inject } from 'mobx-react'

@inject('appStore')
export default class ToteScheduledSelfDelivery extends PureComponent {
  _copyContent = async () => {
    const {
      tote: { fc_address },
      appStore
    } = this.props
    Clipboard.setString(fc_address)
    try {
      let result = await Clipboard.getString()
      if (result) {
        appStore.showToast('复制成功', 'success')
      }
    } catch (e) {
      appStore.showToast('复制失败', 'error')
    }
  }
  render() {
    const { tote, isOnlyReturnToteFreeService } = this.props
    const { fc_address } = tote
    return (
      <View>
        <ToteReturndSelfDeliveryFcAddressCard
          fcAddress={fc_address}
          copyContent={this._copyContent}
        />
        <ToteReturndRemind
          type={'self_delivery'}
          isOnlyReturnToteFreeService={isOnlyReturnToteFreeService}
        />
      </View>
    )
  }
}
