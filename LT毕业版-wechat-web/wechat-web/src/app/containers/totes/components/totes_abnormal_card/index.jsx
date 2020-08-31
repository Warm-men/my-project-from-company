import Actions from 'src/app/actions/actions'
import RoleCard from './components/role_card'
import Order from './components/order'
import ServiceHold from './components/service_hold'
import CustomerStatus from './components/customer_status'
import ToteReturn from './components/tote_return'

import {
  isRoleCard,
  isOrder,
  isSeviceHold,
  isCustomerStatus,
  isToteReturn
} from './utils'

import './index.scss'

export class TotesAbnormalCardContainer extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Actions.totes.queryTotesStateTips())
  }

  restoreServiceHold = () => {
    const { dispatch } = this.props
    dispatch(
      Actions.app.showGlobalHint({
        content: '会员期将从今天开始恢复计算,确定要提前恢复会员吗',
        leftBtnText: '取消',
        rightBtnText: '确认',
        leftButton: this.cancelHint,
        rightButton: this.confirmRestore
      })
    )
  }

  cancelHint = () => this.props.dispatch(Actions.app.resetGlobalHint())

  confirmRestore = () => {
    const { dispatch } = this.props
    dispatch(Actions.subscription.restoreToSuspend(this.restoreSuccess))
  }

  restoreSuccess = () => {
    this.cancelHint()
    const { dispatch } = this.props
    dispatch(Actions.totes.queryTotesStateTips())
    dispatch(Actions.tips.changeTips({ isShow: true, content: `恢复会员成功` }))
  }

  render() {
    const { toteStateTips, customer, dispatch } = this.props
    if (_.isEmpty(toteStateTips)) return null

    const {
      credit_account_validation,
      transaction_validation,
      subscription_validation,
      extra_validation,
      tote_return_validation
    } = toteStateTips

    const data = {
      credit_account_validation,
      transaction_validation,
      subscription_validation,
      extra_validation,
      tote_return_validation
    }
    // const data = [
    //   {
    //     errors: [
    //       {
    //         error_code: 'urgently_return_prev_tote_with_free_service',
    //         message: '新衣箱签收已超48小时，将会产生滞还金，请尽快归还上个衣箱'
    //       }
    //     ]
    //   }
    // ]

    return (
      <div className="totes-abnormal-card-container">
        {_.map(data, (v, k) => {
          if (v && !v.success) {
            const error = v.errors[0]
            if (_.includes(isRoleCard, error.error_code)) {
              return <RoleCard key={k} customer={customer} />
            }
            if (_.includes(isOrder, error.error_code)) {
              return <Order key={k} error={error} />
            }
            if (_.includes(isCustomerStatus, error.error_code)) {
              return <CustomerStatus key={k} error={error} />
            }
            if (_.includes(isToteReturn, error.error_code)) {
              return <ToteReturn key={k} error={error} dispatch={dispatch} />
            }
            if (_.includes(isSeviceHold, error.error_code)) {
              return (
                <ServiceHold
                  key={k}
                  error={error}
                  subscription={customer.subscription}
                  restoreServiceHold={this.restoreServiceHold}
                />
              )
            }
          }
        })}
      </div>
    )
  }
}
