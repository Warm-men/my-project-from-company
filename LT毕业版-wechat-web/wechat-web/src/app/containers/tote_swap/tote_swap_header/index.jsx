import { Link } from 'react-router'
import 'src/assets/stylesheets/components/desktop/tote_swap/header.scss'

const title = {
  vacation: '度假',
  closet: '愿望衣橱',
  collections: '精选'
}

const otherHeader = props => {
  return props.header.length === 1 ? null : (
    <div className="swap-header-padding">
      <div className={`tote-swap-header ${props.scrolled ? 'scrolled' : ''}`}>
        <div id="tote-swap-navigation">
          <div id="tab-bar" className="tab-scroll-container">
            {_.map(props.header, (v, k) => (
              <Link
                key={k}
                className="tab"
                activeClassName="active"
                to={`/customize/${v}`}
              >
                {title[v]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const defaultHeader = props => {
  return (
    <div className="swap-header-padding">
      <div className={`tote-swap-header ${props.scrolled ? 'scrolled' : ''}`}>
        <div id="tote-swap-navigation">
          <div id="tab-bar" className="tab-scroll-container">
            {props.isVacation && (
              <Link
                className="tab"
                activeClassName="active"
                to="/customize/vacation"
              >
                度假
              </Link>
            )}
            <Link
              className="tab"
              activeClassName="active"
              to="/customize/collections"
            >
              精选
            </Link>
            <Link
              className="tab"
              activeClassName="active"
              to={{
                pathname: '/customize/closet',
                query: { filter_terms: 'clothing' }
              }}
            >
              愿望衣橱
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const SwapHeader = props =>
  _.isEmpty(props.header) ? defaultHeader(props) : otherHeader(props)

export default React.memo(SwapHeader)
