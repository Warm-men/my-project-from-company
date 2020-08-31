import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import PageHelmet from 'src/app/lib/pagehelmet'
import Alert from 'src/app/components/alert'
import SingleMigration from 'src/app/containers/totes/confirm_totes/migration/single_migration.jsx'
import MoreMigration from 'src/app/containers/totes/confirm_totes/migration/more_migration.jsx'
import './index.scss'

const getState = state => {
  return {
    migration: state.migration
  }
}

@connect(getState)
class MigratoinDetails extends Component {
  state = {
    isShowAlert: false
  }

  componentDidMount() {
    this.props.dispatch(
      Actions.migrations.queryMigrationPreview(
        this.migrationPreview,
        this.migrationFail
      )
    )
  }

  migrationPreview = (dispatch, res) => {
    const { subscription_migration_preview } = res.data
    if (
      !_.isEmpty(subscription_migration_preview) &&
      !_.isEmpty(subscription_migration_preview.errors)
    ) {
      const error = subscription_migration_preview.errors[0]
      browserHistory.replace({
        pathname: '/migration_success',
        query: {
          state: 'fail',
          errorsCode: error.error_code,
          message: error.message
        }
      })
    }
  }

  handleUpgarade = subscriptionTypeId => {
    this.props.dispatch(
      Actions.migrations.upgradeSubscriptionMigration(
        subscriptionTypeId,
        this.migrationSuccess,
        this.migrationFail
      )
    )
  }

  migrationSuccess = () =>
    browserHistory.replace('/migration_success?state=success')

  migrationFail = () => {
    this.props.dispatch(
      Actions.tips.changeTips({
        isShow: false,
        content: ''
      })
    )
    browserHistory.replace('/migration_success?state=fail')
  }

  handleConsultingService = () =>
    this.setState({
      isShowAlert: true
    })

  hideAlert = () =>
    this.setState({
      isShowAlert: false
    })

  render() {
    const { migration_preview } = this.props.migration
    if (
      _.isEmpty(migration_preview) ||
      _.isEmpty(migration_preview.available_migrate_options)
    ) {
      return null
    }
    const { available_migrate_options } = migration_preview
    const { isShowAlert } = this.state
    return (
      <div>
        <PageHelmet title="会员升级" link="/migration_details" />
        {available_migrate_options.length > 1 ? (
          <MoreMigration
            handleConsultingService={this.handleConsultingService}
            options={available_migrate_options}
            handleUpgarade={this.handleUpgarade}
          />
        ) : (
          <SingleMigration
            handleConsultingService={this.handleConsultingService}
            handleUpgarade={this.handleUpgarade}
            option={available_migrate_options[0]}
          />
        )}
        {isShowAlert && (
          <div className="connect-service">
            <ConnectService hideAlert={this.hideAlert} />
          </div>
        )}
      </div>
    )
  }
}

export default MigratoinDetails

export const MigrationAlert = React.memo(({ linkToMigrationUrl }) => (
  <div className="migration-alert">
    <div className="migration-icon">
      <img src={require('./images/alert.png')} alt="migration-icon" />
      <div className="migration-btn" onClick={linkToMigrationUrl} />
    </div>
  </div>
))

export const ConnectService = React.memo(({ hideAlert }) => (
  <Alert btnText="好的" handleClick={hideAlert}>
    <span>
      开通过程有任何疑问请在微信公众号
      回复任意消息与客服进行沟通或拨打我们的客服电话：
      <a href="tel:4008070088" className="phone">
        400-807-0088
      </a>
    </span>
  </Alert>
))
