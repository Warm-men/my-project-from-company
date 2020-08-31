import 'src/assets/stylesheets/components/buttons/single_select_buttons_group.scss'

export default ({
  questionKey,
  answerValues,
  answerDisplays,
  activeAnswer,
  onClick
}) => {
  return (
    <div className="multi-select-container">
      {!_.isEmpty(answerValues) &&
        _.map(answerValues, (answerValue, idx) => {
          const isActive = activeAnswer === answerValue
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
