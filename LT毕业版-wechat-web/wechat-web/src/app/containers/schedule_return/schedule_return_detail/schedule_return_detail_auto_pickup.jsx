import React, { Component } from 'react'
import { format } from 'date-fns'
import ScheduleReturnFreeServiceDetails from 'src/app/components/schedule_return/schedule_return_free_service_detail'
import ScheduleReturnProductsCard from 'src/app/components/schedule_return/schedule_return_products_card'

export default class ToteReturnDetailAutoPickup extends Component {
  render() {
    const { tote, isToteScheduledReturn } = this.props
    const { scheduled_auto_pickup, allowed_commands } = isToteScheduledReturn
      ? tote.scheduled_return
      : tote.tote_free_service.scheduled_return
    const toteFreeService = tote.tote_free_service
    const {
      address_1,
      city,
      district,
      requested_pickup_at,
      telephone,
      full_name,
      state,
      shipping_code
    } = scheduled_auto_pickup
    const canScheduleAutoPickup = allowed_commands.includes(
      'schedule_auto_pickup'
    )
    const disabledModifyScheduleAutoPickup = !canScheduleAutoPickup
    const requestedPickupAt =
      requested_pickup_at && format(requested_pickup_at, 'YYYY-MM-DD HH:mm')
    return (
      <div className={'toteReturnDetailAutoPickupComponent'}>
        <div className={'title'}>{'预约信息'}</div>
        <div className={'infoView'}>
          <div className={'infobox'}>
            <div className={'marginBottom infocolumn'}>
              <div className={'leftrow'}>{'上门时间'}</div>
              <div className={'rightrow'}>{requestedPickupAt}</div>
            </div>
            <div className={'marginBottom infocolumn'}>
              <div className={'leftrow'}>{'寄件人'}</div>
              <div className={'rightrow'}>{full_name}</div>
            </div>
            <div className={'marginBottom, infocolumn'}>
              <div className={'leftrow'}>{'手机号码'}</div>
              <div className={'rightrow'}>{telephone}</div>
            </div>
            <div className={'infocolumn'}>
              <div className={'leftrow'}>{'寄件地址'}</div>
              <div className={'rightrow'}>
                {`${state}${city}${district}${address_1}`}
              </div>
            </div>
          </div>
          <div className={'infobox'}>
            <div className={'marginBottom infocolumn'}>
              <div className={'leftrow'}>{'顺丰速运'}</div>
              <div className={'rightrow'}>
                {shipping_code ? shipping_code : '暂无快递单号'}
              </div>
            </div>
            <div className={'infocolumn'}>
              <div className={'leftrow'}>{'客服电话'}</div>
              <div className={'rightrow redColor'}>{'95338'}</div>
            </div>
          </div>
        </div>
        {isToteScheduledReturn ? (
          <ScheduleReturnProductsCard tote={tote} />
        ) : (
          <div className={'fixUiWrapper'}>
            <ScheduleReturnFreeServiceDetails
              toteFreeService={toteFreeService}
            />
          </div>
        )}
        {disabledModifyScheduleAutoPickup && (
          <div className={'disabledView'}>
            <div className={'disabledText'}>
              你已更改过一次，不能再次修改预约信息
              <br />
              如需帮助请联系顺丰客服或自行寄回
            </div>
          </div>
        )}
      </div>
    )
  }
}
