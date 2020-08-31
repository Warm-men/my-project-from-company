import classnames from 'src/app/lib/classnames.js'
import './index.scss'

export default function SizeChart(props) {
  const {
    rowList,
    leftTitle,
    handleTitleClick,
    rightTitle,
    titleList,
    recommenIndex,
    sizeType,
    userStyleInfo,
    realtimeProductRecommended
  } = props
  const recommendedSize =
    realtimeProductRecommended &&
    realtimeProductRecommended.recommended_type === 'normal'
  const isGoods = leftTitle === '商品尺码'
  return (
    <div className="size-chart-container">
      <h4 className="size-chart-title">
        <span className="left-title">{leftTitle}</span>
        {rightTitle && (
          <span className="right-title" onClick={handleTitleClick}>
            {rightTitle}
          </span>
        )}
      </h4>
      <div className="size-chart-row-title">
        {_.map(titleList, (v, k) => {
          return (
            <div
              key={k}
              className={classnames('row-title-cell', { boxshadow: isGoods })}
            >
              <p className="row-title-text">{v.name}</p>
              <p className="row-title-unit">{v.unit}</p>
            </div>
          )
        })}
      </div>
      {_.map(rowList, (row, key) => {
        return (
          <div
            key={key}
            className={classnames('size-chart-row', {
              select: Boolean(recommendedSize && recommenIndex === key)
            })}
          >
            {row.map((value, index) => {
              let isMark = false
              if (_.isArray(value)) {
                const size = userStyleInfo[titleList[index].type]
                isMark = size >= value[0] && size <= value[2]
              }
              return (
                <div
                  key={index}
                  className={classnames('row-cell', {
                    'os-select': value === '均码',
                    select: value !== '均码',
                    'range-mark': isMark,
                    boxshadow: isGoods
                  })}
                >
                  <span>{value}</span>
                </div>
              )
            })}
          </div>
        )
      })}
      {isGoods && (
        <div className="size-chart-tips">
          <span className="tips-left">
            <span className="tips-icon">*</span>
            <span>
              Tips: <div className="mark-icon" />
              &nbsp;表示你的个人尺码在数据范围内
            </span>
          </span>
        </div>
      )}
      {sizeType && (
        <p className="size-chart-tips no-flex">
          <span className="tips-icon">*</span>Tips：商品是{sizeType}
          ，可能会比中国尺码略微偏大
        </p>
      )}
    </div>
  )
}

SizeChart.defaultProps = {
  leftTitle: null,
  handleTitleClick: () => {},
  rightTitle: null,
  titleList: [],
  rowList: []
}
