const initialState = {
  wishing_closet_filter: 'all',
  wishing_closet_sort: 'closet_stock_first',
  perfect_closet_filter: 'all',
  perfect_closet_sort: 'perfect_stock_first'
}

const setWishingClosetFilterState = (state, action) => {
  const { wishing_closet_filter } = action
  return { ...state, wishing_closet_filter }
}

const setWishingClosetSortState = (state, action) => {
  const { wishing_closet_sort } = action
  return { ...state, wishing_closet_sort }
}

const setPerfectClosetFilterState = (state, action) => {
  const { perfect_closet_filter } = action
  return { ...state, perfect_closet_filter }
}

const setPerfectClosetSortState = (state, action) => {
  const { perfect_closet_sort } = action
  return { ...state, perfect_closet_sort }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'API:MYCLOSET_WISHING_FILTER':
      return setWishingClosetFilterState(state, action)
    case 'API:MYCLOSET_WISHING_SORT':
      return setWishingClosetSortState(state, action)
    case 'API:MYCLOSET_PERFECT_FILTER':
      return setPerfectClosetFilterState(state, action)
    case 'API:MYCLOSET_PERFECT_SORT':
      return setPerfectClosetSortState(state, action)
    default:
      return state
  }
}
