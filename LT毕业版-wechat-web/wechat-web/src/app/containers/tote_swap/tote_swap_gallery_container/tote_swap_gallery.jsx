import ResponsiveInfiniteScroll from 'src/app/components/shared/responsive_infinite_scroll'
import { browserHistory, Link } from 'react-router'
import Product from './tote_swap_gallery_product'
import FilterModal from '../tote_swap_filter_modal'
import Row from 'src/app/components/bootstrap/row.jsx'
import Col from 'src/app/components/bootstrap/col.jsx'
import ProductsLoading from 'src/app/containers/products/products_loading/index'
import ProductsNomore from 'src/app/containers/products/products_nomore/index'
import PageHelmet from 'src/app/lib/pagehelmet'
import LoadingIndicator from 'src/app/containers/browse_collection/loading_indicator'
import ProductsEmpty from 'src/app/containers/products/products_closet_empty'
import scrollTopAnimation from 'src/app/lib/request_animation_frame.js'
import 'src/assets/stylesheets/components/desktop/tote_swap/gallery.scss'
import 'src/assets/stylesheets/components/buttons/corporation_button.scss'
//NOTE:超过多少row才显示ProductsNomore
const showNomoreRows = 2

export default class ToteSwapGallery extends React.PureComponent {
  render() {
    const {
        primaryGallery,
        gallery,
        filters,
        more,
        location,
        router: {
          location: { state }
        },
        loading,
        isInCloset,
        showFilterModal,
        fetchProducts,
        clearProducts,
        handleGoback,
        iscollectionsList,
        analyzeSlug,
        changeAnalyzeSlug,
        isHideHelmet,
        customer,
        isVacation
      } = this.props,
      primaryRows = _.chunk(primaryGallery, 2),
      referredByTotesPreview = state && state.referredByTotesPreview
    const isAllLoaded = !loading && !more
    const isEmpty = isAllLoaded && primaryGallery && primaryGallery.length === 0
    const isHadFilter =
      !_.isEmpty(_.without(filters.filter_terms, gallery)) ||
      !_.isEmpty(filters.colors)
    const isCollections = gallery === 'collections'
    let column_name =
      gallery === 'clothing'
        ? 'ToteSwapClothing'
        : gallery === 'accessories'
        ? 'ToteSwapAccessory'
        : ''
    if (analyzeSlug) {
      column_name = analyzeSlug
    }
    changeAnalyzeSlug && changeAnalyzeSlug(column_name)
    const isMemberships = !!(customer.subscription && customer.subscription.id)
    const url = isMemberships ? '/new_totes' : '/home'
    const closeText = isVacation ? '结束换装' : '关闭'
    return (
      <div className="tote-swap-products-container">
        {!isHideHelmet && (
          <PageHelmet title="帮我推荐" link={location.pathname} />
        )}
        {!referredByTotesPreview && !isCollections && (
          <div className="corporation-btn-container">
            {(isHadFilter || !isEmpty) && (
              <span onClick={showFilterModal} className="corporation-btn">
                筛选
              </span>
            )}
            <Link to={url} onClick={clearProducts} className="corporation-btn">
              <span className="corporation-btn-text">{closeText}</span>
            </Link>
          </div>
        )}
        {isCollections ? (
          iscollectionsList ? (
            <div
              onClick={handleGoback}
              className="collections-btn-container goback"
            >
              <span className="collections-btn">返回</span>
            </div>
          ) : (
            <div
              onClick={() => browserHistory.push(url)}
              className="collections-btn-container"
            >
              <span className="collections-btn">
                <p style={{ marginTop: 5 }}>结束</p>
                <p>换装</p>
              </span>
            </div>
          )
        ) : null}
        {isCollections && (
          <div
            className="fixed-button scroll-to-top"
            onClick={scrollTopAnimation(6)}
          >
            <img src={require('src/assets/images/top_arrow.svg')} alt="top" />
          </div>
        )}
        <div id="tote-swap-gallery">
          {isEmpty && (
            <ProductsEmpty
              dispatch={this.props.dispatch}
              productsEmptyText={
                isHadFilter
                  ? '没有结果，请调整筛选条件'
                  : isInCloset
                  ? '还没有收藏服饰哦'
                  : '还没有服饰哦'
              }
              isFromSwap={isVacation}
              showButton={false}
            />
          )}
          <ResponsiveInfiniteScroll
            onScrollToBottom={fetchProducts}
            isLoading={loading}
            isMore={more}
          >
            {_.map(primaryRows, (row, index) => (
              <Row className="tote-swap-gallery-row" key={index}>
                {_.map(row, (product, product_index) => (
                  <Col className="col-sm-3 col-6" key={product.id}>
                    <Product
                      product={product}
                      getReportData={{
                        filter_and_sort: JSON.stringify({
                          ...this.props.filters
                        }),
                        router: this.props.location.pathname,
                        column_name: column_name,
                        page_type: 'list',
                        index: product_index
                          ? (index + 1) * 2
                          : (index + 1) * 2 - 1
                      }}
                      toggleCloset={this.props.toggleCloset}
                      closetProductIds={this.props.closetProductIds}
                      tote={this.props.tote}
                      module={gallery}
                      {...this.props}
                    />
                  </Col>
                ))}
              </Row>
            ))}
            {loading ? (
              filters.primaryPage === 1 ? (
                <LoadingIndicator isMobile={true} />
              ) : (
                <ProductsLoading />
              )
            ) : (
              isAllLoaded &&
              !isCollections &&
              primaryRows.length > showNomoreRows && <ProductsNomore />
            )}
          </ResponsiveInfiniteScroll>
        </div>
        <div className="filter-modal">
          {this.props.filterModalOpen && (
            <FilterModal {...this.props} isMobile={true} />
          )}
        </div>
      </div>
    )
  }
}
