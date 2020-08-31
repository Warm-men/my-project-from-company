import React from 'react'
import ProductThumbnail from 'src/app/containers/product/product_in_list.jsx'
import ResponsiveInfiniteScroll from 'src/app/components/shared/responsive_infinite_scroll'
import { addDays } from 'date-fns'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import ProductsLoading from 'src/app/containers/products/products_loading/index.jsx'
import ProductsNomore from 'src/app/containers/products/products_nomore/index.jsx'
import LoadingIndicator from 'src/app/containers/browse_collection/loading_indicator'
import { FETCH_PRODUCT_SORT_CONFIG_MAP } from '../../../constants/fetchproductconfig'

function mapStateToProps(state) {
  const { homepage, closet } = state
  return {
    filters: {
      ...homepage.filters,
      at_least_one_size_in_stock: true,
      sort: FETCH_PRODUCT_SORT_CONFIG_MAP.recentHotAtHomePageBottom
    },
    recentHot: homepage.recentHot,
    recentHotProducts: homepage.recentHotProducts,
    closetProductIds: closet.productIds,
    more: homepage.more,
    loading: homepage.loading
  }
}

@connect(mapStateToProps)
export default class OtherHomepageHot extends React.Component {
  constructor(props) {
    super(props)
    this.showNomoreRows = 2
    this.ACTIVATED_AT_WEEK = 6
    this.state = {
      hotItemVar: null
    }
  }

  componentWillMount() {
    this.fetchProducts()
  }

  fetchProducts = () => {
    let filters = this.props.filters
    this.props.dispatch(Actions.homepage.fetchRecentHot(filters))
  }

  fetchMoreProducts = async () => {
    await this.props.dispatch(
      Actions.homepage.setFilters({
        page: this.props.filters.page + 1
      })
    )
    this.fetchProducts(this.state.hotItemVar)
  }

  toggleCloset = (id, reportData) => {
    const inCloset = _.includes(this.props.closetProductIds, id)
    if (inCloset) {
      this.props.dispatch(Actions.closet.remove([id]))
    } else {
      this.props.dispatch(Actions.closet.add([id], reportData))
    }
  }

  render() {
    const {
      closetProductIds,
      recentHotProducts,
      filters,
      more,
      loading
    } = this.props
    const products = _.chunk(recentHotProducts, 2)
    return (
      <div className="other-homepage-occasion">
        <div className="title-box">
          <div className="title">
            <span className="title-border" />
            <span className="title-text">热门单品</span>
            <span className="title-border" />
          </div>
        </div>
        <div className="other-occasion-container">
          <ResponsiveInfiniteScroll
            onScrollToBottom={this.fetchMoreProducts}
            isLoading={loading}
            isMore={more}
          >
            <div className="products-list">
              {_.map(products, (row, index) => (
                <div className="products-list-row" key={index}>
                  {_.map(row, (product, key) => (
                    <div className="product-box" key={key}>
                      <ProductThumbnail
                        getReportData={{
                          filter_and_sort: JSON.stringify({
                            per_page: 6,
                            sort:
                              FETCH_PRODUCT_SORT_CONFIG_MAP.recentHotAtHomePageBottom,
                            activated_since: addDays(
                              new Date(),
                              -this.ACTIVATED_AT_WEEK * 7
                            )
                          }),
                          router: '/',
                          column_name: 'RecentHotCollection',
                          page_type: 'list'
                        }}
                        toggleCloset={this.toggleCloset}
                        showCloset={true}
                        product={product}
                        closetProductIds={closetProductIds}
                        isHotItem
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {loading ? (
              filters.page === 1 ? (
                <LoadingIndicator isMobile={true} />
              ) : (
                <ProductsLoading />
              )
            ) : (
              more &&
              loading &&
              products.length > this.showNomoreRows && <ProductsNomore />
            )}
          </ResponsiveInfiniteScroll>
        </div>
      </div>
    )
  }
}
