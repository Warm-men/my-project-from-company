import { browserHistory } from 'react-router'
import AddToClosetButton from 'src/app/components/shared/add_to_closet_redux_button'
import RectangleLoader from 'src/app/containers/tote_swap/rectangle_loader'
import * as storage from 'src/app/lib/storage.js'
import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'
import 'src/assets/stylesheets/components/desktop/browse_collection/product_thumbnail.scss'

export default class ProductThumbnail extends React.Component {
  handleClick = () => {
    const { product, getReportData, location } = this.props,
      imageUrl = product.catalogue_photos[0].full_url
    const { btn } = location.query
    !_.isEmpty(btn) && storage.set('vacation_plans', true)
    window.adhoc('track', 'enter_product_detail_v2', 1)
    browserHistory.push({
      pathname: `/products/${product.id}`,
      state: {
        img_url: imageUrl,
        column_name: getReportData.column_name,
        product
      }
    })
  }

  handleToggleCloset = e => {
    const {
      toggleCloset,
      product,
      getReportData,
      closetProductIds
    } = this.props
    const inCloset = _.includes(closetProductIds, product.id)
    e.stopPropagation()
    if (!inCloset) window.adhoc('track', 'add_closet_v2', 1)
    toggleCloset(product.id, getReportData)
  }

  render() {
    const { product, closetProductIds, showCloset, isSubscriber } = this.props,
      inCloset = _.includes(closetProductIds, product.id),
      imageUrl = product.catalogue_photos[0].full_url
    const stockText = product.disabled
      ? '已下架'
      : !product.swappable
      ? '待返架'
      : ''
    return (
      <div className="product-thumbnail">
        <div onClick={this.handleClick}>
          {product.tote_slot > 1 && (
            <div className="products-both-slot">
              <ToteSlotIcon slot={product.tote_slot} type={product.type} />
            </div>
          )}
          {showCloset && (
            <AddToClosetButton
              inCloset={inCloset}
              toggleCloset={this.handleToggleCloset}
            />
          )}
          {!_.isEmpty(stockText) && (
            <div className="tote-swap-gallery-unstock">
              <span className="unstock-icon">{stockText}</span>
            </div>
          )}
          <RectangleLoader
            className={'custom-collection-image-placeholder'}
            src={imageUrl}
          />
          <div className="product-info-container">
            {!isSubscriber && (
              <div className="abtest-product">
                <span className="free-clothing">会员免费穿</span>
                <div className="product-price">&yen;{product.full_price}</div>
              </div>
            )}
            <div className="product-info-box">
              <div className="brand">{product.brand && product.brand.name}</div>
              <div className="title">{product.title}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
