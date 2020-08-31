import { browserHistory } from 'react-router'
import { useState } from 'react'

import StatusBar from '../tote_tracker_status_bar'
import ToteTipCard from './tote_tip_card'

import './index.scss'

const Header = ({ tote, markToteAsDelivered }) => {
  const { id, pull_tote_tip, progress_status, tote_free_service } = tote
  const { status, hide_delivered_btn } = progress_status

  const [showStatusBar, exchangeStatusBar] = useState(false)

  const showExpress = () => {
    const { outbound_shipping_code } = tote
    browserHistory.push({
      pathname: '/express',
      query: { shipping_code: outbound_shipping_code, tote_id: id }
    })
  }

  const markToteDelivered = () => {
    markToteAsDelivered && markToteAsDelivered(id)
  }

  const onClick = () => {
    exchangeStatusBar(!showStatusBar)
  }

  const hasReceipt = status === 'shipped' && !hide_delivered_btn
  const hasLogistics = status === 'delivered' || status === 'shipped'

  const remind =
    tote_free_service &&
    tote_free_service.hint &&
    tote_free_service.hint.tote_page_return_remind

  const isRemittedFreeServiceRent =
    remind && remind.type === 'remitted_free_service_rent'

  return (
    <div className="tote-tracker-header">
      <div className="tote-progress-status">
        <div className="progress-status" onClick={onClick}>
          <span className="title">{progress_status.title}</span>
          <img
            className={showStatusBar ? 'arrow-close' : 'arrow'}
            src={require('./images/arrow.png')}
            alt="arrow"
          />
        </div>
        <div className="buttons">
          {hasReceipt ? (
            <div className="button" onClick={markToteDelivered}>
              确认签收
            </div>
          ) : null}
          {hasReceipt ? <span /> : null}
          {hasLogistics ? (
            <div className="button" onClick={showExpress}>
              查看物流
            </div>
          ) : null}
        </div>
      </div>
      {showStatusBar ? <StatusBar tote={tote} /> : null}
      <ToteTipCard type={'PULL_TOTE'} message={pull_tote_tip} />
      {isRemittedFreeServiceRent ? (
        <ToteTipCard
          type={'REITTED_FREE_SERVICE_RENT'}
          message={remind.message}
        />
      ) : null}
    </div>
  )
}

export default React.memo(Header)
