const initialState = {
  more: true,
  page: 1,
  limit: 10,
  list: [],
  isEmpty: false
}

const updateMyCustomerPhotos = (state, action) => {
  const new_fetch_list = action.response.data.my_customer_photos
  if (new_fetch_list) {
    const { page, limit, list } = state
    return {
      ...state,
      page: page + 1,
      list: [...list, ...new_fetch_list],
      more: new_fetch_list.length === limit,
      isEmpty: new_fetch_list.length === 0 && list.length === 0
    }
  } else {
    return state
  }
}

const firstFetchMyCustomerPhotos = (state, action) => {
  const new_fetch_list = action.response.data.my_customer_photos
  if (new_fetch_list) {
    const { page, limit, list } = state
    return {
      ...state,
      page: page + 1,
      list: [...new_fetch_list],
      more: new_fetch_list.length === limit,
      isEmpty: new_fetch_list.length === 0 && list.length === 0
    }
  } else {
    return state
  }
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:MY_CUSTOMER_PHOTOS:COMPLETE':
      return updateMyCustomerPhotos(state, action)
    case 'API:MY_CUSTOMER_PHOTOS_INIT:COMPLETE':
      return firstFetchMyCustomerPhotos(state, action)
    default:
      return state
  }
}

export default reducer
