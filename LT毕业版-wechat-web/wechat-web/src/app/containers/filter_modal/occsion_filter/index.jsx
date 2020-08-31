import PropTypes from 'prop-types'
import classname from 'classnames'

const OccasionFilter = ({ title, options, selectedOptions, setFilters }) => {
  return (
    <div className="filter-button-wrapper">
      <div className="title">{title}</div>
      <div className="filter-scroll-container">
        {options.map((item, index) => {
          const isSelect = _.includes(selectedOptions, item.id)
          const classNames = classname('filter-term', { selected: isSelect })
          return (
            <div
              key={item.name + index}
              className={classNames}
              onClick={setFilters(
                {
                  filter_flag: 'occasion_filter',
                  id: item.id
                },
                {
                  type: title,
                  op_type: !isSelect ? '筛选' : '反选',
                  filter: item.slug
                }
              )}
            >
              {item.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const OccasionFilterSwap = ({
  title,
  options,
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
        {options.map((item, index) => {
          const isSelect = _.includes(selectedOptions, item.id)
          const classNames = classname('filter-term', { selected: isSelect })
          return (
            <div
              key={item.name + index}
              className={classNames}
              onClick={hanldeSetFilters(
                {
                  filter_flag: 'occasion_filter',
                  id: item.id
                },
                {
                  type: title,
                  op_type: !isSelect ? '筛选' : '反选',
                  filter: item.id
                }
              )}
            >
              {item.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}

OccasionFilter.propTypes = {
  title: PropTypes.string,
  options: PropTypes.array,
  selectedOptions: PropTypes.array,
  setFilters: PropTypes.func
}

export default OccasionFilter
