const initialState = {
  ratingToteId: null,
  tote: {}
}

const setToteRating = (state, action) => {
  return {
    ...state,
    tote: {
      ...state.tote,
      tote_rating: {
        ...state.tote.tote_rating,
        rating: action.data.variables.tote_rating.rating
      }
    }
  }
}

const updateToteRating = (state, action) => {
  return {
    ...state,
    tote: {
      ...state.tote,
      tote_rating: {
        ...state.tote.tote_rating,
        ...action.data.toteRating
      }
    }
  }
}

const setRatingsToteId = (state, action) => {
  return {
    ...state,
    ratingToteId: action.id
  }
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:TOTES:FETCH_TOTE:SUCCESS':
      return {
        ...state,
        tote: { ...action.response.data.tote }
      }
    case 'API:RATINGS:SUBMIT_TOTE_RATING:STARTED':
      return setToteRating(state, action)
    case 'RATINGS:UPDATE_TOTE_RATING':
      return updateToteRating(state, action)
    case 'RATINGS:SET_RATING_TOTEID':
      return setRatingsToteId(state, action)
    case 'RESET:RATING:STORE':
      return initialState
    default:
      return state
  }
}

export default reducer
