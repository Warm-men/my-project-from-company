/* @flow */

import React, { PureComponent } from 'react'
import { Experiment, Variant } from '../../../../src/components/ab_testing'
import { inject, observer } from 'mobx-react'
import { TestAItem, TestBItem } from './subscription_test_item'
@inject('currentCustomerStore')
@observer
export default class ExtendSubscriptionItem extends PureComponent {
  _didSelectedItem = () => {
    const { didSelectedItem, item } = this.props
    didSelectedItem && didSelectedItem(item)
  }

  _didSelectedItemB = type => {
    const { didSelectedItem, item, didSelectedFreeService } = this.props
    didSelectedItem && didSelectedItem(item)
    if (type === 'header') {
      didSelectedFreeService && didSelectedFreeService()
    } else {
      didSelectedFreeService && didSelectedFreeService(true)
    }
  }

  render() {
    const {
      item,
      isSelected,
      didSelectedFreeService,
      isSelectedFreeService,
      index,
      enablePaymentContract
    } = this.props
    return (
      <Experiment defaultValue={1} flagName={'auto_renew_discount'}>
        <Variant value={1}>
          <TestAItem
            item={item}
            isSelected={isSelected}
            didSelectedItem={this._didSelectedItem}
            didSelectedFreeService={didSelectedFreeService}
            isSelectedFreeService={isSelectedFreeService}
            enablePaymentContract={enablePaymentContract}
          />
        </Variant>
        <Variant value={2}>
          <TestBItem
            item={item}
            isSelected={isSelected}
            didSelectedItem={this._didSelectedItemB}
            didSelectedFreeService={didSelectedFreeService}
            isSelectedFreeService={isSelectedFreeService}
            index={index}
            enablePaymentContract={enablePaymentContract}
          />
        </Variant>
      </Experiment>
    )
  }
}
