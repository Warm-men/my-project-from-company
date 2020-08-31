const changeSubType = sub_type => ({
  type: 'CHANGE:SUBSCRIPT:TYPE',
  sub_type
})

const changeSubIds = sub_ids => ({
  type: 'SET:PLANS:SUB_IDS',
  sub_ids
})

const setInPlans = isInPlans => ({
  type: 'SET:INPLANS',
  inPlans: isInPlans
})

const resetSubIds = () => ({
  type: 'RESET:PLANS:SUB_IDS'
})

const setCardType = (cardType, isUseValue) => ({
  type: 'SET:CARD:TYPE',
  cardType,
  isUseValue
})

const setSubType = (subType, isUseValue) => ({
  type: 'SET:SUB:TYPE',
  subType,
  isUseValue
})

const getCancelQuestionarie = url => ({
  type: 'API:PLANS:QUESTIONARIE',
  API: true,
  method: 'GET',
  url
})

const getLeaveQuestionarie = url => ({
  type: 'API:QUESTIONARIE:LEAVE',
  API: true,
  method: 'GET',
  url
})

export default {
  changeSubType,
  getCancelQuestionarie,
  getLeaveQuestionarie,
  setCardType,
  setSubType,
  changeSubIds,
  resetSubIds,
  setInPlans
}
