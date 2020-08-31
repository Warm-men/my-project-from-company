import { withRouter } from 'react-router'
import Actions from 'src/app/actions/actions'
import { Column } from 'src/app/constants/column'
import { APPStatisticManager } from '../../../lib/statistics/app'

@withRouter
export default class OtherHomepageBrand extends React.Component {
  gotoAllbrands = () => this.props.router.push('/brands')

  gotBrand = async (e, pathname) => {
    APPStatisticManager.onRouterLeaveBefore({ element: e.target })
    const { dispatch, router } = this.props
    await dispatch(Actions.allproducts.clearProducts(pathname))
    const column = Column.Brand
    router.push({ pathname, query: { column } })
  }

  render() {
    const { brands } = this.props
    const newArr = _.chunk(brands, 3)
    return (
      <div className="other-homepage-brand">
        <div className="title-box">
          <div className="title">
            <span className="title-border" />
            <span className="title-text">精选品牌</span>
            <span className="title-border" />
          </div>
        </div>
        <div className="other-homepage-brand-box">
          {_.map(newArr, (list, key) => {
            return (
              <div className="brands-container" key={key}>
                {_.map(list, (item, index) => {
                  return (
                    <img
                      className="brand-img"
                      src={item.image_url}
                      key={index}
                      alt=""
                      onClick={e => this.gotBrand(e, item.link)}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
        <span onClick={this.gotoAllbrands} className="check-brands-btn">
          查看全部品牌
        </span>
      </div>
    )
  }
}
