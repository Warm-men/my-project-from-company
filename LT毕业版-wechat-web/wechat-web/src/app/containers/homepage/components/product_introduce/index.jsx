import React from 'react'
import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
import ActionButton from 'src/app/components/shared/action_button'
import authentication from 'src/app/lib/authentication'
import './index.scss'

const getState = state => {
  const { customer } = state
  return {
    authentication: authentication(customer)
  }
}

export default connect(getState)(({ authentication }) => {
  return (
    <div className="product-introduce">
      <PageHelmet title="Le Tote 托特衣箱" link={'/open/product_intro'} />
      <div className="banner" />
      <div className="why-select" />
      <div className="play_letote" />
      <div className="wash" />
      {!authentication.isSubscriber && (
        <div>
          <p className="join-us">托特衣箱，为你开启百变时尚之旅！</p>
          <ActionButton className="btn-ju" to="/plans?next_page=authorize">
            立即加入
          </ActionButton>
        </div>
      )}
    </div>
  )
})
