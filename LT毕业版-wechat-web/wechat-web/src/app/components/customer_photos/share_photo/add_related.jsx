import PropTypes from 'prop-types'
import Actions from 'src/app/actions/actions.js'
import './index.scss'
import Swiper from 'react-id-swiper'
import 'react-id-swiper/lib/styles/css/swiper.css'
import 'src/app/components/custom_components/swiper.scss'

class AddRelated extends React.PureComponent {
  constructor(props) {
    super(props)
    this.options = {
      slidesPerView: 'auto',
      paginationClickable: true,
      freeMode: true,
      preloadImages: false,
      lazy: true,
      spaceBetween: 8
    }
  }
  removeRelatedProduct = product => {
    const newRelatedProducts = _.filter(
      this.props.currentRelatedProducts,
      item => item.id !== product.id && !item.empty
    )
    this.props.dispatch(
      Actions.relatedProduct.updateRelatedProduct(newRelatedProducts)
    )
  }
  render() {
    const { addRelatedProduct, products, currentRelatedProducts } = this.props
    const currentProducts = [products, ...currentRelatedProducts]
    return (
      <div className="add-related-container">
        <div className="title-box">
          <span className="title">添加关联</span>
          <span className="sub-title">本次晒单都搭配了哪些单品？</span>
        </div>
        <div className="related-product-box">
          <Swiper
            slideClass="custom-swiper-slide"
            wrapperClass="custom-swiper-wrapper"
            {...this.options}
          >
            {_.map(currentProducts, (item, index) => {
              if (item.empty) {
                return (
                  <div key={index} className="product-view">
                    <div
                      className="product"
                      key={index}
                      onClick={addRelatedProduct}
                    >
                      <img
                        src={require('src/app/components/customer_photos/images/add_related.png')}
                        alt=""
                        className="item-img"
                      />
                    </div>
                  </div>
                )
              }
              return (
                <div key={index} className="product-view">
                  <ProductItem
                    product={item}
                    key={index}
                    index={index}
                    removeRelatedProduct={this.removeRelatedProduct}
                  />
                </div>
              )
            })}
          </Swiper>
        </div>
      </div>
    )
  }
}

AddRelated.propTypes = {
  products: PropTypes.object.isRequired,
  relatedProducts: PropTypes.array.isRequired,
  removeRelatedProduct: PropTypes.func.isRequired,
  addRelatedProduct: PropTypes.func.isRequired,
  maxProductLength: PropTypes.number.isRequired
}
AddRelated.defaultProps = {
  products: {},
  relatedProducts: [],
  removeRelatedProduct: () => {},
  addRelatedProduct: () => {},
  maxProductLength: 6
}

class ProductItem extends React.PureComponent {
  removeRelatedProduct = () => {
    const { product, removeRelatedProduct } = this.props
    removeRelatedProduct(product)
  }
  render() {
    const { product, index } = this.props
    const product_url = product.product.catalogue_photos[0]
    return (
      <div className="product">
        <img
          src={product_url.thumb_url || product_url.medium_url}
          className="item-img"
          alt=""
        />
        {!product.is_main_product && index !== 0 && (
          <img
            src={require('../images/delete_icon.png')}
            alt=""
            className="delete-icon"
            onClick={this.removeRelatedProduct}
          />
        )}
      </div>
    )
  }
}

export default AddRelated
