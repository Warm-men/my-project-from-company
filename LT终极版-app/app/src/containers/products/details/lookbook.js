/* @flow */

import React, { PureComponent } from 'react'
import { LookBook } from '../../../../storybook/stories/products/details'
export default class ProductDetailsLookbook extends PureComponent {
  render() {
    const { navigation, inSwap, looks } = this.props
    if (!looks) {
      return null
    } else
      return (
        <LookBook navigation={navigation} inSwap={inSwap} data={looks[0]} />
      )
  }
}
