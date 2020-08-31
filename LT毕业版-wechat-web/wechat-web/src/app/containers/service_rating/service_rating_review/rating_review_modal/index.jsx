import React, { useMemo, useLayoutEffect } from 'react'
import { handleSizeName } from 'src/app/containers/product/detail_buttons/utils/product_detail_bottom_btn_util.js'
import wxInit from 'src/app/lib/wx_config'
import WithHandletouch from 'src/app/components/HOC/with_handletouch/index_hooks.jsx'
import './index.scss'

function RatingReviewModal({ hideRatingModal, rating, selectProduct }) {
  const ratingsInfo = useMemo(() => {
    return rating ? rating.quality_issues_human_names : []
  }, [rating])

  useLayoutEffect(() => {
    wxInit()
  })

  const previewImage = index => () => {
    if (!_.isEmpty(rating.quality_photo_urls)) {
      const postImgs = rating.quality_photo_urls
      wx.ready(() => {
        wx.previewImage({
          current: postImgs[index], // 当前显示图片的http链接
          urls: postImgs, // 需要预览的图片http链接列表
          fail: () => wxInit(true, () => previewImage(index))
        })
      })
    }
  }

  const { product, product_size } = selectProduct
  return (
    <div className="rating-review-modal-container">
      <div className="shadow" />
      <div className="rating-modal-box">
        <h5 className="modal-title">
          <span>投诉详情</span>
          <span onClick={hideRatingModal}>
            <img
              alt=""
              src={require('src/app/containers/service_rating/images/close.svg')}
            />
          </span>
        </h5>
        <p className="modal-product-info">
          {product.title}{' '}
          {product.type === 'Clothing'
            ? handleSizeName(product_size.size_abbreviation)
            : ''}
        </p>
        <div className="product-info-box">
          {_.map(ratingsInfo, (v, k) => {
            return (
              <span className="product-info-item" key={k}>
                {v}
              </span>
            )
          })}
        </div>
        <div className="photo-url-box">
          {_.map(rating.quality_photo_urls, (v, k) => {
            return (
              <img
                key={k}
                alt=""
                src={v}
                onClick={previewImage(k)}
                className="quality-photo-url"
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default WithHandletouch(RatingReviewModal)
