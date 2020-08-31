import classnames from 'classnames'

export const ColorSwatch = React.memo(({ option, value }) => (
  <div>
    <div className={`filter-swatch-color filter-swatch-${option}`} />
    <div className="filter-swatch-label">{value}</div>
  </div>
))

export default ({
  className,
  options,
  selectedOptions,
  title,
  filterType,
  setFilters
}) => {
  const hanldeSetFilters = (filterData, reportData) => {
    return setFilters(filterData, reportData)
  }

  const isColorFamily = filterType === 'color_families'
  return (
    <div className={`filter-button-wrapper ${className}`}>
      <div className="title">{title}</div>
      <div className="filter-scroll-container option-row">
        {_.map(options, (value, key) => {
          const titileArray = ['品类', '全部品类', '衣服', '饰品']
          const activeKey = titileArray.includes(title) ? value.id : key
          return (
            <div
              className={classnames({
                'filter-term': !isColorFamily,
                'filter-swatch': isColorFamily,
                selected: _.includes(selectedOptions, activeKey)
              })}
              onClick={hanldeSetFilters(
                { type: filterType, key, id: value.id },
                {
                  type: title,
                  op_type: !_.includes(selectedOptions, key) ? '筛选' : '反选',
                  filter: activeKey
                }
              )}
              key={key}
            >
              {isColorFamily ? (
                <ColorSwatch option={key} value={value} />
              ) : (
                <>{value.name || value}</>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
