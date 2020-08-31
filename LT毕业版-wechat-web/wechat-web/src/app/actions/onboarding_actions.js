import {
  createCustomerAttributePreferences,
  onboardingQuestion,
  createOnboardingToteInput,
  createCustomerAttributes
} from 'src/app/queries/queries'

const submitCustomerAttributePreferences = (postData, success) => dispatch => {
  const preferences = postData
  dispatch({
    API: true,
    type: 'API:SUBMIT_CUSTOMER_ATTRIBUTE_PREFERENCES',
    url: '/api/query',
    method: 'POST',
    data: {
      query: createCustomerAttributePreferences,
      variables: {
        input: {
          preferences
        }
      }
    },
    success
  })
}

const queryOnboardingQuestion = () => ({
  API: true,
  type: 'API:ONBOARDING:QUESTION',
  url: '/api/query',
  method: 'POST',
  data: {
    query: onboardingQuestion
  }
})

const createOnboardingNewTote = () => ({
  API: true,
  type: 'API:ONBOARDING:CREATE:NEW:TOTE',
  url: '/api/query',
  method: 'POST',
  data: {
    query: createOnboardingToteInput,
    variables: {
      input: {}
    }
  }
})

const setUserSelectAnwers = params => ({
  type: 'SET:USER:SELECT:SELECT:ANWERS',
  params
})

const createCustomerAttribute = (answers, success) => ({
  API: true,
  type: 'API:CREATE:CUSTOMER:ATTRIBUTES',
  url: '/api/query',
  method: 'POST',
  data: {
    query: createCustomerAttributes,
    variables: {
      input: {
        answers
      }
    }
  },
  success
})

const setOnboardingComplete = step => ({
  type: 'SET:ONBOARDING:COMPLETE',
  step
})

const stepFiveAddAPage = page => ({
  type: 'STEP:FIVE:ADD:A:PAGE',
  page
})

const resetOnboardingV2State = () => ({
  type: 'RESET:ONBOARDING:V2:STATE'
})

const onboardingSetLoading = () => ({
  type: 'SET:ONBOARDING:V2:LOADING'
})

const onboardingResetLoading = () => ({
  type: 'RESET:ONBOARDING:V2:RESETLOADING'
})

export default {
  submitCustomerAttributePreferences,
  queryOnboardingQuestion,
  createOnboardingNewTote,
  setUserSelectAnwers,
  createCustomerAttribute,
  setOnboardingComplete,
  stepFiveAddAPage,
  resetOnboardingV2State,
  onboardingSetLoading,
  onboardingResetLoading
}
