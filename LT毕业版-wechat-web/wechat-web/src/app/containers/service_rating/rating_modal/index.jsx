import React, { useState } from 'react'
import { RatingItem } from 'src/app/containers/service_rating/rating_modal/rating_item'
import UploadImaqes from 'src/app/components/upload_img'
import Actions from 'src/app/actions/actions.js'
import PreventScroll from 'src/app/components/HOC/PreventScroll/index_hooks.jsx'
import ImagesTipsModal from 'src/app/containers/service_rating/images_tips_modal/index.jsx'
import { handleSizeName } from 'src/app/containers/product/detail_buttons/utils/product_detail_bottom_btn_util.js'
import './index.scss'

export default PreventScroll(RatingModal)
function RatingModal(props) {
  const { dispatch, service_question_sets } = props
  const { service_feedback } = props
  const [rating, setRating] = useState(
    service_feedback ? service_feedback.quality_issues_human_names : []
  )
  const [imgModal, setImgModal] = useState(false)
  const [postUrls, setPostUrls] = useState(
    !_.isEmpty(service_feedback) ? service_feedback.quality_photo_urls : []
  )

  const handleRating = (key, value) => () => {
    setRating(rating => {
      return _.includes(rating, value)
        ? _.remove(rating, v => v !== value)
        : [...rating, value]
    })
  }

  const handleSubmit = () => {
    if (_.isEmpty(rating)) {
      dispatch(
        Actions.tips.changeTips({ isShow: true, content: '请选择质量问题' })
      )
      return false
    } else {
      if (postUrls.length < 2 && !isHideSelectImg()) {
        const tips = { isShow: true, content: '请上传至少2张照片' }
        dispatch(Actions.tips.changeTips(tips))
        return false
      }
    }
    const { setRatingProduct, ratingProduct, hideRatingModal } = props
    setRatingProduct(ratingProduct.id, {
      quality_issues: rating,
      quality_photo_urls: postUrls
    })
    hideRatingModal()
  }

  // NOTE:只选异味不需要显示图片上传
  const isHideSelectImg = () => rating.length === 1 && rating[0] === 'smelled'

  const showImgModal = () => setImgModal(true)

  const hideImgModal = () => setImgModal(false)

  const deleteImage = index => {
    const newUrls = [...postUrls]
    _.remove(newUrls, (v, k) => k === index)
    setPostUrls(newUrls)
  }

  const updatePhotoImageSuccess = urls => setPostUrls(urls)

  const { product, product_size } = props.ratingProduct
  const isClothing = product.type === 'Clothing'
  return (
    <div className="rating-modal-container">
      <div className="shadow" />
      <div className={`rating-modal-box ${imgModal ? 'hidden' : ''}`}>
        <h5 className="modal-title bottom-border">
          <span>
            {product.title}{' '}
            {isClothing ? handleSizeName(product_size.size_abbreviation) : ''}
          </span>
          <span onClick={props.hideRatingModal}>
            <img
              alt=""
              src={require('src/app/containers/service_rating/images/close.svg')}
            />
          </span>
        </h5>
        {_.map(service_question_sets, (v, k) => {
          if (_.isEmpty(v)) {
            return null
          }
          return v.group_name === 'quality' ? (
            <React.Fragment key={k}>
              <RatingItem
                handleRating={handleRating}
                ratingData={v.questions}
                rating={rating}
                isLast={!isClothing && k === v.questions.length - 2}
              />
              <div className="upload-images-box">
                <UploadImaqes
                  updateSuccess={updatePhotoImageSuccess}
                  postImgsMax={5}
                  postImgs={postUrls}
                  deleteImage={deleteImage}
                />
                <div className="tips-box">
                  <p className="tips-text">
                    Tips：须提供2-5张照片展示详细情况，异味问题除外
                  </p>
                  <p className="tips-text">
                    尽量上传清晰大图，质检员才能快速核查
                    <span className="img-modal" onClick={showImgModal}>
                      查看图片示例
                    </span>
                  </p>
                </div>
              </div>
            </React.Fragment>
          ) : null
        })}
        <div className="rating-modal-btn-box">
          <div className="rating-modal-btn" onClick={handleSubmit}>
            确认
          </div>
        </div>
      </div>
      {imgModal && <ImagesTipsModal hideImgModal={hideImgModal} />}
    </div>
  )
}
