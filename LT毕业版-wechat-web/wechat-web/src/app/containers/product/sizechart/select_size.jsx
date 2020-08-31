import './index.scss'

const RenderListItems = React.memo(({ min, max }) => {
  let items = [
    <option value="" className="hide" disabled key="">
      请选择
    </option>
  ]
  for (let i = min; i <= max; i++) {
    items.push(
      <option value={i} key={i}>
        {i}
      </option>
    )
  }
  return items
})

export default function UpdateSizeChart(props) {
  const {
    value,
    dataIndex,
    className,
    handleClick,
    handleChange,
    minLimit,
    maxLimit,
    unit,
    placeholder
  } = props
  const newValue = value === '--' ? '' : value
  return (
    <div
      className="size-select-container"
      data-index={dataIndex}
      onClick={handleClick}
    >
      <span className={className}>{value ? value + unit : placeholder}</span>
      <select
        key={dataIndex}
        data-index={dataIndex}
        value={newValue || ''}
        className="size-select"
        onChange={handleChange}
      >
        <RenderListItems min={minLimit} max={maxLimit} />
      </select>
    </div>
  )
}

UpdateSizeChart.defaultProps = {
  leftTitle: null,
  handleTitleClick: () => {},
  rightTitle: null,
  titleList: [],
  rowList: [],
  updateRowSize: () => {},
  unit: '',
  placeholder: '请选择'
}
