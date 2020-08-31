import PropTypes from 'prop-types'
import SizingButton from './sizing_button_v2'
import SizingWarn from './sizing_warn'
import RecommendProducts from 'src/app/containers/product/recommend_products'
import ProductDetails from 'src/app/containers/product/product_detail'
import Col from 'src/app/components/bootstrap/col.jsx'
import { browserHistory } from 'react-router'
import next from 'src/assets/images/arrow-size.png'
import 'src/assets/stylesheets/components/desktop/product/description_and_sizing.scss'
import FreeService from 'src/app/containers/product/product_freeservice'

export default function DescriptionAndSizing(props) {
  const {
    app,
    style,
    product,
    customer,
    isClothing,
    isSwapModal,
    setSelectedSize,
    selectedSizeName,
    linkToSelectSize,
    realtimeProductRecommended
  } = props

  const setSizeInfo = size => {
    return !size ? null : size.length === 1 ? size[0] : size[1]
  }

  const handleSizeTable = () => {
    if (!product.product_sizes) return

    browserHistory.push({
      pathname: '/product_size_chart',
      state: {
        id: product.id,
        isToteSwap: false,
        redirectUrl: window.location.pathname
      }
    })
  }

  const getHasSizeInfo = style => {
    if (_.isEmpty(style)) return false
    const { height_inches, weight, bra_size, bust_size_number } = style
    return !!(height_inches && weight && (bra_size || bust_size_number))
  }

  let { recommended_size } = product
  const selectedSize = _(product.product_sizes).find(
    ({ size }) => size.name === selectedSizeName
  )

  const hasSizeInfo = getHasSizeInfo(style)
  const wrapperViewStyle = isSwapModal
    ? 'description-and-sizing fix-margin'
    : 'description-and-sizing'
  const sizingButtonsView = isSwapModal
    ? 'sizing-buttons fix-sizing-buttons-margin'
    : 'sizing-buttons'

  return (
    <div className={wrapperViewStyle}>
      <Col className="col-sm-6 offset-sm-2 col-xl-4 offset-xl-4 sizes">
        <div className={sizingButtonsView}>
          <div className="sizing-title">
            <div className="size-view">
              {_.map(product.product_sizes, productSize => {
                if (productSize.recommended === true) {
                  recommended_size = productSize.size.abbreviation
                }
                return (
                  <SizingButton
                    key={productSize.size.name}
                    hasSizeInfo={hasSizeInfo}
                    isClothing={isClothing}
                    swappable={!!productSize.swappable}
                    selectedSizeId={selectedSize ? selectedSize.size.id : -1}
                    currentSizeId={productSize.size.id}
                    currentSizeName={productSize.size.name}
                    handleSizeChange={setSelectedSize}
                    recommended_size={recommended_size}
                  />
                )
              })}
            </div>
            {!isSwapModal && isClothing && (
              <div className="size-chart" onClick={handleSizeTable}>
                尺码表
                <img className="product-right-icon" alt="" src={next} />
              </div>
            )}
          </div>
          <SizingWarn
            customer={customer}
            isClothing={isClothing}
            isSwapModal={isSwapModal}
            selectedSize={selectedSize}
            recommended_size={recommended_size}
            hasSizeInfo={hasSizeInfo}
            linkToSelectSize={linkToSelectSize}
            setSizeInfo={setSizeInfo}
            realtimeProductRecommended={realtimeProductRecommended}
          />
        </div>
        {!isSwapModal && (
          <FreeService
            customer={customer}
            isClothing={isClothing}
            isWechat={app && app.isWechat}
          />
        )}
        {!isSwapModal && (
          <RecommendProducts
            products={product.other_products_in_catalog_photos}
          />
        )}
        {!isSwapModal && <ProductDetails product={product} />}
      </Col>
    </div>
  )
}

DescriptionAndSizing.propTypes = {
  product: PropTypes.object.isRequired,
  selectedSizeName: PropTypes.string,
  setSelectedSize: PropTypes.func.isRequired,
  style: PropTypes.object,
  linkToSelectSize: PropTypes.func
}
