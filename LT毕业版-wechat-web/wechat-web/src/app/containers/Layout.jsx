import { useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import Alert from 'src/app/components/alert'
import Hint from 'src/app/components/hint'
import MobileHeaderContainer from 'src/app/containers/header/mobile/mobile_header_container'
import ClosetTips from 'src/app/components/closet_tip/index'
import Tips from 'src/app/components/tips/tips'
import Toast from 'src/app/components/tips/toast'
import authentication from 'src/app/lib/authentication'
import MiniAppReferral from 'src/app/containers/mini_app/referral_tips'
import Questionnaire from 'src/app/containers/questionnaire/plans_cancel'
import { withRouter } from 'react-router'
import * as storage from 'src/app/lib/storage.js'
// NOTE: show header white list
const HEADER_WHITE_LIST = ['/', '/home', '/totes', '/account']

const getState = state => {
  const {
    app,
    homepage,
    customer,
    plans,
    common: { showHeader }
  } = state
  return {
    app,
    homepage,
    authentication: authentication(customer),
    showHeader,
    leaveQuestionarie: plans.leaveQuestionarie,
    controlRouter: state.controlRouter,
    customer
  }
}

export function Layout(props) {
  const { dispatch } = props

  // NOTE：路由捕获，用于返回拦截等处理
  useEffect(() => {
    //  ControlRouterAction.handleRouterChange(
    //    goBackFunction,  返回的回调
    //    this.props.route, 当前的route，用在ReactRouter的setRouteLeaveHook
    //    true 是否阻止跳转
    //  )
    const { route } = props.controlRouter
    if (route) {
      props.router.setRouteLeaveHook(route, nextLocation => {
        const { controlRouter, location } = props
        const isHandle =
          nextLocation.action === 'POP' &&
          location.pathname !== nextLocation.pathname &&
          location.pathname === controlRouter.pathname
        const prevent = !(controlRouter.isPrevent && isHandle)
        isHandle && controlRouter.handleChange()
        return prevent
      })
    }
  }, [props.controlRouter])

  useEffect(() => {
    if (_.includes(HEADER_WHITE_LIST, props.location.pathname)) {
      dispatch(Actions.navigation.enableHeader())
    }
    dispatch(Actions.homepage.getHomepageOccasion())
    dispatch(Actions.searchProductContext.searchProductsFilters('app_20191016'))
  }, [])

  useEffect(() => {
    const { isShow } = props.app.globalAlertConfig
    if (isShow) dispatch(Actions.app.resetGlobalAlert())
  }, [props.location])

  useEffect(() => {
    const { location } = props
    if (_.includes(HEADER_WHITE_LIST, location.pathname)) {
      !props.showHeader && dispatch(Actions.navigation.enableHeader())
    } else {
      props.showHeader && dispatch(Actions.navigation.disableHeader())
    }
    resetGlobalQuestionaireShowState()
  }, [props.location.pathname])

  const resetGlobalQuestionaireShowState = () => {
    const { quizShowTime, globalQuestionaire } = props.app
    const { isShow } = globalQuestionaire
    const routerQuizType = storage.get('routerQuizType')
    const { pathname } = props.location
    if (!isShow) return null
    if (
      quizShowTime > 0 ||
      (routerQuizType === 'free_pass_word' &&
        pathname !== '/open_free_service' &&
        pathname !== '/free_service_help')
    ) {
      dispatch(Actions.app.resetQuizShowTime())
      dispatch(Actions.app.resetGlobalQuestionaire())
      storage.remove('routerQuizType')
      return null
    }
    dispatch(Actions.app.addQuizShowTime())
  }

  const handleCancel = () => dispatch(Actions.app.resetGlobalQuestionaire())

  const {
    platform,
    globalAlertConfig: { isShow: isShowAlert, ...alertRest },
    globalHintConfig: { isShow: isShowHint, ...hintRest },
    globalQuestionaire: { isShow: isShowQuestionaire }
  } = props.app
  const { location, authentication, leaveQuestionarie } = props
  return (
    <div className="g-layout">
      {isShowAlert ? <Alert {...alertRest} /> : null}
      {isShowHint ? <Hint {...hintRest} /> : null}
      {!_.isEmpty(leaveQuestionarie) && isShowQuestionaire && (
        <Questionnaire
          title={leaveQuestionarie.title}
          queryData={leaveQuestionarie}
          handleCancel={handleCancel}
        />
      )}
      {props.children}
      <MobileHeaderContainer />
      <MiniAppReferral
        isMiniApp={platform === 'mini_app'}
        authentication={authentication}
        location={location}
      />
      <Tips />
      <Toast />
      <ClosetTips />
    </div>
  )
}

export default connect(getState)(withRouter(Layout))
