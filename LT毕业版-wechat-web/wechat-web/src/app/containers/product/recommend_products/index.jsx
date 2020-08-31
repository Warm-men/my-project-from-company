import { browserHistory } from 'react-router'
import Swiper from 'react-id-swiper'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import ProductCard from './product_card'
import { placeholder_500_750 } from 'src/assets/placeholder'
import next from 'src/assets/images/account/next.png'
import './index.scss'

export default function RecommendProducts(props) {
  const { products } = props

  if (_.isEmpty(products)) return null

  const handleClick = product => () => {
    const isSwapPage = _.includes(window.location.pathname, 'customize')
    const pushObject = {
      pathname: isSwapPage
        ? `/customize/product/${product.id}`
        : `/products/${product.id}`,
      state: { column_name: 'Outfits' }
    }
    browserHistory.push(pushObject)
  }

  const renderProductsItem = products => {
    if (!_.isArray(products) || products.length === 0) {
      return null
    }
    if (products.length === 1) {
      const product = products[0]
      const img = product.catalogue_photos[0].medium_url
      return (
        <div className="recommend-products-box" onClick={handleClick(product)}>
          <div className="product-img">
            <ProgressiveImage src={img} placeholder={placeholder_500_750}>
              {image => <img alt="" src={image} />}
            </ProgressiveImage>
          </div>
          <div className="product-title-box">
            <p className="title-box-brand">{product.brand.name}</p>
            <p className="title-box-title">{product.title}</p>
          </div>
          <div>
            <img className="product-right-icon" alt="" src={next} />
          </div>
        </div>
      )
    }

    if (products.length > 1 && products.length <= 3) {
      return (
        <div className="product-swiper-container">
          <div className="product-pad">
            {products.map((product, key) => (
              <ProductCard
                product={product}
                handleClick={handleClick}
                key={key}
              />
            ))}
          </div>
        </div>
      )
    }

    const grouping = array => {
      const result = []
      for (let i = 0; i < array.length; i += 3) {
        result.push(array.slice(i, i + 3))
      }
      return result
    }

    const params = {
      shouldSwiperUpdate: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    }

    return (
      <div className="product-swiper-container">
        <Swiper {...params}>
          {grouping(products)
            .slice(0, 12)
            .map((productGroup, key) => (
              <div key={key} className="product-pad">
                {productGroup.map((product, key) => (
                  <ProductCard
                    product={product}
                    handleClick={handleClick}
                    key={key}
                  />
                ))}
              </div>
            ))}
        </Swiper>
      </div>
    )
  }

  return (
    <div className="recommend-products">
      <div className="recommend-products-title">模特穿搭</div>
      {renderProductsItem(products.slice(0, 12))}
    </div>
  )
}
