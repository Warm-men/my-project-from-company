import { chunk } from 'lodash'
import { withRouter } from 'react-router'
import ProductsNomore from '../products_nomore/index'
import ProductsLoading from '../products_loading/index'
import Col from 'src/app/components/bootstrap/col.jsx'
import Row from 'src/app/components/bootstrap/row.jsx'
import ProductThumbnail from 'src/app/containers/product/product_in_list'
import LoadingIndicator from 'src/app/containers/browse_collection/loading_indicator'
import ResponsiveInfiniteScroll from 'src/app/components/shared/responsive_infinite_scroll'
import AddToToteCartHandlerHOC from '../../product/hoc/addto_totecart'
import ToteCartUtil from '../../tote_swap/new_tote_swap_modal/utils/tote_cart_util'

export class ProductsScrollListComponent extends React.Component {
  //NOTE:超过多少row才显示ProductsNomore
  static SHOW_NOMORE_ROWS = 2
  /**
   * 数据映射方法
   *
   * @memberof ProductsScrollListComponent
   */
  static mapPropsFromContainerProps(props, showProduct, getProductById) {
    const {
      more,
      route,
      filters,
      loading,
      products,
      isCloset,
      tote_cart,
      isShowCart,
      routeParams,
      isShowStock,
      toggleCloset,
      fetchProducts,
      closetProductIds,
      customerSignedIn,
      isShowSeasonSample,
      location: { pathname, query }
    } = props
    const columnName = query ? query.column : null
    return {
      tote_cart,
      customerSignedIn,
      product: showProduct,
      getProductById: getProductById,
      more,
      route,
      loading,
      filters,
      products,
      isCloset,
      pathname,
      columnName,
      isShowCart,
      isShowStock,
      fetchProducts,
      isShowSeasonSample,
      productProps: {
        toggleCloset,
        closetProductIds,
        routeParams
      }
    }
  }

  constructor(props) {
    super(props)
    this.productsRows = chunk(props.products, 2)
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.products !== nextProps.products) {
      // 更新关联数据
      this.productsRows = chunk(nextProps.products, 2)
    }
    return true
  }

  handleClickAddToToteCart = async id => {
    const product = await this.props.getProductById(id)
    if (product) {
      const { tote_cart, selectSizeObject } = this.props
      const sizeId = (selectSizeObject && selectSizeObject.id) || null
      const validatorType = ToteCartUtil.ToteCartValidatorType
      ToteCartUtil.productAddToToteCartValidator(
        sizeId,
        product,
        tote_cart
      ).excuteStream([
        {
          id: validatorType.isInToteCart,
          onTrue: () => {
            return false
          },
          onFalse: () => {
            this.props.handleAddToCart(sizeId, product, tote_cart)
            return true
          }
        }
      ])
    }
  }

  render() {
    const {
      more,
      filters,
      loading,
      isCloset,
      pathname,
      columnName,
      isShowCart,
      isShowStock,
      productProps,
      fetchProducts,
      activated_since,
      customerSignedIn,
      isShowSeasonSample
    } = this.props

    const isAllLoaded = !loading && !more
    return (
      <div className="products-collection">
        {!_.isEmpty(this.productsRows) && (
          <ResponsiveInfiniteScroll
            isMore={more}
            isLoading={loading}
            onScrollToBottom={fetchProducts}
          >
            {_.map(this.productsRows, (row, index) => {
              return (
                <Row className="browse-collection-row" key={index}>
                  {_.map(row, (_product, i) => (
                    <Col className="col-sm-3 col-6" key={_product.id}>
                      <ProductThumbnail
                        {...productProps}
                        product={_product}
                        isCloset={isCloset}
                        isShowCart={isShowCart}
                        isShowStock={isShowStock}
                        showCloset={customerSignedIn}
                        isShowSeasonSample={isShowSeasonSample}
                        onClickAddToToteCart={this.handleClickAddToToteCart}
                        getReportData={{
                          filter_and_sort: activated_since
                            ? JSON.stringify({ ...filters, activated_since })
                            : JSON.stringify({ ...filters }),
                          router: pathname,
                          page_type: 'list',
                          column_name: columnName,
                          index: i ? (index + 1) * 2 : (index + 1) * 2 - 1
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              )
            })}
            {loading ? (
              filters.page === 1 ? (
                <LoadingIndicator isMobile={true} />
              ) : (
                <ProductsLoading />
              )
            ) : (
              isAllLoaded &&
              this.productsRows.length >
                ProductsScrollListComponent.SHOW_NOMORE_ROWS && (
                <ProductsNomore />
              )
            )}
          </ResponsiveInfiniteScroll>
        )}
        {isAllLoaded && this.productsRows.length === 0 && (
          <div>
            <div className="empty-products" />
            <p className="empty-products-content">
              {this.props.productsEmptyText || '暂时还没有此类产品哦'}
            </p>
          </div>
        )}
      </div>
    )
  }
}

const ProductScrollList = withRouter(
  AddToToteCartHandlerHOC(ProductsScrollListComponent)
)

export default ProductScrollList
