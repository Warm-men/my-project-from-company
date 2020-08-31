import WithHandletouch from 'src/app/components/HOC/with_handletouch/index_hooks.jsx'
import './index.scss'

function CommentReviewModal({ hideOtherRatingModal = () => {}, comment = '' }) {
  return (
    <div className="rating-comment-modal-container">
      <div className="shadow" />
      <div className="rating-modal-box">
        <h5 className="modal-title">
          <span>我的其他反馈</span>
          <span onClick={hideOtherRatingModal}>
            <img
              alt=""
              src={require('src/app/containers/service_rating/images/close.svg')}
            />
          </span>
        </h5>
        <div className="comment-box">
          <p className="comment">{comment}</p>
        </div>
      </div>
    </div>
  )
}

export default WithHandletouch(CommentReviewModal)
