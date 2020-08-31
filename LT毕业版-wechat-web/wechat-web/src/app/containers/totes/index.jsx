import { withRouter, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { lazy, useState, useEffect, useLayoutEffect } from 'react'
import Actions from 'src/app/actions/actions'
import authentication from 'src/app/lib/authentication'
import * as storage from 'src/app/lib/storage'

import WithWechatShare from 'src/app/components/HOC/with_wechat_share'
import PopupsHOC from 'src/app/components/HOC/Popups'
import TotePopups from 'src/app/components/tote_popups'

import TotesContainer from './tote_container'
import LoadingViewContainer from 'src/app/components/LoadingViewContainer'

import './index.scss'

const NonMembers = lazy(() =>
  import('src/app/containers/totes/components/non_members')
)

const NewTotesGuide = lazy(() =>
  import('src/app/containers/totes/components/new_totes_guide')
)

const TotesWrapper = props => {
  const { dispatch, app, authentication, customer } = props

  const [isShowGuide, setIsShowGuide] = useState(false)
  const [isFinish, setIsFinish] = useState(false)

  useEffect(() => {
    const isShowed = storage.get('NewTotesGuide', localStorage)
    if (customer.display_cart_entry && !isShowGuide && !isShowed) {
      setIsShowGuide(true)
    }
  })

  useEffect(() => {
    const personalInfo = () => {
      // NOTE: Api Finish
      setIsFinish(true)
      // 当外部链接直接跳 /totes 路由时,判断有否size,只要customer或者customerStyleInfo有top_size及ok(买了会员才让她去填)
      if (!(authentication.isSubscriber && authentication.isValidSubscriber)) {
        return null
      }
      if (customer.subscription.tote_entry_state === 'normal_question') {
        browserHistory.replace('/get-started/start')
        return null
      }
      if (customer.subscription.tote_entry_state === 'onboarding_question') {
        browserHistory.replace('/confirm_personal_info')
      }
    }

    dispatch(Actions.promoCode.reset())
    dispatch(Actions.currentCustomer.fetchMe(personalInfo))
  }, [])

  useLayoutEffect(() => {
    _.isEmpty(app.floatHover) &&
      dispatch(
        Actions.floatHover.floatHover('TOTE_QUIZ'),
        () => {},
        () => dispatch(Actions.tips.changeTips({ isShow: false, content: '' }))
      )
  }, [])

  const closePopups = () => {
    dispatch(
      Actions.floatHover.markFloathover(app.floatHover.id, () => {
        dispatch(Actions.floatHover.floatHover('TOTE_QUIZ'))
      })
    )
  }

  const handleFinishGuide = () => {
    storage.set('NewTotesGuide', true, localStorage)
    setIsShowGuide(false)
  }

  return (
    <>
      {isFinish ? (
        authentication.isSubscriber ? (
          <TotesContainer {...props} />
        ) : (
          <NonMembers />
        )
      ) : (
        <LoadingViewContainer />
      )}
      {customer.display_cart_entry && <NewTotesIcon />}
      {isShowGuide && <NewTotesGuide handleFinish={handleFinishGuide} />}
      <TotePopups app={app} closePopups={closePopups} />
    </>
  )
}

const NewTotesIcon = React.memo(() => {
  const onClick = () => browserHistory.push('/new_totes')

  return (
    <div className="new-totes-icon" onClick={onClick}>
      <img
        src={require('src/app/containers/product/detail_buttons/images/new-cart.svg')}
        alt=""
      />
      <span>新衣箱</span>
    </div>
  )
})

function mapStateToProps(state) {
  const { app, totes, orders, customer, subscriptionTypes } = state
  return {
    app,
    totes,
    orders,
    customer,
    subscriptionTypes,
    authentication: authentication(customer)
  }
}

export default connect(mapStateToProps)(
  withRouter(WithWechatShare(PopupsHOC(TotesWrapper)))
)
