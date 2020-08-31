const initialState = {
  migration_preview: null
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'API:SUBSCRIPTION:MIGRATION:PREVIEW:SUCCESS':
      return {
        ...state,
        migration_preview: action.response.data.subscription_migration_preview
      }
    default:
      return state
  }
}

export default reducer
