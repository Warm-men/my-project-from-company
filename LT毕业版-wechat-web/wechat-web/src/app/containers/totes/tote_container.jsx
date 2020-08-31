import { useState, useEffect } from 'react'
import Actions from 'src/app/actions/actions'
import * as storage from 'src/app/lib/storage'
import PageHelmet from 'src/app/lib/pagehelmet'

import { TotesAbnormalCardContainer } from 'src/app/containers/totes/components/totes_abnormal_card'
import CurrentTotes from 'src/app/containers/totes/components/current_totes'
import PastTotes from 'src/app/containers/totes/past_totes'
import EmptyView from 'src/app/containers/totes/components/empty_totes'

import Hint from 'src/app/components/hint'
import Alert from 'src/app/components/alert'

import 'src/assets/stylesheets/components/desktop/totes/totes_container.scss'

const TotesContainer = props => {
  const { customer, orders, totes, app, dispatch } = props
  const { current_totes, loadedLatestTotes, tote_state_tips } = totes
  const { platform } = app

  const [showModal, setShowModal] = useState(false)
  const [markToteId, setMarkToteId] = useState(null)
  const [showFreeServiceFeeTip, setFreeServiceFeeTip] = useState(false)
  const [customerPhotosHint, setCustomerPhotosHint] = useState(null)

  useEffect(() => {
    fetchLatestRentalAndPurchaseTote()
    dispatch(Actions.subscription.query())
    storage.set('isMultipleQuiz', false)

    fetchCopywritingAdjustments()
  }, [])

  useEffect(() => {
    return () => dispatch(Actions.orders.initialFreeServiceFeeTip())
  }, [])

  useEffect(() => {
    fetchPastTotes(1)
  }, [loadedLatestTotes])

  useEffect(() => {
    !_.isEmpty(orders.free_service_fee_tip) && setFreeServiceFeeTip(true)
  }, [orders.free_service_fee_tip])

  const fetchLatestRentalAndPurchaseTote = () => {
    dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
  }

  const fetchCopywritingAdjustments = () => {
    dispatch(
      Actions.copywritingAdjustments.fetchCopywritingAdjustments(
        {},
        (dis, res) => {
          const { first_customer_photo_hint } = res.data.copywriting_adjustments
          setCustomerPhotosHint(first_customer_photo_hint)
        }
      )
    )
  }

  const fetchPastTotes = page => dispatch(Actions.totes.fetchPastTotes(page))

  const markToteAsDelivered = id => {
    setShowModal(true)
    setMarkToteId(id)
  }

  const confirmGetTote = () => {
    if (markToteId) {
      dispatch(
        Actions.totes.markToteAsDelivered(markToteId, () => {
          dispatch(Actions.currentCustomer.fetchMe())
          dispatch(Actions.totes.queryTotesStateTips())
          fetchLatestRentalAndPurchaseTote()
          hideSginInModal()
        })
      )
    }
  }

  const hideSginInModal = () => setShowModal(false)

  const hideAlert = () => {
    setFreeServiceFeeTip(false)
    dispatch(Actions.orders.initialFreeServiceFeeTip())
  }

  const hasErrors = () => {
    let hasErrors = false
    if (tote_state_tips) {
      for (let key in tote_state_tips) {
        if (tote_state_tips.hasOwnProperty(key)) {
          const item = tote_state_tips[key]
          if (item && item.errors) {
            if (platform !== 'jd') {
              if (!hasErrors && item.errors.length) {
                hasErrors = true
              }
            } else {
              if (
                !hasErrors &&
                item.errors.length &&
                item.errors[0].error_code !== 'errors_without_wechat_contract'
              ) {
                hasErrors = true
              }
            }
          }
        }
      }
    }
    return hasErrors
  }

  const hasGuide = customer.subscription.tote_entry_state === 'cart_guide'
  const isDone = customer.subscription.tote_entry_state === 'default'

  const hasAbnormalCard = !_.isEmpty(totes) && hasErrors()

  return (
    <div id="my-totes">
      <PageHelmet title="衣箱" link="/totes" />
      <div className={'totes-container'}>
        {isDone ? (
          <div className={'totes-default'}>
            <TotesAbnormalCardContainer
              dispatch={dispatch}
              platform={platform}
              customer={customer}
              toteStateTips={totes.tote_state_tips}
            />
            <CurrentTotes
              dispatch={dispatch}
              customer={customer}
              totes={current_totes}
              hasAbnormalCard={hasAbnormalCard}
              markToteAsDelivered={markToteAsDelivered}
              customerPhotosHint={customerPhotosHint}
            />
            <PastTotes totes={totes} dispatch={dispatch} />
          </div>
        ) : hasGuide ? (
          <EmptyView isFull showButton={customer.display_cart_entry} />
        ) : null}
      </div>
      {showModal && (
        <Hint
          isCenter
          content="请确定你已收到衣箱"
          leftBtnText="取消"
          rightBtnText="确定"
          leftButton={hideSginInModal}
          rightButton={confirmGetTote}
        />
      )}
      {showFreeServiceFeeTip && (
        <Alert
          btnText="我知道了"
          textAlign="left"
          title={orders.free_service_fee_tip.title}
          content={orders.free_service_fee_tip.content}
          handleClick={hideAlert}
        />
      )}
    </div>
  )
}

export default TotesContainer
