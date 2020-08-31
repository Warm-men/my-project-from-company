import { browserHistory } from 'react-router'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import PageHelmet from 'src/app/lib/pagehelmet'

import SwapButton from './swap_button'
import StatusBar from 'src/app/containers/totes/components/tote_tracker/tote_tracker_status_bar'
import Products from './products'

import 'src/assets/stylesheets/components/desktop/totes/tote_tracker.scss'
import './index.scss'

const OnboardingTotes = props => {
  const { dispatch, totes, customer } = props

  const back = () => browserHistory.push('/')

  useEffect(() => {
    window.adhoc('track', 'onboarding_10', 1)
    dispatch(Actions.currentCustomer.fetchMe())
    dispatch(Actions.totes.fetchLatestRentalTote())
  }, [])

  const { latest_rental_tote: tote } = totes
  if (_.isEmpty(tote)) return null

  return (
    <div className="onboarding-tote">
      <PageHelmet title="Le Tote 托特衣箱" link="/totes_V2" />
      <div className="content-view">
        <div className="title">我的第一个衣箱</div>
        <Products
          isTotePage={true}
          customer={customer}
          dispatch={dispatch}
          tote={tote}
          toteVersion2={true}
        />
        <StatusBar isOnboardingSwap={true} tote={tote} />

        <SwapButton tote={tote} dispatch={dispatch} />
      </div>
      <div className="back" onClick={back}>
        返回首页
      </div>
    </div>
  )
}

const getState = state => {
  const { totes, customer, app } = state
  return { totes, customer, app }
}

export default connect(getState)(OnboardingTotes)
