import ButtonFilters from 'src/app/containers/filter_modal/button_filters'
import OccasionFilter from './occsion_filter'
import TheSecondLevelFilter from './the_second_level_filter'
import { connect } from 'react-redux'
import { useState } from 'react'
import { WEATHER_LABELS, ALL_FAMILIES_LABELS } from 'src/app/lib/filters.js'
import Actions from 'src/app/actions/actions.js'
import 'src/assets/stylesheets/components/desktop/filter_modal/filter_modal.scss'
import {
  APPStatisticManager,
  ShenceStatisService
} from '../../lib/statistics/app'

const getState = state => ({
  allproducts: state.allproducts,
  collections: state.app.productsFilters || []
})

export default connect(getState)(FilterModal)
function FilterModal(props) {
  const { dispatch, allproducts, location } = props
  const { isOccasion } = location.query

  const [filters, setFilters] = useState(allproducts.filters)
  const [filters_occasion, setFiltersOccasion] = useState(
    allproducts.filters_occasion
  )
  const [the_second_level, setTheSecondLevel] = useState(
    allproducts.the_second_level
  )

  const handleSetFilters = (filterType, sensorsData) => () => {
    APPStatisticManager.service(ShenceStatisService.id).track('filter', {
      ...sensorsData
    })
    switch (filterType.filter_flag) {
      case 'occasion_filter':
        setFiltersOccasion(occasion => arrDedupe(occasion, filterType.id))
        break
      case 'second_level':
        setTheSecondLevel(level => arrDedupe(level, filterType.id))
        break
      default:
        // NOTE: 多个filter_term时，二级清空
        const { type, key, id } = filterType
        const isFilterTerms = type === 'filter_terms'
        const isNeedClearSecondLevel =
          isFilterTerms && filters['filter_terms'].length === 1
        const value = isFilterTerms ? id : key
        setFilters(oldfilter => ({
          ...oldfilter,
          [type]: arrDedupe(filters[type], value)
        }))
        setTheSecondLevel(level => (isNeedClearSecondLevel ? [] : level))
    }
  }

  const resetFilters = () => {
    if (activeReset()) {
      setFilters({
        page: 1,
        filter_terms: [],
        color_families: [],
        temperature: []
      })
      setFiltersOccasion([])
      setTheSecondLevel([])
      dispatch(Actions.allproducts.resetFilters())
    }
  }

  const applyFilters = () => {
    dispatch(
      Actions.allproducts.setFilters({
        filter_flag: 'filterMadol',
        state: {
          filters_occasion,
          the_second_level,
          filters: { ...filters, page: 1 }
        }
      })
    )
    props.router.goBack()
  }

  const arrDedupe = (originArr, newValue) => {
    return _.includes(originArr, newValue)
      ? originArr.filter(item => item !== newValue)
      : [...originArr, newValue]
  }

  const activeReset = () => {
    const { filter_terms, color_families, temperature } = filters
    return !(
      _.isEmpty(filter_terms) &&
      _.isEmpty(color_families) &&
      _.isEmpty(temperature) &&
      _.isEmpty(filters_occasion)
    )
  }

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

  const slotsFilter = (slots, isOccasion) => {
    const filter_terms = props.location.query.filter_terms
    if (isOccasion || filter_terms === 'clothing') {
      return _.filter(slots, v => v.clothing === true)
    }
    if (filter_terms === 'accessory') {
      return _.filter(slots, v => v.clothing === false)
    }
    return slots
  }

  const renderCategories = location => {
    switch (location.query.filter_terms) {
      case 'all':
        return '全部品类'
      case 'clothing':
        return '衣服'
      case 'accessory':
        return '饰品'
      default:
        return '品类'
    }
  }

  const { secondArr, types, occasion } = handleArr()
  const productSearchSlots = slotsFilter(types.product_search_slots, isOccasion)
  const { filter_terms } = filters
  const secondLevelItems = _.find(secondArr, v => {
    return !_.isEmpty(filter_terms) && v.parent_slot_id === filter_terms[0]
  })

  return (
    <div className="browse-collection-filter-modal">
      <div className="filter-modal-body">
        <ButtonFilters
          className="categories"
          options={productSearchSlots}
          selectedOptions={filters.filter_terms}
          setFilters={handleSetFilters}
          title={renderCategories(props.location)}
          filterType="filter_terms"
        />
        {filter_terms.length === 1 && !_.isEmpty(secondLevelItems) && (
          <TheSecondLevelFilter
            title={secondLevelItems.name}
            ITEMS={secondLevelItems.product_search_slots}
            selectedOptions={the_second_level}
            setFilters={handleSetFilters}
          />
        )}
        <ButtonFilters
          className="filter-button-color-wrapper"
          options={ALL_FAMILIES_LABELS}
          selectedOptions={filters.color_families}
          setFilters={handleSetFilters}
          title="颜色"
          filterType="color_families"
        />
        {!_.isEmpty(occasion) && !isOccasion && (
          <OccasionFilter
            options={occasion.product_search_slots}
            selectedOptions={filters_occasion}
            setFilters={handleSetFilters}
            title="场合"
          />
        )}
        <ButtonFilters
          className="weather"
          options={WEATHER_LABELS}
          selectedOptions={filters.temperature}
          setFilters={handleSetFilters}
          title="天气"
          filterType="temperature"
        />
        <div className="filter-modal-apply">
          <div
            className={`reset-btn ${!activeReset() ? 'not-reset' : ''}`}
            onClick={resetFilters}
          >
            重置
          </div>
          <div className="apply-filters" onClick={applyFilters}>
            保存筛选
          </div>
        </div>
      </div>
    </div>
  )
}
