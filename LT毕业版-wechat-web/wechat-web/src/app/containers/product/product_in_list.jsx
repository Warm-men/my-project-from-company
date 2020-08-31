import { browserHistory, withRouter } from 'react-router'
import AddToClosetButton from 'src/app/components/shared/add_to_closet_redux_button'
import RectangleLoader from 'src/app/containers/tote_swap/rectangle_loader'
import authentication from 'src/app/lib/authentication'
import { connect } from 'react-redux'
import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'
import 'src/assets/stylesheets/components/desktop/browse_collection/product_thumbnail.scss'
import AddToToteCartIcon from './add_to_tote_icon'
import { APPStatisticManager } from '../../lib/statistics/app'

const getState = state => ({
  customer: state.customer
})

export default connect(getState)(withRouter(ProductThumbnail))
function ProductThumbnail(props) {
  const {
    toggleCloset,
    getReportData,
    router,
    isHotItem,
    isNeedAbtest,
    isShowSeasonSample
  } = props
  const { onClickAddToToteCart = () => {}, product } = props

  const handleToggleCloset = e => {
    const { product, isCloset, closetProductIds } = props
    const inCloset = _.includes(closetProductIds, product.id)
    // NOTE: ABTEST
    if (!inCloset) {
      if (isHotItem) {
        window.adhoc('track', 'addCloset', 1)
      } else {
        window.adhoc('track', 'add_closet_v2', 1)
      }
    }

    e.stopPropagation()
    if (toggleCloset) {
      if (isCloset) {
        toggleCloset(product.id)
      } else {
        toggleCloset(product.id, getReportData)
      }
    }
  }

  const getUrl = () => {
    const { product, linkUrl } = props
    let url = {
      pathname: `/products/${product.id}`,
      query: isHotItem ? { source: 'hotitem' } : { isNeedAbtest }
    }
    if (_.includes(router.location.pathname, 'customize')) {
      url = { pathname: linkUrl || `/customize/product/${product.id}` }
    }
    return url
  }

  const handleClick = e => {
    APPStatisticManager.onClickElement(e.currentTarget)
    const { product } = props
    // NOTE: ABTEST
    let name = isHotItem ? 'enterProductDetail' : 'enter_product_detail_v2'
    window.adhoc('track', name, 1)
    browserHistory.push({
      ...getUrl(),
      state: {
        img_url: product.catalogue_photos[0].full_url,
        column_name: getReportData.column_name,
        product
      }
    })
  }

  const seasonSampleTips = product => {
    const { season_sample } = product
    let season_text
    switch (season_sample) {
      case 'spring_sample':
        season_text = `春季单品`
        break
      case 'summer_sample':
        season_text = `夏季单品`
        break
      case 'fall_sample':
        season_text = `秋季单品`
        break
      case 'winter_sample':
        season_text = `冬季单品`
        break
      default:
        return null
    }
    return (
      <div className="season-tag">
        <div className="season-text">{season_text}</div>
      </div>
    )
  }

  const getShowStock = () => {
    return props.isShowStock && (!product.swappable || product.disabled)
  }
  const { closetProductIds, showCloset, customer, isCloset, isShowCart } = props
  const inCloset = _.includes(closetProductIds, product.id),
    imageUrl = product.catalogue_photos[0].full_url
  const isShowUnstock = getShowStock()
  const showToteCart = isCloset && customer.display_cart_entry && isShowCart
  return (
    <div className={`product-thumbnail ${product.type.toLowerCase()}`}>
      <div onClick={handleClick}>
        {product.tote_slot > 1 && (
          <div className="products-both-slot">
            <ToteSlotIcon slot={product.tote_slot} type={product.type} />
          </div>
        )}
        {showCloset && (
          <AddToClosetButton
            inCloset={inCloset}
            toggleCloset={handleToggleCloset}
          />
        )}
        <div className={isShowUnstock ? 'tote-swap-gallery-unstock' : ''}>
          {isShowUnstock && (
            <div className="unstock-icon">
              {product.disabled ? '已下架' : !product.swappable ? '待返架' : ''}
            </div>
          )}
        </div>
        <div className="img-wrapper">
          {isShowSeasonSample && seasonSampleTips(product)}
          <RectangleLoader
            className="custom-collection-image-placeholder"
            src={imageUrl}
          />
        </div>
        <div className="product-info-container">
          {!authentication(customer).isSubscriber && (
            <div className="abtest-product">
              <span className="free-clothing">会员免费穿</span>
              <div className="product-price">&yen;{product.full_price}</div>
            </div>
          )}
          <div className="product-info-box isCloset">
            <div
              className={`product-info-box-content ${showToteCart &&
                'show_tote_cart'}`}
            >
              <span className="brand">
                {product.brand && product.brand.name}
              </span>
              <div className="title">{product.title}</div>
            </div>
            {showToteCart && (
              <AddToToteCartIcon
                product={product}
                isShowUnstock={isShowUnstock}
                onClickAddToToteCart={onClickAddToToteCart}
              />
            )}
          </div>
        </div>
      </div>
      {props.children}
    </div>
  )
}
