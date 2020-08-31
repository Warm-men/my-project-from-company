import { popups, markPopup } from 'src/app/queries/queries.js'

const buttonState = btnState => ({
  type: 'CHANGE:BUTTON:STATE',
  btnState
})

const setMiniApp = () => ({
  type: 'SET:MINI_APP:ENV'
})

const resetButtonState = () => ({
  type: 'SET:BUTTON:STATE'
})

const abtestGiftRecieveState = giftState => ({
  type: 'ABTEST:GIFT:RECIEVE:STATE',
  giftState
})

const popupsAction = () => ({
  type: 'API:GET:POPUPS:CONTENTS',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: popups
  }
})

const closePopups = () => ({
  type: 'CLOSE:POPUPS:STATE'
})

const markPopups = id => ({
  ype: 'API:MARK:POPUP',
  API: true,
  method: 'POST',
  url: '/api/query',
  data: {
    query: markPopup,
    variables: {
      input: {
        popup_id: id
      }
    }
  }
})

const setAbtestVar = flag => ({
  type: 'SET:AB:TEST:VAR',
  flag
})

const showGlobalAlert = ({
  icon,
  title,
  content,
  textAlign,
  handleClick,
  btnText,
  children
}) => ({
  type: 'SHOW:GLOBAL:ALERT',
  payload: {
    icon,
    title,
    textAlign,
    content,
    handleClick,
    btnText,
    children
  }
})

const resetGlobalAlert = () => ({
  type: 'RESET:GLOBAL:ALERT'
})

const showGlobalHint = ({
  title,
  content,
  leftBtnText,
  rightBtnText,
  leftButton,
  rightButton,
  children,
  closeClick,
  textAlign
}) => ({
  type: 'SHOW:GLOBAL:HINT',
  payload: {
    title,
    content,
    leftBtnText,
    rightBtnText,
    leftButton,
    rightButton,
    children,
    closeClick,
    textAlign
  }
})

const resetGlobalHint = () => ({
  type: 'RESET:GLOBAL:HINT'
})

const showGlobalQuestionaire = () => ({
  type: 'SHOW:GLOBAL:QUESTIONAIRE'
})

const resetGlobalQuestionaire = () => ({
  type: 'RESET:GLOBAL:QUESTIONAIRE'
})

const addQuizShowTime = () => ({
  type: 'ADD:QUIZ:SHOW:TIME'
})

const resetQuizShowTime = () => ({
  type: 'RESET:QUIZ:SHOW:TIME'
})

export default {
  buttonState,
  abtestGiftRecieveState,
  popupsAction,
  closePopups,
  markPopups,
  resetButtonState,
  showGlobalAlert,
  resetGlobalAlert,
  showGlobalHint,
  resetGlobalHint,
  setAbtestVar,
  setMiniApp,
  showGlobalQuestionaire,
  resetGlobalQuestionaire,
  addQuizShowTime,
  resetQuizShowTime
}
