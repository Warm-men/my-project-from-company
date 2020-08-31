import { updateStyle } from 'src/app/queries/queries.js'

/**
 * 跟新size
 * @param {*object} data
 * @param {*func} success
 */
const updateUserDataAction = ({ data, success, error }) => dispatch => {
  const newData = data
  if (newData['style']) {
    newData['style']['require_incentive'] = true
  }
  dispatch(updateStyleAction(newData, success, error))
}

//dont use this directly but as part of thunks updating style
const updateStyleAction = (variables, success = undefined, error) => {
  return {
    API: true,
    type: 'API:ONBOARDING:SUBMIT_PARTIAL_STYLE',
    url: '/api/query',
    method: 'POST',
    success,
    error,
    data: {
      query: updateStyle,
      variables
    }
  }
}

export default {
  updateUserDataAction
}
