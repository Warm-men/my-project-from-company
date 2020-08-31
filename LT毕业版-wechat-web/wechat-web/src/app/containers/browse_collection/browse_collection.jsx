import 'src/assets/stylesheets/components/desktop/browse_collection/browse_collection.scss'
import PageHelmet from 'src/app/lib/pagehelmet'
import { IndexLink, browserHistory } from 'react-router'
import ProductThumbnail from 'src/app/containers/browse_collection/product_thumbnail'
import Container from 'src/app/components/bootstrap/container.jsx'
import Row from 'src/app/components/bootstrap/row.jsx'
import Col from 'src/app/components/bootstrap/col.jsx'
import ResponsiveInfiniteScroll from 'src/app/components/shared/responsive_infinite_scroll'
import LoadingIndicator from 'src/app/containers/browse_collection/loading_indicator'
import { placeholder_690_279 } from 'src/assets/placeholder'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import topArrow from 'src/assets/images/top_arrow.svg'
import DescriptionText from 'src/app/containers/products/components/description'
import ProductsLoading from 'src/app/containers/products/products_loading/index'
import ProductsNomore from 'src/app/containers/products/products_nomore/index'
import scrollTopAnimation from 'src/app/lib/request_animation_frame.js'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'

export default class BrowseCollection extends React.Component {
  constructor(props) {
    super(props)
    //NOTE:超过多少row才显示ProductsNomore
    this.showNomoreRows = 2
  }

  handleUrl = url => () => {
    const link = _.split(url, 'letote.cn')
    browserHistory.push(link[1])
  }

  render() {
    const {
      products,
      slug,
      toggleCloset,
      closetProductIds,
      filters,
      customerSignedIn,
      collection,
      loading,
      location,
      more,
      mini_share,
      authentication: { isSubscriber },
      miniAppShareUrl
    } = this.props
    const { btn, url } = this.props.location.query
    const rows = _.chunk(products, 2),
      productProps = { slug, toggleCloset, closetProductIds, location }
    const isAllLoaded = !loading && !more
    const isLoading = loading
    return (
      <div>
        {collection && (
          <PageHelmet
            title={collection.title}
            link={`/collections/${collection.id}`}
            shareUrl={
              miniAppShareUrl
                ? miniAppShareUrl
                : mini_share
                ? mini_share.link
                : ''
            }
            shareTitle={mini_share.title}
            shareImg={mini_share.imgUrl}
          />
        )}
        <div id="browse-collection">
          <Container>
            <Row>
              {collection && (
                <ProgressiveImage
                  src={collection.banner_photo_wide_banner_url}
                  placeholder={placeholder_690_279}
                >
                  {image => <img alt="" className="header-image" src={image} />}
                </ProgressiveImage>
              )}
              {collection && collection.full_description && (
                <DescriptionText text={collection.full_description} />
              )}
            </Row>
          </Container>
          <IndexLink to="/">
            <div className="fixed-button back">首页</div>
          </IndexLink>
          <div
            className="fixed-button scroll-to-top"
            onClick={scrollTopAnimation(6)}
          >
            <img src={topArrow} alt="top" />
          </div>
          <div>
            <ResponsiveInfiniteScroll
              className={`browse-collection-content ${
                !_.isEmpty(btn) ? 'had-btn' : ''
              }`}
              onScrollToBottom={this.props.fetchProducts}
              isLoading={loading}
              isMore={more}
            >
              {_.map(rows, (row, index) => (
                <Row className="browse-collection-row" key={index}>
                  {_.map(row, (product, product_index) => (
                    <Col className="col-sm-3 col-6" key={product.id}>
                      <ProductThumbnail
                        getReportData={{
                          filter_and_sort: JSON.stringify(filters),
                          router: location.pathname,
                          column_name: 'Collection',
                          page_type: 'list',
                          index: product_index
                            ? (index + 1) * 2
                            : (index + 1) * 2 - 1
                        }}
                        {...productProps}
                        product={product}
                        showCloset={customerSignedIn}
                        isSubscriber={isSubscriber}
                      />
                    </Col>
                  ))}
                </Row>
              ))}
              {isLoading ? (
                !filters.page ? (
                  <LoadingIndicator isMobile={true} />
                ) : (
                  <ProductsLoading />
                )
              ) : (
                isAllLoaded &&
                rows.length > this.showNomoreRows && <ProductsNomore />
              )}
            </ResponsiveInfiniteScroll>
          </div>
        </div>
        {!_.isEmpty(btn) && (
          <StickyButtonContainer isSingle={true}>
            <ActionButton
              className="left-btn"
              onClick={this.handleUrl(url)}
              size="stretch"
            >
              {btn}
            </ActionButton>
          </StickyButtonContainer>
        )}
        {this.props.children}
      </div>
    )
  }
}
