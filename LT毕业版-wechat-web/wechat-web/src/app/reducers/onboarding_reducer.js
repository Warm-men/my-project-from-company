const initialState = {
  routerList: [
    'basic_data',
    'basic_size',
    'shape_waist',
    'shape_belly',
    'shape_shoulder',
    'shape',
    'size',
    'size_skirt',
    'size_jean_fitting',
    'size_jean',
    'style'
  ],
  onboarding_questions: null,
  selectAnwers: {
    question1: [],
    question2: [],
    question3: [],
    question6: [],
    question7: []
  },
  toCompleteTheDegree: {
    page2: true
  },
  firstToteStepFivePage: 1,
  onboardingSetLoading: false
}

function reducer(state = {}, action) {
  const { response, params, step, page } = action
  switch (action.type) {
    case 'API:ONBOARDING:QUESTION:SUCCESS':
      return {
        ...state,
        onboarding_questions: JSON.parse(response.data.onboarding_questions)
      }
    case 'SET:USER:SELECT:SELECT:ANWERS':
      return setOnboardingAnwsers(state, params)
    case 'SET:ONBOARDING:COMPLETE':
      return setOnboardingComplete(state, step)
    case 'STEP:FIVE:ADD:A:PAGE':
      return {
        ...state,
        firstToteStepFivePage: page
      }
    case 'RESET:ONBOARDING:V2:STATE':
      return {
        ...state,
        selectAnwers: {
          question1: [],
          question2: [],
          question3: [],
          question6: [],
          question7: []
        },
        toCompleteTheDegree: {
          page2: true
        }
      }
    case 'SET:ONBOARDING:V2:LOADING':
      return { ...state, onboardingSetLoading: true }
    case 'RESET:ONBOARDING:V2:RESETLOADING':
      return { ...state, onboardingSetLoading: false }
    default:
      // sets initialState when state already initialized by store
      return { ...initialState, ...state }
  }
}

function setOnboardingAnwsers(state, params) {
  let selectAnwers = state.selectAnwers
  let find_index = _.findIndex(selectAnwers[params.step], item =>
    _.isEqual(item, params.answer)
  )
  if (params.step === 'question1' || params.step === 'question6') {
    if (find_index !== -1) {
      selectAnwers[params.step] = selectAnwers[params.step].filter(
        (item, index) => index !== find_index
      )
    } else {
      selectAnwers[params.step] = [...selectAnwers[params.step], params.answer]
    }
  }

  if (params.step === 'question2' || params.step === 'question7') {
    find_index = _.findIndex(selectAnwers[params.step], item =>
      _.isEqual(item.name, params.answer.name)
    )
    if (find_index !== -1) {
      selectAnwers[params.step][find_index].value = params.answer.value
    } else {
      selectAnwers[params.step] = [...selectAnwers[params.step], params.answer]
    }
  }

  if (params.step === 'question3') {
    if (find_index !== -1) {
      selectAnwers[params.step] = []
    } else {
      selectAnwers[params.step] = [params.answer]
    }
  }
  return {
    ...state,
    selectAnwers
  }
}

function setOnboardingComplete(state, step) {
  const { selectAnwers, toCompleteTheDegree, firstToteStepFivePage } = state
  if (step === 'question1' || step === 'question3' || step === 'question6') {
    toCompleteTheDegree[step] = !_.isEmpty(selectAnwers[step])
  } else if (step === 'question5') {
    toCompleteTheDegree[`page${firstToteStepFivePage}`] = _.isEmpty(
      toCompleteTheDegree[`page${firstToteStepFivePage}`]
    )
  } else {
    toCompleteTheDegree[step] = true
  }
  return {
    ...state,
    toCompleteTheDegree
  }
}

export default reducer
