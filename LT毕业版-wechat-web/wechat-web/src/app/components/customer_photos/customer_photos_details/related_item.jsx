import PropTypes from 'prop-types'
import AddToClosetButton from 'src/app/components/shared/add_to_closet_redux_button'
import { connect } from 'react-redux'
import { getProductAbnormalStatus } from 'src/app/lib/product_l10n'
import { l10nForSize } from 'src/app/lib/product_l10n'
import './index.scss'

function mapStateToProps(state) {
  const { closet } = state
  return {
    closetProductIds: closet.productIds
  }
}
@connect(mapStateToProps)
export default class CustomerPhotosDetailItemRelatedItem extends React.PureComponent {
  handleToggleCloset = e => {
    e.stopPropagation()
    const { toggleCloset, index, toteProduct } = this.props
    const variables = { index }
    toggleCloset(toteProduct.product.id, variables)
  }
  didSelectedItem = () => {
    const { didSelectedItem, toteProduct } = this.props
    didSelectedItem(toteProduct.product)
  }
  render() {
    const { closetProductIds } = this.props
    const { product, product_size } = this.props.toteProduct
    const size_abbreviation = product_size && product_size.size_abbreviation
    const { title, brand, catalogue_photos } = product
    const productImg = catalogue_photos[0].medium_url
    const inCloset = _.includes(closetProductIds, product.id)
    const swappableTitle = getProductAbnormalStatus(product)

    const size = l10nForSize(size_abbreviation, true)

    return (
      <div className="related-item-contents" onClick={this.didSelectedItem}>
        <div className="left-view">
          <div className="img-wrapper">
            <img src={productImg} alt="" className="thum-url-img" />
            {swappableTitle && (
              <div className="tip-box">
                <div className="tip-view">{swappableTitle}</div>
              </div>
            )}
          </div>
          <div className="center-view">
            <div className="brand-view">{brand ? brand.name : ''}</div>
            <div className="product-name">{title}</div>
            <div className="size-view">{size}</div>
          </div>
        </div>
        <AddToClosetButton
          inCloset={inCloset}
          toggleCloset={this.handleToggleCloset}
        />
      </div>
    )
  }
}

CustomerPhotosDetailItemRelatedItem.propTypes = {
  toteProduct: PropTypes.object
}

CustomerPhotosDetailItemRelatedItem.defaultProps = {
  toteProduct: {
    product: {
      id: 1,
      thum_url: 'https',
      brand: '',
      title: '',
      size: 'M'
    },
    product_size: {
      size_abbreviation: 'S'
    }
  }
}
