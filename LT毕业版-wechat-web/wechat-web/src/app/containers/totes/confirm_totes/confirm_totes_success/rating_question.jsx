import CommentTextarea from 'src/app/containers/ratings/rating_products/comment_textarea.jsx'
import './index.scss'

export default function ToteRatingQuestion(props) {
  const { swapQuestion, options, maxQuestionLimit, updateReasonValue } = props
  const handleComment = reason => {
    if (reason.length <= 150) {
      updateReasonValue(reason)
    }
  }

  const handleClick = reason => () => {
    const currentSwapQuestion = [...swapQuestion]
    let findIndex = currentSwapQuestion.findIndex(item => {
      return item === reason
    })
    if (findIndex === -1) {
      if (currentSwapQuestion.length < maxQuestionLimit) {
        currentSwapQuestion.push(reason)
      } else {
        currentSwapQuestion.splice(swapQuestion.length - 1, 1, reason)
      }
    } else if (findIndex > -1) {
      currentSwapQuestion.splice(findIndex, 1)
    }
    props.changeQuestion(currentSwapQuestion)
  }

  return (
    <div className="RatingQuestion-container">
      {_.map(options, (answer, index) => {
        const isSelected = swapQuestion.includes(answer.key)
        return (
          <div
            className={`select-button-ui ${isSelected ? 'selected' : ''}`}
            key={index}
            onClick={handleClick(answer.key)}
          >
            {answer.value}
          </div>
        )
      })}
      <CommentTextarea
        placeholder="还有其他问题也可以在这里告诉我们"
        defaultValue={null}
        handleComment={handleComment}
      />
    </div>
  )
}
