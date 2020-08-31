import React, { Component, lazy } from 'react'
import { connect } from 'react-redux'
import authentication from 'src/app/lib/authentication'
import Actions from 'src/app/actions/actions'
import * as storage from 'src/app/lib/storage.js'
import LoadingViewContainer from 'src/app/components/LoadingViewContainer'
const Homepage = lazy(() => import('./homepage.jsx'))
const NonMemberHomepage = lazy(() => import('./non_member_homepage.jsx'))

function mapStateToProps(state) {
  return {
    customer: state.customer,
    authentication: authentication(state.customer),
    floatHover: state.homepage.floatHover
  }
}
@connect(mapStateToProps)
export default class HomepageContainer extends Component {
  constructor() {
    super()
    // NOTE：1为默认版本，2为无Banner滚动版本
    this.state = {
      // isDefault: 'empty',
      displayOrder: '12345', // NOTE：1活动专区、2全新的时尚体验方式、3分类、4精选品牌、5场景风格
      icon_opacity: 0,
      firstToteAbtestVar: 0,
      customerPhotosFloatHover: null
    }
    this.viewportH = 0
    this.scrollTop = 0
  }

  componentDidMount() {
    this.initHomepgae()
    this.viewportH = window.innerHeight || document.documentElement.clientHeight
    window.addEventListener('scroll', this.scrollHandler)

    const { dispatch, authentication } = this.props
    if (!authentication.isSubscriber) {
      this.getFloatHover()
    }
    dispatch(Actions.allproducts.resetFilters())
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler)
  }

  getFloatHover = () => {
    const { dispatch } = this.props
    const variables = { name: 'floathover' }
    dispatch(Actions.homepage.fetchHomepageGroup('API:FLOAT:HOVER', variables))
  }

  scrollHandler = () => {
    this.scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop
    const differeceTop = this.scrollTop - this.viewportH + 50
    const icon_opacity =
      differeceTop <= 0 ? 0 : differeceTop / 100 <= 1 ? differeceTop / 100 : 1
    this.setState({ icon_opacity })
  }

  initHomepgae = async () => {
    const {
      authentication: { isSubscriber }
    } = this.props
    const isGetOther = storage.get('isOtherHomepage')
    if (isGetOther && isSubscriber) {
      await this.props.dispatch(Actions.homepage.resetHomepage())
      storage.remove('isOtherHomepage')
    }
    if (!isSubscriber) {
      if (!isGetOther) {
        storage.set('isOtherHomepage', true)
      }
      window.adhoc('getFlags', flag => {
        this.setState({
          displayOrder: flag.get('D181214_WECHAT_HOMEPAGE_DISPLAYORDER'),
          firstToteAbtestVar: flag.get('D181212_WECHAT_NEW_ALL_ALL_ALL_1')
        })
      })
    }
  }

  clickFloatIcon = () => {
    const link = this.props.floatHover[0].link
    if (link) window.location.href = link
  }

  render() {
    const { displayOrder, icon_opacity, firstToteAbtestVar } = this.state
    const { authentication, floatHover, customer } = this.props
    if (!customer.id) return <LoadingViewContainer />
    if (!authentication.isSubscriber) {
      return (
        <>
          <NonMemberHomepage
            displayOrder={displayOrder}
            firstToteAbtestVar={firstToteAbtestVar}
          />
          <FloatHover
            data={floatHover}
            onClick={this.clickFloatIcon}
            opacity={icon_opacity}
          />
        </>
      )
    } else {
      return <Homepage />
    }
  }
}

export const FloatHover = ({ onClick, opacity, data }) => {
  if (!_.isEmpty(data)) {
    const logo = data[0] && data[0].logo
    return (
      <img
        src={logo}
        alt="new-gift"
        style={{ opacity, display: opacity === 0 ? 'none' : 'inline' }}
        className="new-gift"
        onClick={onClick}
      />
    )
  } else {
    return null
  }
}
