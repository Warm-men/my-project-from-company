import { browserHistory } from 'react-router'
import MeasurementPicker from 'src/app/components/MeasurementPicker'
import classname from 'classnames'
import { useState } from 'react'
import { SIZE_LIMIT } from './utils'
import SelectSize from './select_size'
import './index.scss'

export default function UpdateSizeChart(props) {
  const { updateRowSize = () => {} } = props

  const [selectIndex, setSelectIndex] = useState(null)
  const [isShow, setIsShow] = useState(false)

  const gotoMeasure = () => browserHistory.push('/measure_detail')

  const handleRowClick = e => {
    setSelectIndex(e.target.getAttribute('data-index'))
  }

  const handleCancelMeasurement = () => setIsShow(false)

  const handleConfirmMeasurement = (brasize, cupsize) => {
    const value = `${brasize}${cupsize}`
    updateRowSize(value, selectIndex)
    handleCancelMeasurement()
  }

  const handleShowPicker = index => () => {
    setIsShow(true)
    setSelectIndex(index)
  }

  const handleSelectChange = e => {
    updateRowSize(e.target.value, selectIndex)
  }

  const handleClickModal = () => setIsShow(false)

  const rowCell = (index, handleClick, selectIndex, value, type) => {
    const isActive = Number(selectIndex) === index
    const cellClass = classname({
      'row-cell': true,
      'red-color': true,
      'cell-active': isActive
    })
    const selectcell = classname({ 'size-text': true, 'cell-active': isActive })
    if (type === 'bracup') {
      return (
        <span
          key={index}
          className={cellClass}
          onClick={handleShowPicker(index)}
        >
          {value}
          <MeasurementPicker
            defaultValue={[parseInt(value, 10), value.match(/[A-Za-z]/)[0]]}
            onConfirm={handleConfirmMeasurement}
            onCancel={handleCancelMeasurement}
            visible={isShow}
            handleClickModal={handleClickModal}
          />
        </span>
      )
    } else {
      return (
        <SelectSize
          key={index}
          dataIndex={index}
          value={value || ''}
          className={selectcell}
          handleClick={handleClick}
          handleChange={handleSelectChange}
          minLimit={SIZE_LIMIT[type].min}
          maxLimit={SIZE_LIMIT[type].max}
        />
      )
    }
  }

  const { rowList, leftTitle, handleTitleClick, rightTitle, titleList } = props
  return (
    <div className="size-chart-container">
      <h4 className="size-chart-title">
        <span className="left-title">{leftTitle}</span>
        <span className={'right-title'} onClick={handleTitleClick}>
          {rightTitle}
        </span>
      </h4>
      <div className="size-chart-row-title">
        {titleList.map((v, k) => {
          return (
            <div key={k} className="row-title-cell">
              <p className="row-title-text">{v.name}</p>
              <p className="row-title-unit">{v.unit}</p>
            </div>
          )
        })}
      </div>
      {rowList.map((row, key) => {
        return (
          <div key={key} className={'size-chart-row'}>
            {row.map((value, index) => {
              return rowCell(
                index,
                handleRowClick,
                selectIndex,
                value,
                titleList[index].type
              )
            })}
          </div>
        )
      })}
      <div className="size-chart-tips">
        <span className="tips-left">
          <span className="tips-icon">*</span>
          <span>Tips:个人尺码越准确，推荐就越准确哦</span>
        </span>
        <span onClick={gotoMeasure}>详细测量教程 ></span>
      </div>
    </div>
  )
}

UpdateSizeChart.defaultProps = {
  leftTitle: null,
  handleTitleClick: () => {},
  rightTitle: null,
  titleList: [],
  rowList: [],
  updateRowSize: () => {}
}
