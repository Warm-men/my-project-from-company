import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import classnames from 'classnames'
import ActionButton from 'src/app/components/shared/action_button/index'
import { ConnectService } from '../index'
import './index.scss'
import Actions from 'src/app/actions/actions'

class MigrationResult extends React.Component {
  constructor(props) {
    super(props)
    const {
      location: {
        query: { state, message, errorsCode }
      }
    } = props
    this.isSuccess = state === 'success'
    this.state = {
      isShowAlert: false
    }
    this.message = message
    this.errorsCode = errorsCode
  }
  componentDidMount() {
    this.props.dispatch(Actions.currentCustomer.fetchMe())
  }

  handleClick = () => {
    if (this.isSuccess) {
      browserHistory.push('/home')
    } else {
      if (this.isGotoPlans()) {
        browserHistory.push('/plans')
        return null
      }
      this.setState({ isShowAlert: true })
    }
  }

  hideAlert = () =>
    this.setState({
      isShowAlert: false
    })

  isGotoPlans = () => {
    return this.errorsCode === 'error_not_active'
  }

  render() {
    return (
      <div className="migration-result">
        <PageHelmet
          title={this.isSuccess ? '升级成功' : '升级失败'}
          link="/home"
        />
        <div
          className={classnames('migration-icon', {
            'fail-icon': !this.isSuccess
          })}
        />
        <div className="mig-result">升级{this.isSuccess ? '成功' : '失败'}</div>
        {!this.isSuccess && <div className="mig-fail">{this.message}</div>}
        <ActionButton
          actionType="secondary"
          className="migration-btn"
          onClick={this.handleClick}
        >
          {this.isSuccess
            ? '返回首页'
            : this.isGotoPlans()
            ? '立即续费'
            : '咨询客服'}
        </ActionButton>
        {this.state.isShowAlert && (
          <ConnectService hideAlert={this.hideAlert} />
        )}
      </div>
    )
  }
}

export default connect()(MigrationResult)
