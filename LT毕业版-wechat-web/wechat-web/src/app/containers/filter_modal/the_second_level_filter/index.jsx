import classnames from 'classnames'

const TheSecondLevelFilter = ({
  title,
  ITEMS,
  selectedOptions,
  setFilters
}) => {
  const hanldeSetFilters = (filterData, reportData) => {
    return setFilters(filterData, reportData)
  }
  return (
    <div className="filter-button-wrapper">
      <div className="title">{title}</div>
      <div className="filter-scroll-container">
        {_.map(ITEMS, (item, index) => (
          <div
            className={classnames('filter-term', {
              selected: _.includes(selectedOptions, item.id)
            })}
            onClick={hanldeSetFilters(
              {
                filter_flag: 'second_level',
                id: item.id
              },
              {
                type: title,
                op_type: !_.includes(selectedOptions, item.id)
                  ? '筛选'
                  : '反选',
                filter: item.id
              }
            )}
            key={item + index}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export const TheSecondLevelFilterSwap = ({
  title,
  ITEMS,
  selectedOptions,
  setFilters
}) => (
  <div className="filter-button-wrapper">
    <div className="title">{title}</div>
    <div className="filter-scroll-container">
      {_.map(ITEMS, (item, index) => (
        <div
          className={classnames('filter-term', {
            selected: _.includes(selectedOptions, item.id)
          })}
          onClick={setFilters({ filter_flag: 'second_level', id: item.id })}
          key={item + index}
        >
          {item.name}
        </div>
      ))}
    </div>
  </div>
)

export default TheSecondLevelFilter
