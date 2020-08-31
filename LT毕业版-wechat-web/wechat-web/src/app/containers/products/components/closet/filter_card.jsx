import { useState } from 'react'
import Switch from 'src/app/containers/products/components/closet/switch'

const FilterCard = props => {
  const {
    refecthCloset,
    onChangeSwitchValue,
    filter_terms,
    perfectCloset,
    showFilterModal,
    location,
    sort
  } = props
  const [filterTermsState, setFilterTermsState] = useState(filter_terms)
  const handleSelectedSlots = tag => {
    if (tag !== filterTermsState) {
      setFilterTermsState(tag)
      refecthCloset(tag)
    }
  }

  const tags = [
    { key: 'all', text: '全部' },
    { key: 'clothing', text: '衣服' },
    { key: 'accessory', text: '配饰' }
  ]

  const path = location.query.filter_terms
  const tagsCurrent =
    path === 'clothing' || path === 'accessory' ? tags.slice(1) : tags

  return (
    <>
      <div className="header-wrapper">
        <div className="header">{perfectCloset ? '满分单品' : '收藏单品'}</div>
        <div className="switch-wrapper">
          <div className="switch-text">在架优先</div>
          <Switch
            onChangeSwitchValue={onChangeSwitchValue}
            perfectCloset={perfectCloset}
            productSort={sort}
          />
        </div>
      </div>
      <div className="content">
        <div className="filter-tab">
          {tagsCurrent.map(tag => {
            return (
              <div
                className={
                  tag.key === filterTermsState ? 'item-active' : 'item-default'
                }
                key={tag.key}
                onClick={() => handleSelectedSlots(tag.key)}
              >
                <div className="text">{tag.text}</div>
                <div className="bar"></div>
              </div>
            )
          })}
        </div>
        <div className="divider"></div>
        <div
          className="more-filter-button"
          onClick={() => showFilterModal(filter_terms)}
        >
          <div className="text">更多筛选</div>
          <div className="arrow" />
        </div>
      </div>
    </>
  )
}

export default React.memo(FilterCard)
