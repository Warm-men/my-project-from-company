import { withRouter } from 'react-router'
import Actions from 'src/app/actions/actions'
import * as storage from 'src/app/lib/storage.js'
import { Column } from 'src/app/constants/column'
import { APPStatisticManager } from '../../../lib/statistics/app'

@withRouter
export default class HomepagePlay extends React.PureComponent {
  linkToOccasionDetail = async (e, pathname) => {
    APPStatisticManager.onClickElement({ element: e.target })
    storage.set('occasion_scroll_top', true)
    sessionStorage.setItem(pathname, 0)
    const { dispatch, router } = this.props
    await dispatch(Actions.allproducts.clearProducts(pathname))
    const column = Column.OccasionCollection
    router.push({ pathname, query: { column } })
  }

  render() {
    const item = _.chunk(this.props.occasion, 3)
    return (
      <div className="other-homepage-occasion">
        <div className="title-box">
          <div className="title">
            <span className="title-border" />
            <span className="title-text">场景风格</span>
            <span className="title-border" />
          </div>
        </div>
        <div className="other-occasion-container">
          {_.map(item, (value, key) => {
            return (
              <div className="occasion-box" key={key}>
                {_.map(value, (v, k) => {
                  return (
                    <div key={k} className="img-box">
                      <img
                        onClick={e => this.linkToOccasionDetail(e, v.link)}
                        className="play-img"
                        alt=""
                        src={v.image_url}
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
