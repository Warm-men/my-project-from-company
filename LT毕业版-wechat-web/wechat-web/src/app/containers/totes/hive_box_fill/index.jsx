import React, { Component } from 'react'
import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions'
import delay from 'src/app/lib/delay.js'
import './index.scss'
import Alert from 'src/app/components/alert/index.jsx'
import Hint from 'src/app/components/hint'

function mapStateToProps(state, props) {
  const { totes } = state
  const { toteId } = props.location.query
  let currentTote = _.find(totes.current_totes, v => {
    return v.id === Number(toteId)
  })
  return {
    currentTote
  }
}
@connect(mapStateToProps)
export default class HiveBoxFill extends Component {
  constructor(props) {
    super(props)
    const { scheduledReturnType } = props.location.query
    const scheduledReturn =
      scheduledReturnType === 'tote_scheduled_return'
        ? props.currentTote.scheduled_return
        : props.currentTote.tote_free_service.scheduled_return
    const shippingCode =
      scheduledReturn.scheduled_self_delivery &&
      scheduledReturn.scheduled_self_delivery.shipping_code
    this.oldShippingCode = shippingCode
    this.state = {
      shippingCode: shippingCode ? shippingCode : '',
      isLoading: false,
      isChange: false,
      isShowAlert: false,
      errorsMessage: null,
      isShowHint: false,
      showExpressHint: false
    }
    this.maxLength = 15
    this.hasShowExpressHint = false
  }

  pendingConfirm = () => {
    if (this.state.isLoading) {
      return null
    }
    const { scheduledAutoPickup } = this.props.location.query
    if (scheduledAutoPickup === 'true') {
      this.setState({ isShowHint: true })
    } else {
      if (!this.hasShowExpressHint) {
        this.checkExpress()
      } else {
        this.confirm()
      }
    }
  }

  checkExpress = () => {
    const { dispatch } = this.props
    const tracking_number = this.state.shippingCode + ''
    dispatch(
      Actions.totes.queryExpressStatus(
        { tracking_number },
        (dispatch, response) => {
          if (response.data.express) {
            const { present } = response.data.express
            if (!!present) {
              this.hasShowExpressHint = true
              this.setState({ showExpressHint: true })
            } else {
              this.confirm()
            }
          }
        },
        this.confirm
      )
    )
  }

  confirm = () => {
    this.setState({ isLoading: true }, this.handleSubmit)
  }

  getInput = () => {
    const { location, currentTote } = this.props
    const { scheduledReturnType } = location.query
    let input = null
    if (scheduledReturnType === 'tote_scheduled_return') {
      const { tote, tote_free_service } = currentTote.scheduled_return
      if (!!tote && !!tote_free_service) {
        input = {
          tote_id: tote.id,
          shipping_code: this.state.shippingCode + '',
          tote_free_service: {
            id: tote_free_service.id,
            return_slot_count: tote_free_service.return_slot_count
          }
        }
      } else {
        input = {
          tote_id: tote.id,
          shipping_code: this.state.shippingCode + ''
        }
      }
    } else {
      const { tote_free_service } = currentTote
      input = {
        shipping_code: this.state.shippingCode + '',
        tote_free_service: {
          id: tote_free_service.id,
          return_slot_count: tote_free_service.return_slot_count
        }
      }
    }
    return input
  }

  handleSubmit = () => {
    const { dispatch } = this.props
    const { shippingCode } = this.state
    const textReg = new RegExp('^[0-9a-zA-Z]*$')
    const isValidLength =
      shippingCode.length >= 12 && shippingCode.length <= this.maxLength
    if (!textReg.test(this.state.shippingCode) && isValidLength) {
      this.resetLoading(false)
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: (
            <div>
              输入格式有误
              <br />
              请重新填写
            </div>
          )
        })
      )
      return null
    }
    if (!this.state.shippingCode) {
      this.resetLoading(false)
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: <div>请填写快递单号</div>
        })
      )
      return null
    }
    const input = this.getInput()
    dispatch(
      Actions.totes.scheduleReturnSelfDelivery(
        { ...input },
        (dispatch, response) => {
          this.updateHiveBoxSuccess(dispatch, response)
        },
        this.handleScheduleToteError
      )
    )
  }
  handleScheduleToteError = () => {
    this.resetLoading(false)
    const { dispatch } = this.props
    dispatch(
      Actions.tips.changeTips({
        isShow: true,
        content: '提交失败',
        timer: 1.5,
        image: require('src/app/containers/real_name_auth/images/fail.svg')
      })
    )
  }

  updateHiveBoxSuccess = async (dispatch, response) => {
    const {
      router,
      location: { query }
    } = this.props
    const { errors } = response.data.ScheduleSelfDelivery
    if (!!errors && errors.length) {
      this.onShowErrorAlert(errors)
      this.resetLoading(false)
      return null
    }
    dispatch(
      Actions.tips.changeTips({
        isShow: true,
        content: '提交成功',
        timer: 1.5,
        image: require('src/app/containers/real_name_auth/images/success.svg')
      })
    )
    await delay(1500)
    this.resetLoading(false)
    await dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
    if (query.prePageName === 'totes') {
      router.go(-1)
    } else {
      router.go(-2)
    }
  }

  resetLoading = bool => {
    this.setState({
      isLoading: bool
    })
  }

  onShowErrorAlert = errors => {
    this.setState({
      isShowAlert: true,
      errorsCode: errors[0].error_code,
      errorsMessage: errors[0].message,
      title:
        errors[0].error_code === 'error_shipping_code_wrong_pattern'
          ? '该单号格式有误，请检查'
          : ''
    })
  }

  closeAlert = () => {
    const { router } = this.props
    this.setState(
      { isShowAlert: false, errorsMessage: null, title: '' },
      () => {
        if (this.state.errorsCode === 'error_shipping_code_wrong_pattern') {
          return null
        } else {
          router.go(-1)
        }
      }
    )
  }

  closeHint = () => this.setState({ isShowHint: false })

  insistConfirm = () => {
    this.setState({ isShowHint: false }, this.checkExpress)
  }

  closeExpressHint = () => this.setState({ showExpressHint: false })

  dissExpressHint = () => {
    this.setState({ showExpressHint: false }, this.confirm)
  }

  handleChange = e => {
    let text = e.target.value
    if (text.length > this.maxLength) {
      return null
    }
    const isValidLength =
      e.target.value.length <= this.maxLength && e.target.value.length >= 12
    this.setState({
      shippingCode: text.toUpperCase(),
      isChange: isValidLength && this.oldShippingCode !== e.target.value
    })
  }

  render() {
    const {
      errorsMessage,
      isShowAlert,
      isShowHint,
      title,
      showExpressHint,
      shippingCode,
      isChange,
      isLoading
    } = this.state
    const buttonViewStyle = isChange
      ? 'buttonView'
      : 'buttonView buttonViewBlue'

    return (
      <div className="hive-box-fill">
        <PageHelmet title={'快递单号'} link="/hive_box_fill" />
        <label htmlFor="shenfeng">
          顺丰快递单号
          <input
            type="text"
            onChange={this.handleChange}
            value={shippingCode}
            maxLength={this.maxLength}
            placeholder="请输入顺丰快递单号"
            id="shenfeng"
          />
        </label>
        <div
          onClick={isChange ? this.pendingConfirm : null}
          className={buttonViewStyle}
        >
          <div className={'buttonText'}>{isLoading ? `提交中...` : `提交`}</div>
        </div>
        {isShowAlert && !!errorsMessage && (
          <Alert
            icon={require('src/assets/images/fail.png')}
            title={title}
            btnText="好的"
            handleClick={this.closeAlert}
            content={errorsMessage}
          />
        )}
        {isShowHint && (
          <Hint
            content="确定更改为自行寄回方式吗？"
            isCenter={true}
            leftBtnText="取消"
            rightBtnText="确定"
            leftButton={this.closeHint}
            rightButton={this.insistConfirm}
          />
        )}
        {showExpressHint && (
          <Hint
            content="该订单已被仓库验收，请确认本次输入是否正确"
            isCenter={true}
            leftBtnText="确定无误"
            rightBtnText="重新检查"
            leftButton={this.dissExpressHint}
            rightButton={this.closeExpressHint}
          />
        )}
      </div>
    )
  }
}
