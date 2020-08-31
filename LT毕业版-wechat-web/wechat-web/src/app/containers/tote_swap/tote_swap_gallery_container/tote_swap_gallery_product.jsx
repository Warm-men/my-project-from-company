import { browserHistory } from 'react-router'
import AddToClosetButton from 'src/app/components/shared/add_to_closet_redux_button'
import 'src/assets/stylesheets/components/desktop/tote_swap/gallery_product.scss'
import RectangleLoader from '../rectangle_loader'
import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'
import * as storage from 'src/app/lib/storage.js'
export default class ToteSwapGalleryProduct extends React.Component {
  constructor(props) {
    super(props)
    this.img_url = this.showPicture(props.product)
  }

  showPicture = product => {
    return _.isEmpty(product.catalogue_photos)
      ? ''
      : product.catalogue_photos[0].full_url
  }

  handleToggleCloset = e => {
    const {
      toggleCloset,
      product,
      getReportData,
      isInCloset: inClosetPage
    } = this.props
    e.stopPropagation()
    if (toggleCloset) {
      if (inClosetPage) {
        toggleCloset(product.id)
      } else {
        toggleCloset(product.id, getReportData)
      }
    }
  }

  handleLink = () => {
    const { product, getReportData } = this.props
    const url = `/customize/product/${product.id}`
    storage.remove(url)
    const path = {
      pathname: url,
      state: {
        product,
        img_url: this.img_url,
        column_name: getReportData.column_name
      }
    }
    browserHistory.push(path)
  }

  render() {
    const {
      hideAddToCloset,
      product,
      closetProductIds,
      module,
      gallery
    } = this.props
    const isCollection = gallery === 'collections'
    const inCloset = _.includes(closetProductIds, product.id)
    const isShowUnStock =
      (isCollection || gallery === 'closet') && !product.swappable
    return (
      <div className="tote-swap-gallery-product gallery-swiper-slide">
        <div onClick={this.handleLink}>
          {product.tote_slot > 1 && (
            <div className="products-both-slot">
              <ToteSlotIcon slot={product.tote_slot} type={product.type} />
            </div>
          )}
          {isShowUnStock && (
            <div className="tote-swap-gallery-unstock">
              <span className="unstock-icon" />
            </div>
          )}
          {!hideAddToCloset && (
            <AddToClosetButton
              inCloset={inCloset}
              module={module}
              toggleCloset={this.handleToggleCloset}
            />
          )}
          <RectangleLoader
            className="custom-collection-image-placeholder"
            src={this.img_url}
          />
          <div>
            <div className="title">{product.brand && product.brand.name}</div>
            <div className="brand">{product.title}</div>
          </div>
        </div>
      </div>
    )
  }
}
