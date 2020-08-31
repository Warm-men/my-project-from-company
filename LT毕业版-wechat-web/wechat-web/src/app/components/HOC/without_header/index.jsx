import Actions from 'src/app/actions/actions'
import PropTypes from 'prop-types'

const withoutHeader = WrappedComponent => {
  class DisabledHeaderComponent extends React.Component {
    componentDidMount() {
      this.props.dispatch(Actions.navigation.disableHeader())
    }

    componentWillUnmount() {
      this.props.dispatch(Actions.navigation.enableHeader())
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  DisabledHeaderComponent.propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  return DisabledHeaderComponent
}

export default withoutHeader
