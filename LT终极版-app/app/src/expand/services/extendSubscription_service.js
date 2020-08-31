import gql from 'graphql-tag'

const MUTATION_EXTENDSUBSCRIPTION = gql`
  mutation ExtendSubscription(
    $extendSubscriptionInput: ExtendSubscriptionInput!
  ) {
    ExtendSubscription(input: $extendSubscriptionInput) {
      clientMutationId
      errors
      order {
        id
        successful
      }
      payment {
        authorization_details
        id
        gateway
      }
    }
  }
`
export default {
  MUTATION_EXTENDSUBSCRIPTION
}
