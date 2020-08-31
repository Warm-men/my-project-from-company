function ColorSwatch({ value, option }) {
  return (
    <div>
      <div className={`filter-swatch-color filter-swatch-${option}`} />
      <div className="filter-swatch-label">{value}</div>
    </div>
  )
}

export default function ToteSwapButtonFilters(props) {
  const isColorFilter = props.filter === 'colors'
  const { options } = props
  const { className, selectedOptions, setFilters, filterTitle } = props
  return (
    <div className={'filter-button-wrapper ' + (className ? className : '')}>
      <div className="title">{filterTitle}</div>
      <div className="filter-scroll-container">
        {!isColorFilter ? (
          _.map(options, (option, key) => {
            const id = option.id || key
            return (
              <div
                className={`filter-term ${
                  _.includes(selectedOptions, id) ? 'selected' : ''
                }`}
                onClick={setFilters({
                  filter_flag: props.filter,
                  key,
                  id
                })}
                key={key}
              >
                {option.name || option}
              </div>
            )
          })
        ) : (
          <div className="option-row">
            {_.map(props.options, (option, key) => {
              return (
                <div
                  className={`filter-swatch ${
                    _.includes(selectedOptions, key) ? 'selected' : ''
                  }`}
                  onClick={setFilters({
                    filter_flag: props.filter,
                    key,
                    id: key
                  })}
                  key={option}
                >
                  <ColorSwatch
                    optionLabels={props.optionLabels}
                    value={option}
                    option={key}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
