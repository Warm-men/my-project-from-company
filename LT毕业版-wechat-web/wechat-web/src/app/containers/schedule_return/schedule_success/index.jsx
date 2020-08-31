import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import authentication from 'src/app/lib/authentication'
import Actions from 'src/app/actions/actions.js'
import '../../plans/index.scss'
import PageHelmet from 'src/app/lib/pagehelmet'

class ScheduleSuccess extends Component {
  componentWillMount() {
    this.props.dispatch(
      Actions.totes.fetchLatestRentalAndPurchaseTote(
        this.props.dispatch(Actions.totes.fetchPastTotes(1))
      )
    )
  }

  reAppointmentSuccess = () => {
    return (
      <div className="plans-success">
        <PageHelmet title="预约结果" link="/schedule_return_success" />
        <div className="plans-image" />
        <p className="plans-text">预约归还成功</p>
        <Link className="plans-renew-btn" to="/totes">
          返回衣箱
        </Link>
      </div>
    )
  }

  render() {
    const {
      router: { location },
      customer,
      authentication
    } = this.props
    const buttonText =
      (customer.subscription && customer.subscription.on_hold) ||
      authentication.isExpiredSubscriber ||
      customer.isFreeUser ||
      customer.isFreeTote79
        ? '返回'
        : '开启下一个衣箱'

    return location.state.isReAppointment ? (
      this.reAppointmentSuccess()
    ) : (
      <MakeAppointment
        title="预约结果"
        tips="你已成功预约"
        linkUrl="/totes"
        buttonText={buttonText}
      />
    )
  }
}

export const MakeAppointment = ({ title, tips, linkUrl, buttonText }) => (
  <div className="plans-success">
    <PageHelmet title={title} link="/schedule_return_success" />
    <div className="plans-image" />
    <p className="plans-text">{tips}</p>
    <Link className="plans-success-btn" to={linkUrl}>
      {buttonText}
    </Link>
  </div>
)

const getState = state => ({
  customer: state.customer,
  authentication: authentication(state.customer)
})

export default connect(getState)(ScheduleSuccess)
