import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Membership from './membership.jsx'
import authentication from 'src/app/lib/authentication'
import GeneralWxShareHOC from 'src/app/components/HOC/GeneralWxShare'
import { useEffect } from 'react'
import 'src/assets/stylesheets/components/profile.scss'

function mapStateToProps(state) {
  return {
    customer: state.customer,
    isSubmitting: state.app.subscription.isSubmitting,
    authentication: authentication(state.customer),
    isWechat: state.app.isWechat
  }
}

function MembershipContainer(props) {
  useEffect(() => {
    if (props.authentication.isExpiredSubscriber) {
      props.router.replace(`/membershipexpired`)
    }
  }, [props.authentication.isExpiredSubscriber])

  const {
    subscription: {
      display_name,
      subscription_type: { interval, days_interval }
    }
  } = props.customer
  return (
    <Membership
      {...props}
      display_name={display_name}
      interval={interval}
      days_interval={days_interval}
      isSubmitting={props.isSubmitting}
    />
  )
}

export default connect(mapStateToProps)(
  withRouter(GeneralWxShareHOC(MembershipContainer))
)
