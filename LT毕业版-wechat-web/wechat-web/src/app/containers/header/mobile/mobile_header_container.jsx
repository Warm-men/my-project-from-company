import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import './index.scss'

function mapStateToProps(state) {
  return {
    customer: state.customer,
    showHeader: state.common.showHeader
  }
}

function MobileHeaderContainer(props) {
  if (!props.customer.id) {
    return null
  }
  const navList = [
    {
      router: '/home', //跳转url
      activeUrl: ['/', '/home'], //高亮url
      text: '首页'
    },
    {
      router: '/totes',
      activeUrl: ['/totes'],
      text: '托特衣箱'
    },
    {
      router: '/account',
      activeUrl: ['/account'],
      text: '我的'
    }
  ]

  const handleClick = href => () => props.router.replace(href)

  const getIcons = (path, active) => {
    return require(`./images${path}${active ? '_select' : ''}.svg`)
  }

  const { location, showHeader } = props
  return (
    <div className={`header-nav-bar ${showHeader ? '' : 'hidden'}`}>
      {_.map(navList, ({ activeUrl, router, text }, k) => {
        const selected = _.includes(activeUrl, location.pathname)
        return (
          <span
            className={`nav-link ${selected ? 'selected' : ''}`}
            onClick={handleClick(router)}
            key={k}
          >
            <div className="icon">
              <img src={getIcons(router, selected)} alt="imgs" />
            </div>
            {text}
          </span>
        )
      })}
    </div>
  )
}

export default connect(mapStateToProps)(withRouter(MobileHeaderContainer))
