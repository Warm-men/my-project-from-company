import React, { Component } from 'react'
import SelectButton from 'src/app/components/schedule_return/schedule_type_select_button'
import AutoPickup from './auto_pickup'
import SelfDelivery from './self_delivery'
import { connect } from 'react-redux'
import './index.scss'
import ToteReturndRemind from 'src/app/components/schedule_return/schedule_return_remind'

@connect()
export default class AutoPickupOrSelfDelivery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scheduledPickupsType: 'scheduled_auto_pickup'
    }
  }

  _didSelectedItem = type => {
    const { updateScheduledPickupsType } = this.props
    this.setState(
      {
        scheduledPickupsType: type
      },
      () => {
        updateScheduledPickupsType && updateScheduledPickupsType(type)
      }
    )
  }

  render() {
    const { scheduledPickupsType } = this.state
    const {
      isMiniApp,
      isWechat,
      location,
      shipping_address,
      tote,
      dispatch,
      updateDateTime,
      updateCustomerShppingAddress,
      hideSelectButton,
      verifyAddreddRefFn,
      isOnlyReturnToteFreeService
    } = this.props
    const isAutoPickup = scheduledPickupsType === 'scheduled_auto_pickup'
    return (
      <div>
        {!hideSelectButton && (
          <div className={'selectButtonView'}>
            <SelectButton
              onPress={this._didSelectedItem}
              scheduledPickupsType={scheduledPickupsType}
              text={'上门取件'}
              type={'scheduled_auto_pickup'}
            />
            <SelectButton
              onPress={this._didSelectedItem}
              scheduledPickupsType={scheduledPickupsType}
              text={'自行寄回'}
              type={'scheduled_self_delivery'}
            />
          </div>
        )}
        <div>
          {isAutoPickup ? (
            <AutoPickup
              isMiniApp={isMiniApp}
              isWechat={isWechat}
              location={location}
              tote={tote}
              verifyAddreddRefFn={verifyAddreddRefFn}
              updateDateTime={updateDateTime}
              shipping_address={shipping_address}
              updateCustomerShppingAddress={updateCustomerShppingAddress}
            />
          ) : (
            <SelfDelivery dispatch={dispatch} tote={tote} />
          )}
          <ToteReturndRemind
            type={scheduledPickupsType}
            isOnlyReturnToteFreeService={isOnlyReturnToteFreeService}
          />
        </div>
      </div>
    )
  }
}
