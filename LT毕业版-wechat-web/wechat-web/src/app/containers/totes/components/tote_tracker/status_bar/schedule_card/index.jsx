import { browserHistory } from 'react-router'

import ScheduleAutoPickupCard from './schedule_auto_pickup_card'
import ScheduleSelfDeliveryCard from './schedule_self_delivery_card'

export default class ScheduleCard extends React.PureComponent {
  toScheduleReturnDetail = () => {
    const { tote, scheduledReturnType } = this.props
    browserHistory.push({
      pathname: `/schedule_return_detail`,
      query: { toteId: tote.id, scheduledReturnType }
    })
  }

  inputHiveBox = () => {
    const { tote, scheduledReturnType } = this.props
    browserHistory.push({
      pathname: `/hive_box_fill`,
      query: { toteId: tote.id, scheduledReturnType, prePageName: 'totes' }
    })
  }

  getToteReturnStatus = () => {
    const { scheduledReturnType, tote } = this.props
    let data
    if (scheduledReturnType === 'tote_free_service_scheduled_return') {
      data = tote.tote_free_service.scheduled_return
    } else {
      data = tote.scheduled_return
    }
    return data ? data : {}
  }

  render() {
    const { scheduledReturnType, tote } = this.props
    const { fc_address } = tote

    const data = this.getToteReturnStatus()
    const { scheduled_auto_pickup, scheduled_self_delivery } = data
    if (!scheduled_auto_pickup && !scheduled_self_delivery) return null

    const isFreeServiceReturn = scheduledReturnType !== 'tote_scheduled_return'

    return (
      <div>
        {scheduled_auto_pickup && (
          <ScheduleAutoPickupCard
            data={scheduled_auto_pickup}
            isFreeServiceReturn={isFreeServiceReturn}
            onClick={this.toScheduleReturnDetail}
          />
        )}
        {scheduled_self_delivery && (
          <ScheduleSelfDeliveryCard
            data={scheduled_self_delivery}
            fcAddress={fc_address}
            isFreeServiceReturn={isFreeServiceReturn}
            inputHiveBox={this.inputHiveBox}
            onClick={this.toScheduleReturnDetail}
          />
        )}
      </div>
    )
  }
}
