const PER_PAGE = 50

const initialState = {
  brands: [],
  isMore: true,
  isLoading: true,
  page: 1
}

// production
const unusedBrands = [
  'delete',
  'wrong1',
  'yystyle',
  'naersi-selected',
  'cloris-meet',
  'innaeydn',
  'lnnns',
  'max-studio',
  'axs'
]

const storeBrands = (state, action) => {
  let oldBrands = state.brands,
    newbrands = action.response.data.brands,
    page = state.page + 1,
    more = newbrands.length === PER_PAGE

  newbrands = _.reject(
    newbrands,
    newbrand => !!_.find(unusedBrands, slug => newbrand.slug === slug)
  )

  const brands = [...oldBrands, ...newbrands]

  return {
    ...state,
    brands: brands,
    page: page,
    isLoading: false,
    isMore: more
  }
}

function reducer(state = initialState, action) {
  const { type } = action
  switch (type) {
    case 'API:BRANDS:FETCH:STARTED':
      return { ...state, isLoading: true }
    case 'API:BRANDS:FETCH:ERROR':
      return { ...state }
    case 'API:BRANDS:FETCH:SUCCESS':
      return storeBrands(state, action)
    case 'BRANDS:CLEAR_BRANDS':
      return { ...initialState }
    default:
      return { ...initialState, ...state }
  }
}

export default reducer
