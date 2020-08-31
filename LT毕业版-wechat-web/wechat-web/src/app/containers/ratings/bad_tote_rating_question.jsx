import CommentTextarea from './rating_products/comment_textarea'
import { useState } from 'react'
import 'src/assets/stylesheets/components/buttons/single_select_buttons_group.scss'

export default function BadToteRatingQuestion(props) {
  const possible_answers = [
    { display: '尺码不合身', value: 'didnt_fit' },
    { display: '商品质量不满意', value: 'wasnt_customized' },
    { display: '不是我的风格', value: 'wrong_style' },
    { display: '很难搭配', value: 'difficult_match' },
    { display: '物流太慢', value: 'arrived_slowly' }
  ]

  const { updateTote, toteRating } = props
  const [showReasonText, setShowReasonText] = useState(!!toteRating.reason)

  const toggleReasonText = () => setShowReasonText(show => !show)

  const handleComment = reason => {
    reason.length <= 150 && updateTote({ reason })
  }

  return (
    <div className="bad-tote-rating-container">
      <div className="selectable-button-box">
        {_.map(possible_answers, possible_answer => {
          return (
            <div
              className={
                'btn btn-selectable' +
                (toteRating[possible_answer.value] ? ' selected' : '')
              }
              key={possible_answer.value}
              onClick={() =>
                updateTote({
                  [possible_answer.value]: !toteRating[possible_answer.value]
                })
              }
            >
              {possible_answer.display}
            </div>
          )
        })}
        <div
          className={`btn btn-selectable ${showReasonText ? ' selected' : ''}`}
          onClick={toggleReasonText}
        >
          其他
        </div>
        {showReasonText && (
          <div className="text-area-box">
            <CommentTextarea
              placeholder="请告诉我们具体原因"
              defaultValue={toteRating ? toteRating.reason : null}
              handleComment={handleComment}
            />
          </div>
        )}
      </div>
    </div>
  )
}
