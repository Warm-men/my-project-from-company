import { PureComponent } from 'react'
import { GET, SERVICE_TYPES } from '../src/expand/services/services'

export default class ErrorBoundary extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false
    }
  }

  componentDidCatch(error, info) {
    GET(
      SERVICE_TYPES.common.FETCH_ERROR_MESSAGE,
      { stack: encodeURIComponent(JSON.stringify(info)) },
      () => {},
      () => {}
    )
    this.setState({ hasError: true })
  }

  render() {
    // if (this.state.hasError) {
    //   return (
    //   <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}} ><Text>123123123</Text></View>
    // )
    // }
    return this.props.children
  }
}
