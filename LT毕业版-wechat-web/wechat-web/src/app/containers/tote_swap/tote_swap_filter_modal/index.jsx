import ButtonFilters from './tote_swap_button_filters.jsx'
import { OccasionFilterSwap } from 'src/app/containers/filter_modal/occsion_filter'
import { TheSecondLevelFilterSwap } from 'src/app/containers/filter_modal/the_second_level_filter'
import 'src/assets/stylesheets/components/desktop/tote_swap/filter_modal.scss'
import PreventScrollHOC from 'src/app/components/HOC/PreventScroll'
import { ALL_FAMILIES_LABELS, WEATHER_LABELS } from 'src/app/lib/filters.js'
import { connect } from 'react-redux'

const getState = state => ({
  allproducts: state.allproducts,
  collections: state.app.productsFilters || []
})

export default connect(getState)(PreventScrollHOC(ToteSwapFilterModal))

const SORT_LABELS = [
  { id: 'season_first_and_most_liked', name: '热门' },
  { id: 'season_first_and_newest', name: '推荐' }
]

function ToteSwapFilterModal(props) {
  const { setFilters, isClothing, hideFilterModal } = props

  const handleArr = () => {
    const secondArr = []
    let types = {},
      occasion = {}
    props.collections.forEach(v => {
      if (v.parent_slot_id) {
        secondArr.push(v)
      } else if (v.name === '品类') {
        types = v
      } else if (v.name === '场合') {
        occasion = v
      }
    })
    return { secondArr, types, occasion }
  }

  const arrDedupe = (originArr = [], newValue) => {
    return _.includes(originArr, newValue)
      ? originArr.filter(item => item !== newValue)
      : [...originArr, newValue]
  }

  const handleSetFilters = filterType => () => {
    switch (filterType.filter_flag) {
      case 'sort':
        setFilters({
          ...filters,
          sort: filterType.id,
          filter_flag: filterType.filter_flag
        })
        break
      case 'second_level':
        setFilters({
          ...filters,
          the_second_level: arrDedupe(props.the_second_level, filterType.id),
          filter_flag: filterType.filter_flag
        })
        break
      case 'colors':
        setFilters({
          ...filters,
          colors: arrDedupe(props.filters.colors, filterType.id),
          filter_flag: filterType.filter_flag
        })
        break
      case 'filter_terms':
        const isNeedClearSecondLevel = filters['filter_terms'].length === 1
        const newFilters = { ...filters }
        setFilters({
          ...newFilters,
          filter_terms: arrDedupe(props.filters['filter_terms'], filterType.id),
          filter_flag: filterType.filter_flag,
          the_second_level: isNeedClearSecondLevel ? [] : props.the_second_level
        })
        break
      case 'weather':
        setFilters({
          ...filters,
          weather: arrDedupe(props.filters['weather'], filterType.id)
        })
        break
      case 'occasion_filter':
        setFilters({
          ...filters,
          filters_occasion: arrDedupe(props.filters_occasion, filterType.id),
          filter_flag: filterType.filter_flag
        })
        break
      default:
        console.warn('Default Error!')
    }
  }

  const { secondArr, types, occasion } = handleArr()

  const { filters, isInCloset, filters_occasion, the_second_level } = props
  const secondLevelItems = _.find(secondArr, v => {
    return (
      filters.filter_terms.length === 1 &&
      v.parent_slot_id === Number(filters.filter_terms[0])
    )
  })
  const sort = _.filter(SORT_LABELS, v => v.id === filters.sort)
  return (
    <div id="tote-swap-filter-modal">
      <div className="filter-modal-background" onClick={hideFilterModal} />
      <div className="filter-modal-body">
        {!isInCloset && (
          <ButtonFilters
            options={SORT_LABELS}
            selectedOptions={_.isEmpty(sort) ? [] : [sort[0].id]}
            setFilters={handleSetFilters}
            filterTitle={'排序'}
            filter={'sort'}
          />
        )}
        <ButtonFilters
          className="categories"
          options={types.product_search_slots}
          selectedOptions={filters.filter_terms}
          setFilters={handleSetFilters}
          filterTitle="品类"
          isClothing={isClothing}
          filter={'filter_terms'}
        />
        {!_.isEmpty(secondLevelItems) && (
          <TheSecondLevelFilterSwap
            title={secondLevelItems.name}
            ITEMS={secondLevelItems.product_search_slots}
            selectedOptions={the_second_level}
            setFilters={handleSetFilters}
            filter="second_level"
          />
        )}
        <ButtonFilters
          className="filter-button-color-wrapper"
          options={ALL_FAMILIES_LABELS}
          selectedOptions={filters.colors}
          setFilters={handleSetFilters}
          filterTitle={'颜色'}
          isClothing={isClothing}
          filter="colors"
        />
        {!_.isEmpty(occasion.product_search_slots) && (
          <OccasionFilterSwap
            options={occasion.product_search_slots}
            selectedOptions={filters_occasion}
            setFilters={handleSetFilters}
            title={'场合'}
            filter="occasion_filter"
          />
        )}
        <ButtonFilters
          options={WEATHER_LABELS}
          selectedOptions={filters.weather}
          setFilters={handleSetFilters}
          filterTitle={'天气'}
          filter={'weather'}
          className="weather"
        />
        <div className="filter-modal-apply">
          <div
            className={`reset-btn ${!props.isActiveReset ? ' not-reset' : ''}`}
            onClick={props.resetFilters}
          >
            重置
          </div>
          <div className="apply-filters" onClick={props.applyFilters}>
            提交
          </div>
        </div>
      </div>
    </div>
  )
}
