import PreventScroll from '../PreventScroll'
import Actions from 'src/app/actions/actions'
import { browserHistory } from 'react-router'
import authentication from 'src/app/lib/authentication.js'
import './index.scss'

export default WrappedComponent =>
  class extends React.Component {
    state = {
      abtestVar: false
    }

    componentWillMount() {
      const {
        app: { popups },
        dispatch,
        location: { pathname },
        customer
      } = this.props
      if (_.isEmpty(popups)) dispatch(Actions.app.popupsAction())
      // NOTE:  非会员首页
      if (
        (pathname === '/home' || pathname === '/') &&
        !authentication(customer).isSubscriber
      ) {
        window.adhoc('getFlags', flag => {
          this.setState({
            abtestVar: flag.get('D181128_WECHAT_NEW_499_ALL_V2')
          })
        })
      }
    }

    componentDidMount() {
      if (authentication(this.props.customer).isSubscriber) {
        this.setState({
          abtestVar: true
        })
      }
    }

    componentWillReceiveProps(nextProps) {
      if (!_.isEqual(this.props.app.popups, nextProps.app.popups)) {
        if (!_.isEmpty(nextProps.app.popups)) {
          this.validPopups(nextProps)
        }
      }

      if (!_.isEqual(this.props.customer, nextProps.customer)) {
        if (!_.isEmpty(nextProps.app.popups)) {
          this.validPopups(nextProps)
        }
      }
    }

    validPopups = nextProps => {
      const {
          app: { popups, isWechat },
          customer: { id },
          location: { pathname },
          dispatch
        } = nextProps,
        routes = popups[0].routes.map(item => item.toLowerCase()),
        matchPopups =
          _.isEmpty(routes) ||
          _.includes(routes, pathname.split('/')[1]) ||
          (_.includes(routes, 'home') && pathname === '/')
      this.isMatchPath = isWechat
        ? !!id && matchPopups //NOTE: 微信非登录环境不弹框
        : matchPopups
      if (this.state.abtestVar && this.isMatchPath) {
        dispatch(Actions.app.markPopups(parseInt(popups[0].id, 10)))
      }
    }

    closePopups = () => {
      this.props.dispatch(Actions.app.closePopups())
    }

    goToNextPage = () => {
      const url = this.props.app.popups[0].url
      this.closePopups()
      if (url.match('https:')) {
        window.location.href = url
        return null
      }
      browserHistory.push(url)
    }

    render() {
      const {
        app: { popups, isClosePopups }
      } = this.props
      return (
        <div className="popups">
          {!isClosePopups && this.state.abtestVar && this.isMatchPath ? (
            <Popups
              goToNextPage={this.goToNextPage}
              closePopups={this.closePopups}
              popups={popups[0]}
            />
          ) : null}
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }

const Popups = PreventScroll(({ closePopups, popups, goToNextPage }) => {
  const styles = {
    width: popups.image_width / 2,
    height: popups.image_height / 2
  }
  return (
    <div className="popups-alert">
      <div className="image-popups" style={styles}>
        <i className="close-popups" onClick={closePopups} />
        <img src={popups.image} alt="popups" style={styles} />
        <div className="btn-popups" onClick={goToNextPage} />
      </div>
    </div>
  )
})
