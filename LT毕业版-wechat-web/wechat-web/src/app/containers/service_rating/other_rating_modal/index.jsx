import CommentTextarea from 'src/app/containers/ratings/rating_products/comment_textarea.jsx'
import WithHandletouch from 'src/app/components/HOC/with_handletouch/index_hooks.jsx'
import PreventScroll from 'src/app/components/HOC/PreventScroll/index_hooks.jsx'
import './index.scss'

function OtherRatingModal({
  hideOtherRatingModal = () => {},
  handleSubmit = () => {},
  comment = ''
}) {
  let text = comment

  const handleComment = value => (text = value)

  const handleClick = () => handleSubmit(text)

  return (
    <div className="rating-other-modal-container">
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
          <CommentTextarea
            placeholder="请描述下你的问题"
            defaultValue={text}
            handleComment={handleComment}
            maxLength={300}
          />
        </div>
        <div className="rating-modal-btn-box">
          <div className="rating-modal-btn" onClick={handleClick}>
            确认
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithHandletouch(PreventScroll(OtherRatingModal))
