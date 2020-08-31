import 'src/assets/stylesheets/components/buttons/single_select_buttons_group.scss'

export default ({
  questionKey,
  answerValues,
  answerDisplays,
  activeAnswers,
  onClick,
  isArray
}) => {
  return (
    <div className="multi-select-container">
      {!_.isEmpty(answerValues) &&
        _.map(answerValues, (answerValue, idx) => {
          let isActive = false
          _.map(activeAnswers, (v, k) => {
            if (v && k === answerValue) {
              isActive = true
            }
            if (isArray && v === answerValue) {
              isActive = true
            }
          })
          return (
            <div
              className={'btn' + (isActive ? ' active' : '')}
              key={answerValue}
            >
              <div
                onClick={() => {
                  onClick({ [questionKey]: answerValue }, questionKey)
                }}
              >
                {answerDisplays[idx]}
              </div>
            </div>
          )
        })}
    </div>
  )
}
