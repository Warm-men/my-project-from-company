import { format } from 'date-fns'
import { connect } from 'react-redux'
import ToteProducts from './products'
import Hint from 'src/app/components/hint'
import Alert from 'src/app/components/alert'
import Actions from 'src/app/actions/actions'
import { browserHistory } from 'react-router'
import { scheduleReturnHint } from 'src/app/lib/tote/schedule_return_hint'
import Header from 'src/app/containers/totes/components/tote_tracker/header'
import StatusBar from 'src/app/containers/totes/components/tote_tracker/status_bar'
import ActionButtons from 'src/app/containers/totes/components/tote_tracker/action_buttons'

import 'src/assets/stylesheets/components/desktop/totes/tote_tracker.scss'

class ToteTracker extends React.Component {
  constructor() {
    super()
    this.state = { showAlert: false, isShowScheduleReturnHint: false }

    this.returnHintLeftOnClick = () => {}
    this.returnHintRightOnClick = () => {}
    this.hintMessage = null
    this.hintLeftButtonText = null
    this.hintRightButtonText = null
    this.hintChildren = null

    this.quizUrl = null
  }

  componentDidMount() {
    this.getSubscribeCancelQuiz()
  }

  getSubscribeCancelQuiz = () => {
    const { dispatch } = this.props
    const input = { slug: 'QUIZSubscribeCancel' }
    dispatch(
      Actions.floatHover.getQuiz(input, (dispatch, response) => {
        const { quiz } = response.data
        if (!_.isEmpty(quiz)) {
          this.quizUrl = quiz.url
        }
      })
    )
  }

  goQuiz = () => {
    const { id } = this.props.tote

    const data = {
      pathname: '/quiz_page',
      query: { toteId: id, quizUrl: this.quizUrl, slug: 'QUIZSubscribeCancel' }
    }
    browserHistory.push(data)
  }

  checkPreToteScheduledState = () => {
    const { totes } = this.props
    const { scheduled_return } = totes[1]
    if (scheduled_return) {
      const {
        scheduled_self_delivery,
        scheduled_auto_pickup
      } = scheduled_return
      if (scheduled_self_delivery || scheduled_auto_pickup) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  returnPreTote = () => {
    const { totes } = this.props
    this.handleScheduleReturn(totes[1])
  }

  onlyReturnToteFreeService = () => {
    const toteId = this.props.tote.id
    browserHistory.push({
      pathname: `/schedule_return`,
      query: { toteId, isOnlyReturnToteFreeService: true }
    })
  }

  handleReturnButton = isTFS => {
    const { totes } = this.props
    if (isTFS) {
      if (totes.length > 1) {
        //FIXME: 这里只能查看有没有上一个衣箱来判断是否单独归还自在选，后端没有单独归还自在选的状态返回
        const checkPreToteScheduledState = this.checkPreToteScheduledState()
        if (checkPreToteScheduledState) {
          this.onlyReturnToteFreeService()
        } else {
          this.returnPreTote()
        }
      } else {
        this.onlyReturnToteFreeService()
      }
    } else {
      this.panddingScheduleReturn()
    }
  }

  panddingScheduleReturn = () => {
    const { tote } = this.props
    if (tote.scheduled_at) {
      const time = new Date(tote.scheduled_at).getTime() > new Date().getTime()
      if (time) {
        const date = format(tote.scheduled_at, 'M月D日HH点m分')
        const alertContent = `衣箱签收还未超过48小时<br>${date}后即可预约归还`
        this.setState({ showAlert: true, alertContent })
        return null
      }
    }
    const hintValue = this.handleScheduleReturnHint()
    if (hintValue.isShowedHint) {
      this.hanldeToteReturnHint(hintValue.hintContent)
      return null
    }
    this.handleScheduleReturn(tote)
  }

  hanldeToteReturnHint = hint => {
    this.hintMessage = hint.message
    this.hintChildren = hint.hintChildren
    this.hintLeftButtonText = hint.leftButtonText
    this.hintRightButtonText = hint.rightButtonText
    this.returnHintLeftOnClick = hint.leftOnClick
    this.returnHintRightOnClick = hint.rightOnClick
    this.leftButtonHighLight = hint.leftButtonHighLight
    this.setState({ isShowScheduleReturnHint: true })
  }

  handleScheduleReturn = async activeTote => {
    const { totes, dispatch } = this.props
    const hintValue = this.handleScheduleReturnHint()
    const oldToteId = hintValue.hintContent && hintValue.hintContent.toteId
    const toteId = oldToteId || activeTote.id
    const selectTote = _.find(totes, v => v.id === toteId)
    if (!selectTote.tote_rating) {
      // NOTE：没评价过去评价衣箱
      await dispatch(Actions.ratings.resetRatingStore())
      await dispatch(Actions.ratings.setRatingToteId(toteId))
      sessionStorage.setItem('RatingsToteId', toteId)
      const pushData = { pathname: `/ratings` }
      browserHistory.push(pushData)
    } else {
      const { skip_perfect_closet, perfect_closets } = selectTote
      if (!_.isEmpty(perfect_closets) || skip_perfect_closet) {
        browserHistory.push({
          pathname: `/schedule_return`,
          query: { toteId }
        })
      } else {
        browserHistory.push({
          pathname: `/perfect_closets`,
          query: { toteId }
        })
      }
    }
  }

  handleScheduleReturnHint = () => {
    const { customer, totes, tote } = this.props
    const { free_service, subscription } = customer
    const { in_first_month_and_monthly_subscriber } = customer

    const params = {
      customer: {
        subscription,
        in_first_month_and_monthly_subscriber,
        freeService: free_service
      },
      currentTotes: totes,
      tote,
      hanldeToteReturn: this.handleScheduleReturn,
      joinMember: this.joinMember,
      goQuiz: this.quizUrl ? this.goQuiz : null,
      openFreeService: this.openFreeService
    }
    const hintValue = scheduleReturnHint(params)
    return hintValue
  }

  openFreeService = () =>
    browserHistory.push({ pathname: '/open_free_service' })

  joinMember = () => {
    browserHistory.push('/plans')
  }

  handleHintLeftButton = () => {
    this.returnHintLeftOnClick()
    this.setState({ isShowScheduleReturnHint: false }, this.resetHint)
  }

  handleHintRightButton = () => {
    this.returnHintRightOnClick()
    this.setState({ isShowScheduleReturnHint: false }, this.resetHint)
  }

  resetHint = () => {
    this.hintMessage = null
    this.hintChildren = null
    this.hintLeftButtonText = null
    this.hintRightButtonText = null
    this.leftButtonHighLight = null
    this.returnHintLeftOnClick = () => {}
    this.returnHintRightOnClick = () => {}
  }

  hide = () => {
    this.setState({ showAlert: false })
  }

  //购买单品
  onClickPurchaseButton = async (id, isPurchased) => {
    const { tote, dispatch } = this.props
    const toteId = tote.id

    await dispatch(Actions.purchaseCheckout.reSetPurchaseIds())
    if (isPurchased) {
      browserHistory.push({
        pathname: `/purchased_detail`,
        query: { toteId, tote_product_id: id }
      })
      return null
    }
    const data = { pathname: `/purchase_product/${id}`, query: { toteId } }
    browserHistory.push(data)
  }

  render() {
    const { customer, customerPhotosHint, tote, isJdEnv } = this.props
    if (_.isEmpty(tote)) return null

    const productsVisible = tote.rental || tote.rateable
    return (
      <>
        <StatusBar tote={tote} />
        <div className="my-totes-tote-tracker">
          <Header
            tote={tote}
            markToteAsDelivered={this.props.markToteAsDelivered}
          />
          <ActionButtons
            tote={tote}
            isJdEnv={isJdEnv}
            customer={customer}
            customerPhotosHint={customerPhotosHint}
            dispatch={this.props.dispatch}
            handleReturnButton={this.handleReturnButton}
          />
          <div className="tote-status-products">
            {productsVisible && (
              <ToteProducts
                column={'CurrentTote'}
                products={tote.tote_products}
                showProductSize={!tote.progress_status.delivered_at}
                onClickPurchaseButton={this.onClickPurchaseButton}
              />
            )}
          </div>
          {this.state.showAlert && (
            <Alert btnText="好的" textAlign="center" handleClick={this.hide}>
              <span
                style={{ textAlign: 'center' }}
                className="tips-text"
                dangerouslySetInnerHTML={{ __html: this.state.alertContent }}
              />
            </Alert>
          )}
          {this.state.isShowScheduleReturnHint &&
            (this.hintMessage ? (
              <Hint
                isCenter={true}
                content={this.hintMessage}
                leftBtnText={this.hintLeftButtonText}
                rightBtnText={this.hintRightButtonText}
                setAllButtonsRed={!!this.leftButtonHighLight}
                leftButton={this.handleHintLeftButton}
                rightButton={this.handleHintRightButton}
              />
            ) : (
              <Hint
                isCenter={true}
                children={this.hintChildren}
                leftBtnText={this.hintLeftButtonText}
                rightBtnText={this.hintRightButtonText}
                leftButton={this.handleHintLeftButton}
                rightButton={this.handleHintRightButton}
                setAllButtonsRed={true}
              />
            ))}
        </div>
      </>
    )
  }
}

export default connect(state => ({
  isJdEnv: state.app && state.app.platform === 'jd'
}))(ToteTracker)
