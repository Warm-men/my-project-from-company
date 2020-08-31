import React, { useEffect } from 'react'
import ProductSelectItem from '../product_select'
import './index.scss'

export default function ProductSwiperItem(props) {
  const { products, purchase_ids } = props

  if (_.isEmpty(products)) return null

  useEffect(() => {
    window.scroll(0, 0) //失焦后强制让页面归位
  }, [])

  const handleSelect = tote_product => () => {
    const { products, purchase_ids } = props
    if (tote_product.id === products[0].id) {
      return null
    }
    let newIds = [...purchase_ids]
    if (_.includes(purchase_ids, tote_product.id)) {
      newIds = _.filter(newIds, id => id !== tote_product.id)
    } else {
      newIds = [...purchase_ids, tote_product.id]
    }
    props.selectPurchaseProduct(newIds)
  }

  const handleSelectRender = () => {
    let price = 0
    return _.map(purchase_ids, (v, k) => {
      const item = _.find(products, product => product.id === v)
      price += item.tote_specific_price
      if (k + 1 < purchase_ids.length) {
        return <ProductSelectItem key={k} tote_product={item} />
      } else {
        return (
          <React.Fragment key={k}>
            <ProductSelectItem tote_product={item} />
            <p key="price" className="product-select-summer">
              <span className="title">商品小计</span>
              <span className="price">¥{price}</span>
            </p>
          </React.Fragment>
        )
      }
    })
  }

  const width = (8 + 72) * products.length + 8
  return (
    <>
      <div className="product-swiper-box">
        <div className="product-swiper-container" style={{ width }}>
          {_.map(products, (v, k) => {
            return (
              <div className="product-item" key={k} onClick={handleSelect(v)}>
                {k !== 0 && (
                  <span
                    className={`select-icon ${
                      _.includes(purchase_ids, v.id) ? 'selected' : ''
                    }`}
                  />
                )}
                <img
                  src={v.product.catalogue_photos[0].medium_url}
                  className="product-img"
                  alt=""
                />
                <p className="product-price">¥{v.tote_specific_price}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="product-select-box">
        <h5 className="select-title">已选购的商品</h5>
        {handleSelectRender()}
      </div>
    </>
  )
}
