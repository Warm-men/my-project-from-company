import { myClosetQuery } from 'src/app/queries/queries.js'
import { mapFilters } from 'src/app/lib/filters.js'

const fetchWishingCloset = (
  filters,
  filters_occasion,
  the_second_level,
  filter_terms,
  success = () => {},
  error = () => {}
) => {
  let mapFilter = mapFilters(filters, the_second_level, filters_occasion)
  /**
   *   当filters里的filter_terms不为空的时候,不管filter_terms的值
   *   当filters里的filter_terms为空,把tab页面的的筛选项放入filter_terms中
   *   并把search_context置为null
   */
  if (_.isEmpty(filters.filter_terms)) {
    mapFilter.filter.filter_terms = filter_terms === 'all' ? [] : [filter_terms]
    mapFilter.search_context = null
  }
  let variables = {
    filters: mapFilter.filter,
    search_context: mapFilter.search_context,
    in_closet: true
  }
  return {
    type: 'API:MYCLOSET',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: myClosetQuery,
      variables,
      filter_terms
    }
  }
}

const fetchPerfectCloset = (
  filters,
  filters_occasion,
  the_second_level,
  filter_terms,
  success = () => {},
  error = () => {}
) => {
  let mapFilter = mapFilters(filters, the_second_level, filters_occasion)
  if (_.isEmpty(filters.filter_terms)) {
    mapFilter.filter.filter_terms = filter_terms === 'all' ? [] : [filter_terms]
    mapFilter.search_context = null
  }
  let variables = {
    filters: mapFilter.filter,
    search_context: mapFilter.search_context,
    in_perfect_closet: true
  }
  return {
    type: 'API:MYCLOSET',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: myClosetQuery,
      variables,
      filter_terms
    }
  }
}

const setWishingClosetFilter = newFilter => ({
  type: 'API:MYCLOSET_WISHING_FILTER',
  wishing_closet_filter: newFilter
})

const setPerfectClosetFilter = newFilter => ({
  type: 'API:MYCLOSET_PERFECT_FILTER',
  perfect_closet_filter: newFilter
})

const setWishingClosetSort = newSort => ({
  type: 'API:MYCLOSET_WISHING_SORT',
  wishing_closet_sort: newSort
})

const setPerfectClosetSort = newSort => ({
  type: 'API:MYCLOSET_PERFECT_SORT',
  perfect_closet_sort: newSort
})

export default {
  fetchWishingCloset,
  fetchPerfectCloset,
  setWishingClosetFilter,
  setPerfectClosetFilter,
  setWishingClosetSort,
  setPerfectClosetSort
}
