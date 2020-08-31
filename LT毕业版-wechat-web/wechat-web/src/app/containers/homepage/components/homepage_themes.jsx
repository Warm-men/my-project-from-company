import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import Title from './../title'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import * as storage from 'src/app/lib/storage.js'
import { addDays, format } from 'date-fns'
import { placeholder_690_279 } from 'src/assets/placeholder'
import AddToClosetButton from 'src/app/components/shared/add_to_closet_redux_button'
import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'
import { Column } from 'src/app/constants/column'

import { FETCH_PRODUCT_SORT_CONFIG_MAP } from '../../../constants/fetchproductconfig'

class HomepageThemes extends React.Component {
  constructor() {
    super()
    this.getReportData = {
      filter_and_sort: storage.get('filters'),
      router: '/',
      column_name: 'NewArrivalCollection',
      page_type: 'list'
    }
  }

  componentDidMount() {
    _.isEmpty(this.props.newArrival) && this.getHomepageNewArrival()
  }

  getHomepageNewArrival = () => {
    this.props.dispatch(
      Actions.homepage.fetchHomepageNewArrival(this.getHomepageNewProducts)
    )
  }

  getHomepageNewProducts = (dispatch, res) => {
    const { banner_group } = res.data
    _.map(banner_group.banners, v => {
      let intervals = []
      _.map(v.latest_call_to_actions, v1 => {
        intervals.push({
          since: v1,
          before: format(addDays(v1, 1), 'YYYY-MM-DD')
        })
      })
      this.filters = {
        filters: {
          page: 1,
          per_page: 6,
          activated_date_intervals: intervals,
          sort: FETCH_PRODUCT_SORT_CONFIG_MAP.recentNew,
          at_least_one_size_in_stock: true
        },
        filter_terms: ['clothing']
      }
      // NOTE: fix goback data
      storage.set('filters', JSON.stringify(this.filters))
      dispatch(Actions.homepage.fetchHomepageNewProducts(this.filters))
      return null
    })
  }

  onClick = () => {
    storage.set('new_product_scroll_top', true)
    const pathname = `/new_product`
    sessionStorage.setItem(pathname, 0)

    const column = Column.NewArrivalCollection
    browserHistory.push({ pathname, query: { column } })
  }

  gotoProductDetail = product => {
    const img = product.catalogue_photos[0].full_url
    window.adhoc('track', 'enter_product_detail_v2', 1)
    browserHistory.push({
      pathname: `/products/${parseInt(product.id, 10)}`,
      state: {
        img_url: img,
        column_name: this.getReportData.column_name,
        product
      }
    })
  }

  toggleCloset = (id, reportData) => {
    const inCloset = _.includes(this.props.closetProductIds, id)
    if (inCloset) {
      this.props.dispatch(Actions.closet.remove([id]))
    } else {
      window.adhoc('track', 'add_closet_v2', 1)
      this.props.dispatch(Actions.closet.add([id], reportData))
    }
  }

  render() {
    const { newProducts, newArrival, closetProductIds } = this.props
    if (_.isEmpty(newArrival)) {
      return null
    }
    const arrival = newArrival[0]
    return (
      <div className="homepage-products-list">
        <Title title="近期上架" title_content="NEW ARRIVAL" />
        <div className="products-box">
          <div
            className={`products-list ${arrival.logo ? '' : 'clear-padding'}`}
            onClick={this.handleSensors}
          >
            {_.map(newProducts, (v, k) => (
              <div className="new-product-img" key={k} onClick={this.onClick}>
                <ProgressiveImage
                  src={v.catalogue_photos[0].medium_url}
                  placeholder={placeholder_690_279}
                >
                  {image => <img alt="" src={image} />}
                </ProgressiveImage>
                <AddToClosetButton
                  inCloset={_.includes(closetProductIds, v.id)}
                  toggleCloset={e => {
                    e.stopPropagation()
                    this.toggleCloset(v.id, {
                      ...this.props.getReportData,
                      index: k + 1
                    })
                  }}
                />
                {v.tote_slot > 1 && (
                  <div className="products-both-slot">
                    <ToteSlotIcon slot={v.tote_slot} type={v.type} />
                  </div>
                )}
              </div>
            ))}
            <img
              onClick={this.onClick}
              className="share-more-img"
              src={require('../images/more.png')}
              alt="more"
            />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { homepage, closet } = state
  return {
    newArrival: homepage.newArrival,
    newProducts: homepage.newProducts,
    closetProductIds: closet.productIds
  }
}

export default connect(mapStateToProps)(withRouter(HomepageThemes))
