import Actions from 'src/app/actions/actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import wxInit from 'src/app/lib/wx_config.js'
import { withRouter } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import * as storage from 'src/app/lib/storage.js'
import { paymentMethodId } from 'src/app/lib/payment_method_id'
import './index.scss'

const getState = state => {
  const {
    app: { platform },
    customer
  } = state
  return {
    customer,
    platform,
    isOpenFreePassword: !_.isEmpty(customer.enable_payment_contract)
  }
}
@connect(getState)
@withRouter
export default class OpenFreeServiceContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buttonText: null,
      moreFaq: false,
      isPlayingVideo: false,
      gotFreeServiceSuccess: storage.get(
        'go_to_free_service_success',
        localStorage
      )
    }
    this.free_service_type_id = null
    this.type = 'FreeServiceContractType'
  }

  componentDidMount() {
    if (this.state.gotFreeServiceSuccess) {
      storage.remove('go_to_free_service_success', localStorage)
      browserHistory.replace('/open_free_service_successful')
      return null
    }
    wxInit()
    const { dispatch, router, customer, route } = this.props
    dispatch(
      Actions.freeService.getFreeService((dispatch, res) => {
        _.map(res.data.free_service_types, v => {
          if (this.type === v.type) {
            this.free_service_type_id = v.id
          }
        })
        this.setState({ buttonText: '免费开通' })
      })
    )
    const {
      enable_payment_contract,
      in_first_month_and_monthly_subscriber,
      free_service
    } = customer
    let isMultipleQuiz = storage.get('isMultipleQuiz')
    if (
      isMultipleQuiz !== 'true' &&
      _.isEmpty(enable_payment_contract) &&
      free_service &&
      free_service.state !== 'active' &&
      free_service.state !== 'apply_refund' &&
      free_service.state !== 'approved' &&
      in_first_month_and_monthly_subscriber
    ) {
      dispatch(
        Actions.plans.getLeaveQuestionarie(
          '/hps/questionnaire/app/free_service_question_a.json'
        )
      )
      router.setRouteLeaveHook(route, nextLocation => {
        if (nextLocation.action === 'POP' && !storage.get('isShowedAlert')) {
          dispatch(Actions.app.showGlobalQuestionaire())
          dispatch(Actions.app.resetQuizShowTime())
        }
        return true
      })
    }
  }

  handleClick = () => {
    const { isOpenFreePassword } = this.props
    if (!isOpenFreePassword) {
      browserHistory.push({
        pathname: '/free_password',
        query: { openFreeService: true }
      })
      return null
    }
    const {
      customer: { payment_methods },
      platform
    } = this.props
    const payment_method_id = paymentMethodId(platform, payment_methods)
    //开通自在选
    this.props.dispatch(
      Actions.freeService.purchaseFreeService(
        {
          payment_method_id,
          free_service_type_id: this.free_service_type_id
        },
        this.extendPurchaseSuccess
      )
    )
  }

  extendPurchaseSuccess = (dispatch, data) => {
    const {
      PurchaseFreeService: { order, errors }
    } = data.data
    if (!order.successful) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: errors[0].message,
          timer: 2
        })
      )
      return null
    } else {
      const routeParam = {
        pathname: '/open_free_service_successful',
        state: this.props.location.state
      }
      if (this.props.location.state === 'new_totes')
        browserHistory.replace(routeParam)
      else {
        browserHistory.push(routeParam)
      }
    }
  }

  openHelp = () => {
    browserHistory.push('/free_service_help')
  }

  playVideo = () => {
    this.setState({ isPlayingVideo: true }, () => {
      this.video.play()
    })
  }

  openMoreFaq = () => {
    this.setState({ moreFaq: true })
  }

  openCleanFlow = () => {
    window.location.href =
      'https://static.letote.cn/free_service/clothes_clean_flow/index.html'
  }

  handleEnd = () => {
    this.setState({ isPlayingVideo: false })
  }

  render() {
    if (this.state.gotFreeServiceSuccess) {
      return null
    }
    const { isOpenFreePassword } = this.props
    const descText = isOpenFreePassword
      ? '自动续费会员可免费开通自在选服务'
      : '开通自动续费，免费享自在选特权，可随时取消'
    return (
      <div>
        <PageHelmet title="自在选" link="/open_free_service" />
        {this.state.isPlayingVideo ? (
          <video
            className="open-video"
            ref={refs => (this.video = refs)}
            controls="controls"
            preload="true"
            src="https://static.letote.cn/free_service/vedio/free_service.mp4"
            onEnded={this.handleEnd}
          />
        ) : (
          <img
            className="open-video"
            onClick={this.playVideo}
            alt=""
            src={require('../../../../assets/images/free_service/free_service_banner.png')}
          />
        )}

        <div className="free-service">
          <div className="card-container">
            <img
              alt=""
              src={require('../../../../assets/images/free_service/free_service_desc.png')}
            />
            <div className="purchase-free-service-container">
              <span className="desc-text">{descText}</span>
              {this.state.buttonText !== null && (
                <span
                  className="purchase-free-service-button"
                  onClick={this.handleClick}
                >
                  {this.state.buttonText}
                </span>
              )}
            </div>
          </div>
          <div className="card-container">
            <img
              alt=""
              src={require('../../../../assets/images/free_service/free_service_usage_help.png')}
            />
            <div onClick={this.openHelp} className="learn-more-about-container">
              <span className="learn-more-about">进一步了解>></span>
            </div>
          </div>
          <div className="card-container">
            <img alt="" src={require('./images/free_service_experience.png')} />
            <div className="purchase-free-service-container">
              <span className="desc-text">{descText}</span>
              {this.state.buttonText !== null && (
                <span
                  className="purchase-free-service-button"
                  onClick={this.handleClick}
                >
                  {this.state.buttonText}
                </span>
              )}
            </div>
          </div>

          {!this.state.moreFaq ? (
            <div className="card-container">
              <img
                alt=""
                src={require('../../../../assets/images/free_service/faq_mini.png')}
              />
              <div onClick={this.openMoreFaq} className="faq-mini-container">
                <span className="faq-mini-more" />
              </div>
              <div
                onClick={this.openCleanFlow}
                className="clothes-clean-flow-text-container"
              >
                <span className="clothes-clean-flow-text" />
              </div>
            </div>
          ) : (
            <div className="card-container">
              <div
                onClick={this.openCleanFlow}
                className="clothes-clean-flow-text-container-complete"
              >
                <span className="clothes-clean-flow-text" />
              </div>
              <img
                alt=""
                src={require('../../../../assets/images/free_service/faq_complete1.png')}
              />
              <img
                alt=""
                src={require('../../../../assets/images/free_service/faq_complete2.png')}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}
