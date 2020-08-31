import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import StyleContainer from 'src/app/containers/onboarding/style/index'
import 'src/app/containers/onboarding/index.scss'

class ProfileStyleContainer extends React.PureComponent {
  render() {
    return (
      <div>
        <StyleContainer
          helmetTitle="喜欢"
          helmetLink="/style_profile/style"
          submitSuccess={browserHistory.goBack}
          isStyleProfile={true}
          {...this.props}
        />
      </div>
    )
  }
}

ProfileStyleContainer.propTypes = {
  customer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    onboarding: state.onboarding || {},
    customer: state.customer || {}
  }
}

export default connect(mapStateToProps)(ProfileStyleContainer)
