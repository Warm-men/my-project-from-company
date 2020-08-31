import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import ActionButton from 'src/app/components/shared/action_button/index'
import { isValidTelephoneNum } from 'src/app/lib/validators'
import GeneralWxShareHOC from 'src/app/components/HOC/GeneralWxShare'
import { browserHistory } from 'react-router'
import { withRouter } from 'react-router'
import GetCodeBtn from './getcodebtn'
import PageHelmet from 'src/app/lib/pagehelmet'
import 'src/assets/stylesheets/components/desktop/sesamecredit/sesamecredit.scss'

@withRouter
class SesameCredit extends React.Component {
  constructor(props) {
    super(props)
    this.Data = {
      telephoneNum: ``,
      codeNum: ``
    }
    this.state = {
      isSubmit: false,
      isNewNumber: true
    }
    this.verificationCode = {}
  }

  componentWillMount() {
    window.adhoc('track', 'onboarding_14', 1)
  }

  regExpPhone = () => {
    const { telephoneNum } = this.Data
    if (!isValidTelephoneNum(telephoneNum.value)) {
      this.props.dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: `你输入的手机号不正确！`
        })
      )
      return false
    }
    return true
  }

  PostCode = () => {
    const { telephoneNum } = this.Data
    this.props.dispatch(
      Actions.sesameCredit.getPhoneCode(
        telephoneNum.value,
        (dispatch, data) => {
          const { SendVerificationCode } = data.data
          this.verificationCode = SendVerificationCode
          this.forceUpdate()
        },
        (dispatch, data) => {
          if (data.errors && data.errors.length > 0) {
            this.props.dispatch(
              Actions.tips.changeTips({
                isShow: true,
                content: data.errors[0].message
              })
            )
          }
        }
      )
    )
  }

  UpdateCustomer = () => {
    const { telephoneNum, codeNum } = this.Data

    this.setState({
      isSubmit: true
    })

    import('hash.js/lib/hash/sha/256').then(({ default: sha256 }) => {
      if (
        this.verificationCode.hashed_code !==
        sha256()
          .update(codeNum.value + this.verificationCode.salt)
          .digest('hex')
      ) {
        this.props.dispatch(
          Actions.tips.changeTips({
            isShow: true,
            content: `验证码有误`
          })
        )
        this.setState({
          isSubmit: false
        })
        return
      }

      const { customer } = this.props

      if (
        customer.telephone &&
        customer.telephone === '+86' + telephoneNum.value
      ) {
        this.props.dispatch(
          Actions.tips.changeTips({
            isShow: true,
            content: `新手机号和旧手机号不能重复哦`
          })
        )
        this.setState({
          isNewNumber: false,
          isSubmit: false
        })
        return
      }

      this.props.dispatch(
        Actions.customer.update(
          {
            telephone: telephoneNum.value,
            verification_code: codeNum.value
          },
          (dispatch, data) => {
            const { UpdateCustomer } = data.data
            if (UpdateCustomer.error) {
              return null
            }
            window.adhoc('track', 'BINDTELEPHONE_SUCCESS', 1)
            // NOTE: 有赞自动兑换卡
            if (UpdateCustomer.auto_redeem_exchange_card) {
              browserHistory.replace({
                pathname: '/plans_success',
                query: {
                  payType: 'openMember'
                }
              })
              this.props.dispatch(Actions.currentCustomer.fetchMe())
              return null
            }
            const { query } = this.props.location
            if (!_.isEmpty(query) && query.isReferral) {
              this.props.dispatch(
                Actions.currentCustomer.fetchMe(() => {
                  browserHistory.replace({
                    pathname: '/referral_plans',
                    query: {
                      ...query,
                      next_page: 'referral'
                    }
                  })
                })
              )
              return null
            }
            if (this.props.updateSuccess) {
              this.props.updateSuccess()
            } else {
              //NOTE: main: update customer's telephone
              try {
                window.adhoc('track', 'BINDTELEPHONE_NUMBER', 1)
              } catch (error) {
                console.log(error)
              }
            }
            this.props.dispatch(Actions.currentCustomer.fetchMe())
          },
          (dispatch, data) => {
            if (data.errors && data.errors.length > 0) {
              this.props.dispatch(
                Actions.tips.changeTips({
                  isShow: true,
                  content: data.errors[0].message
                })
              )
              this.setState({
                isSubmit: false,
                isNewNumber: false
              })
            }
          }
        )
      )
    })
  }

  addToWaitingListSuccess = () => {
    browserHistory.replace('waitlist')
  }

  addToWaitingListError = () => {
    browserHistory.replace('waitlist')
  }

  handleBoundedTel = query => () =>
    browserHistory.replace(`/plans_success?tel_state=${query}`)

  hadFirst() {
    const { telephoneNum } = this.Data,
      { submitButtonText, pre_wechat_menu, title } = this.props
    const disabled = _.isEmpty(telephoneNum.value) || this.state.isSubmit
    const button_text = submitButtonText ? submitButtonText : '下一步'
    return (
      <div className="sesameCreditContainer">
        <PageHelmet title={title || '绑定手机号码'} link={`/sesamecredit`} />
        {pre_wechat_menu && (
          <div className="bind-tel-text">
            如果你已是托特衣箱会员，请在此绑定手机号码
          </div>
        )}
        <div className="sesameCreditInput telephone">
          <input
            type="tel"
            maxLength={11}
            placeholder="请输入新的手机号"
            ref={input => (this.Data.telephoneNum = input)}
          />
        </div>
        <div className="sesameCreditInput code-input">
          <input
            type="tel"
            maxLength={4}
            placeholder="请输入验证码"
            ref={input => (this.Data.codeNum = input)}
          />
          <GetCodeBtn
            getTime={60}
            regExpPhone={this.regExpPhone}
            postCode={this.PostCode}
          />
        </div>
        <ActionButton
          className="update-telephone-btn"
          disabled={disabled}
          size="stretch"
          onClick={this.UpdateCustomer}
        >
          {button_text}
        </ActionButton>
      </div>
    )
  }

  render() {
    return (
      <div className="sesameCredit">
        <div style={{ position: 'relative' }}>
          <div className="sesameCreditBox">{this.hadFirst()}</div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    customer: state.customer || {}
  }
}

export default connect(mapStateToProps)(GeneralWxShareHOC(SesameCredit))
