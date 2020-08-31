import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './index.scss'

function OnboardingContainer(props) {
  const { customer, children, location } = props
  if (!location.pathname.match('signin')) {
    if (_.isEmpty(customer) || _.isEmpty(customer.id)) {
      return null
    }
  }
  return <div className="onboarding-container forward">{children}</div>
}

OnboardingContainer.propTypes = {
  customer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    onboarding: state.onboarding || {},
    customer: state.customer || {}
  }
}

export default connect(mapStateToProps)(OnboardingContainer)
