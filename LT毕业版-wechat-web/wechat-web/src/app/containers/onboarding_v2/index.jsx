import {
  compose,
  branch,
  lifecycle,
  renderNothing,
  withProps,
  withHandlers
} from 'recompose'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import PageHelmet from 'src/app/lib/pagehelmet'
import { browserHistory } from 'react-router'
import { differenceInSeconds } from 'date-fns'
import * as storage from 'src/app/lib/storage.js'
import './index.scss'
import {
  APPStatisticManager,
  ShenceStatisService
} from '../../lib/statistics/app'

const LISTPATH = [
  '/onboarding_v2/my_fashion_wish',
  '/onboarding_v2/my_style',
  '/onboarding_v2/color_of_skin',
  '/onboarding_v2/shape',
  '/onboarding_v2/basic_size',
  '/onboarding_v2/defects',
  '/onboarding_v2/scene_problem',
  '/onboarding_v2/basic_info'
]
//NOTE: next step need create customer attributes
const MATCH_STEP = [0, 1, 2, 5, 6]

const getState = state => ({
  onboarding: state.onboarding,
  customer: state.customer,
  isWechat: state.app.isWechat
})

let stepStartTime = null

const enhance = compose(
  connect(getState),
  lifecycle({
    componentWillMount() {
      stepStartTime = new Date()
      APPStatisticManager.sensor(ShenceStatisService.id).setProfile({
        ob_status: 1
      })
      this.props.dispatch(Actions.onboarding.queryOnboardingQuestion())
    },
    componentWillUnmount() {
      storage.clearAll()
      this.props.dispatch(Actions.onboarding.resetOnboardingV2State())
    }
  }),
  withProps(props => ({
    ...props,
    whichStep: _.findIndex(LISTPATH, path => path === props.location.pathname)
  })),
  withHandlers({
    onboardingNextStep: props => async (dis, res) => {
      const {
        dispatch,
        onboarding: {
          selectAnwers,
          toCompleteTheDegree,
          firstToteStepFivePage,
          onboardingSetLoading
        },
        whichStep
      } = props

      if (
        whichStep + 1 !== 5 &&
        !toCompleteTheDegree[`question${whichStep + 1}`]
      ) {
        dispatch(
          Actions.tips.changeTips({
            isShow: true,
            content: '请先填写信息',
            timer: 2
          })
        )
        return null
      } else if (
        whichStep + 1 === 5 &&
        !toCompleteTheDegree[`page${firstToteStepFivePage}`]
      ) {
        dispatch(
          Actions.tips.changeTips({
            isShow: true,
            content: '请先填写信息',
            timer: 2
          })
        )
        return null
      }

      if (
        _.includes(MATCH_STEP, whichStep) &&
        !_.isEmpty(selectAnwers[`question${whichStep + 1}`])
      ) {
        const data = selectAnwers[`question${whichStep + 1}`]
        dispatch(
          Actions.onboarding.createCustomerAttribute(data, () => {
            let content = null
            if (whichStep + 1 === 1) {
              content = {
                ob_wish: _.map(data, v => v.value).toString(),
                ob_wish_count: data.length
              }
            } else if (whichStep + 1 === 2) {
              content = {
                ob_style: _.map(data, v => `${v.name}:${v.value}`).toString()
              }
            } else if (whichStep + 1 === 3) {
              content = {
                ob_skin_color: data[0].value
              }
            } else if (whichStep + 1 === 6) {
              content = {
                ob_defect: _.map(data, v => `${v.name}:${v.value}`).toString(),
                ob_defect_count: data.length
              }
            } else if (whichStep + 1 === 7) {
              content = {
                ob_occasion: _.map(data, v => `${v.name}:${v.value}`).toString()
              }
            }
            if (!_.isEmpty(content)) {
              APPStatisticManager.sensor(ShenceStatisService.id).setProfile(
                content
              )
            }
          })
        )
      }
      if (whichStep + 1 === 4) {
        const { shape } = res.data.UpdateStyle.style
        const content = {
          ob_shape: shape
        }
        APPStatisticManager.sensor(ShenceStatisService.id).setProfile(content)
      } else if (whichStep + 1 === 8) {
        const {
          age_range,
          marital_status,
          constellation
        } = res.data.UpdateStyle.style
        const content = {
          ob_age_range: age_range,
          ob_constellation: constellation,
          ob_marital_status: marital_status
        }
        APPStatisticManager.sensor(ShenceStatisService.id).setProfile(content)
      }

      if (whichStep === 7) {
        if (onboardingSetLoading) {
          return null
        }
        await dispatch(Actions.onboarding.onboardingSetLoading())
        dispatch(
          Actions.onboarding.createOnboardingNewTote(),
          () => {},
          () => {
            dispatch(Actions.onboarding.onboardingResetLoading())
          }
        )
        APPStatisticManager.sensor(ShenceStatisService.id).setProfile({
          ob_finish_time: differenceInSeconds(new Date(), stepStartTime),
          ob_status: 2
        })
        window.adhoc('track', 'onboarding_8', 1)
        browserHistory.push('/loading_totes')
      } else {
        // NOTE: 第五页有两页
        if (whichStep + 1 === 5 && firstToteStepFivePage === 1) {
          dispatch(Actions.onboarding.stepFiveAddAPage(2))
        } else {
          browserHistory.push(LISTPATH[whichStep + 1])
          window.adhoc('track', `onboarding_${whichStep + 1}`, 1)
        }
      }
    },
    updateStyleInfo: props => (style, success = () => {}) => {
      props.dispatch(
        Actions.customerStyleInfo.updateUserDataAction({
          data: {
            style
          },
          success
        })
      )
    }
  }),
  branch(
    ({ onboarding: { onboarding_questions } }) =>
      _.isEmpty(onboarding_questions),
    renderNothing
  )
)

const OnboardingV2 = ({ children, whichStep, ...rest }) => {
  const pathname = rest.location.pathname
  return (
    <div className="onboarding-v2-container">
      <PageHelmet title="定制我的衣箱" link={pathname} />
      <div className="step">
        STEP {whichStep + 1} /{' '}
        <span className="total-page">{LISTPATH.length}</span>
      </div>
      <div className="every-page-title">
        {rest.onboarding.onboarding_questions[`question${whichStep + 1}`].title}
      </div>
      {React.cloneElement(children, rest)}
    </div>
  )
}

export const NextPage = ({ onboardingNextStep }) => (
  <span onClick={onboardingNextStep} className="next-step" />
)

export default enhance(OnboardingV2)
