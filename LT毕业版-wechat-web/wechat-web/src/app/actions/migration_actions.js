import {
  subscriptionMigrationPreview,
  subscriptionMigration
} from 'src/app/queries/queries.js'

const queryMigrationPreview = (success, error) => ({
  type: 'API:SUBSCRIPTION:MIGRATION:PREVIEW',
  API: true,
  url: '/api/query',
  method: 'POST',
  success,
  error,
  data: {
    query: subscriptionMigrationPreview
  }
})

const upgradeSubscriptionMigration = (
  id,
  success = () => {},
  error = () => {}
) => ({
  type: 'API:UPGRADE:SUBSCRIPTION:MIGRATION',
  API: true,
  url: '/api/query',
  method: 'POST',
  data: {
    query: subscriptionMigration,
    variables: {
      input: {
        subscription_type_id: id
      }
    }
  },
  success,
  error
})

export default {
  queryMigrationPreview,
  upgradeSubscriptionMigration
}
