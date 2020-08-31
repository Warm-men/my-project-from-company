/* @flow */

import React, { PureComponent } from 'react'
import ScheduleReturnFreeServiceDetails from 'src/app/components/schedule_return/schedule_return_free_service_detail'
import ToteProducts from 'src/app/containers/totes/confirm_totes/products'
import './index.scss'

export default class ToteReturnScheduleProductsCard extends PureComponent {
  checkReturnedToteProduct = () => {
    const { tote_products } = this.props.tote
    let toteProducts = tote_products.filter(item => {
      return (
        item.transition_state !== 'purchased' &&
        item.transition_state !== 'returned'
      )
    })
    return toteProducts
  }
  render() {
    const { tote, tote_free_service } = this.props.tote.scheduled_return
    const toteProducts = this.checkReturnedToteProduct()
    const productsListTitle =
      !!tote && !!tote_free_service ? '待归还衣箱' : '归还衣箱'
    return (
      <div className={'productsCard'}>
        {!!tote && !!tote_free_service && (
          <div className={'heardTitleView'}>
            <div className={'line'} />
            <div className={'heardTitleText'}>{'本次需归还'}</div>
            <div className={'line'} />
          </div>
        )}
        {!!tote_free_service && (
          <div className={'freeServiceDetailsViewWrapper'}>
            <ScheduleReturnFreeServiceDetails
              toteFreeService={tote_free_service}
            />
          </div>
        )}
        {!!tote && (
          <div className={'productsViewWrapper'}>
            <div className={'productsTitleText'}>{productsListTitle}</div>
            <ToteProducts column={'ReturnTote'} products={toteProducts} />
          </div>
        )}
      </div>
    )
  }
}
