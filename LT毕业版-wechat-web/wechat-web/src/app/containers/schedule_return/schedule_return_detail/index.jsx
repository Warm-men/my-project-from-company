import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import './index.scss'
import GeneralWxShareHOC from 'src/app/components/HOC/GeneralWxShare'
import ScheduleReturnDetailAutoPickup from './schedule_return_detail_auto_pickup'
import ScheduleReturnDetailSelfDelivery from './schedule_return_detail_self_delivery'
import ScheduleReturnDetailActions from './schedule_return_detail_actions'
import PageHelmet from 'src/app/lib/pagehelmet'

function mapStateToProps(state, props) {
  const { totes } = state
  const { toteId } = props.location.query
  let currentTote = _.find(totes.current_totes, v => {
    return v.id === Number(toteId)
  })
  return {
    totes: totes,
    currentTote
  }
}
@connect(mapStateToProps)
@GeneralWxShareHOC
export default class ScheduleReturnDetailContainer extends Component {
  constructor(props) {
    super(props)
    const { currentTote, location } = props
    const { scheduledReturnType } = location.query
    const {
      scheduled_return: { scheduled_auto_pickup }
    } =
      scheduledReturnType === 'tote_scheduled_return'
        ? currentTote
        : currentTote.tote_free_service
    this.state = {
      isScheduledAutoPickup: !!scheduled_auto_pickup ? true : false
    }
    this.scheduledAutoPickup = !!scheduled_auto_pickup
  }

  gotoScheduleAutoPickup = () => {
    const {
      currentTote: { id },
      location: { query }
    } = this.props
    const { scheduledReturnType } = query
    browserHistory.push({
      pathname: `/modify_schedule_return`,
      query: {
        toteId: id,
        scheduledReturnType,
        prePageName: 'schedule_detail'
      }
    })
  }

  gotoScheduleSeflDelivery = () => {
    this.setState({
      isScheduledAutoPickup: false
    })
  }

  gotoSeflDeliveryGuide = () => {
    const { id } = this.props.currentTote
    browserHistory.push({
      pathname: `/hive_box`,
      query: {
        toteId: id
      }
    })
  }

  modifyShippingCode = () => {
    const {
      currentTote: { id },
      location: { query }
    } = this.props
    const { scheduledReturnType } = query
    browserHistory.push({
      pathname: `/hive_box_fill`,
      query: {
        toteId: id,
        scheduledReturnType,
        prePageName: 'schedule_return_detail',
        scheduledAutoPickup: this.scheduledAutoPickup
      }
    })
  }

  render() {
    const { currentTote, dispatch, location } = this.props
    const { scheduledReturnType } = location.query
    const isToteScheduledReturn =
      scheduledReturnType === 'tote_scheduled_return'
    const { scheduled_return } = isToteScheduledReturn
      ? currentTote
      : currentTote.tote_free_service

    if (
      _.isEmpty(scheduled_return.scheduled_auto_pickup) &&
      _.isEmpty(scheduled_return.scheduled_self_delivery)
    ) {
      return null
    } else {
      const { isScheduledAutoPickup } = this.state
      const title = isScheduledAutoPickup ? '预约详情' : '自行寄回'
      return (
        <div className="schedule-return-detail">
          <PageHelmet title={title} link="/schedule_return_detail" />
          {isScheduledAutoPickup ? (
            <ScheduleReturnDetailAutoPickup
              isToteScheduledReturn={isToteScheduledReturn}
              tote={currentTote}
            />
          ) : (
            <ScheduleReturnDetailSelfDelivery
              gotoSeflDeliveryGuide={this.gotoSeflDeliveryGuide}
              tote={currentTote}
              isToteScheduledReturn={isToteScheduledReturn}
              dispatch={dispatch}
            />
          )}
          <ScheduleReturnDetailActions
            gotoScheduleAutoPickup={this.gotoScheduleAutoPickup}
            gotoScheduleSeflDelivery={this.gotoScheduleSeflDelivery}
            modifyShippingCode={this.modifyShippingCode}
            tote={currentTote}
            isToteScheduledReturn={isToteScheduledReturn}
            isScheduledAutoPickup={isScheduledAutoPickup}
          />
        </div>
      )
    }
  }
}
